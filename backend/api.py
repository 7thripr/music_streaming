import os

from flask import jsonify, request
from flask import current_app as app
from flask_restful import Resource, marshal, marshal_with
from flask_bcrypt import Bcrypt
from flask_security import auth_required, current_user, roles_accepted
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import logging

from .resource_marshals import *
from .models import User, db, Music, Playlist, RolesUsers, FlaggedSongs, Likes, Album, Artist
from .security import datastore
from .resource_marshals import resource_music, resource_user, resource_playlist, resource_flagged
from .cache import cache
bcrypt = Bcrypt()

class LoggedUser(Resource):
    @marshal_with(resource_user)
    def get(self):
        return current_user


class ServerStatus(Resource):
    def get(self):
        return {'status': 'ok'}
    

class AccountCount(Resource):
    @auth_required("token")
    @cache.cached(timeout=60)
    def post(self):
        user_count = RolesUsers.query.filter_by(role_id=3).count()
        creator_count = RolesUsers.query.filter_by(role_id=2).count()
        songs_count = Music.query.count()
        print("USER COUNT: ", user_count)
        print("CREATOR COUNT: ", creator_count)
        print("SONGS UPLOADED: ", songs_count)
        return jsonify({"user_count": user_count, "creator_count": creator_count, "songs_count": songs_count})
    

class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        print("RECEIVED DATA: ",data)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not password or not email:
            return jsonify({"error": "Username, email and password are required"}, 400)

        existing_user = datastore.find_user(email=email)
        if existing_user:
            return {"error": "Email already exists"}, 409

        hashed_password = generate_password_hash(password)

        new_user = datastore.create_user(username=username, email=email, password=hashed_password, roles=["user"])
        db.session.add(new_user)
        db.session.commit()

        return {"message": "User registered successfully"}, 201
    

class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        print("In User Login", email, password)
        if not email or not password:
            return {"error": "Both email and password are required"}, 400
        print("test")
        # user = datastore.find_user(email=email)
        attempt_user = User.query.filter(User.email==email).first()
        print("USER: ", attempt_user)
        if attempt_user and check_password_hash(attempt_user.password, password):
            print("user pass ok")
            return jsonify({"token": attempt_user.get_auth_token(), "email": attempt_user.email, "role": attempt_user.roles[0].name})
        else:
            app.logger.warning(f"Failed login attempt for email: {email}")
            return {"message": "Invalid username or password"}, 403


        
def allowed_file(filename):
    allowed_extensions = ["mp3", "wav", "flac"]
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def allowed_file_image(filename):
    allowed_extensions = ["jpg", "jpeg", "png"]
    print('.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions)
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def save_file_path_music(file_path_from_client, fs_uniquifier):
    if os.path.exists(file_path_from_client) and allowed_file(file_path_from_client):
        # Create a folder inside the uploads folder with the user's fs_uniquifier
        user_folder = os.path.join('static/uploads', fs_uniquifier)
        os.makedirs(user_folder, exist_ok=True)

        # Save the file to the user's folder
        filename = secure_filename(os.path.basename(file_path_from_client))
        file_path_on_server = os.path.join(user_folder, filename)

        with open(file_path_on_server, 'wb') as destination, open(file_path_from_client, 'rb') as source:
            destination.write(source.read())

        return file_path_on_server
    return None

def save_file_path_image(file_path_from_client, fs_uniquifier):
    if os.path.exists(file_path_from_client) and allowed_file_image(file_path_from_client):
        # Create a folder inside the uploads folder with the user's fs_uniquifier
        user_folder = os.path.join('static/uploads', fs_uniquifier)
        os.makedirs(user_folder, exist_ok=True)

        # Save the file to the user's folder
        filename = secure_filename(os.path.basename(file_path_from_client))
        file_path_on_server = os.path.join(user_folder, filename)

        with open(file_path_on_server, 'wb') as destination, open(file_path_from_client, 'rb') as source:
            destination.write(source.read())

        return file_path_on_server
    return None

class UploadMusic(Resource):
    @auth_required("token")
    @roles_accepted("creator", "admin")
    def post(self):
        try:
            data = request.get_json()
            print("RECEIVED DATA: ", data)
            title = data.get('title')
            image_path_from_client = data.get('image')
            artist = data.get('artist').lower()
            album = data.get('album')
            genre = data.get('genre')
            release_year = data.get('year')
            file_path_from_client = data.get('file')
            lyrics = data.get('lyrics')
            email = data.get('email')

            if not email or not title or not artist or not album or not genre or not file_path_from_client:
                return {"error": "Invalid user or all fields are required"}, 400

            user = datastore.find_user(email=email)

            saved_file_path_song = save_file_path_music(file_path_from_client, user.fs_uniquifier)
            saved_file_path_image = save_file_path_image(image_path_from_client, user.fs_uniquifier)
            print("SAVED FILE PATH: ", saved_file_path_image)

            if (
                saved_file_path_song
                and saved_file_path_image
                and allowed_file(file_path_from_client)
                and allowed_file_image(image_path_from_client)
            ):
                existing_artist = Artist.query.filter_by(name=artist).first()
                existing_album = Album.query.filter_by(title=album).first()

                if not existing_artist:
                    new_artist = Artist(name=artist)
                    db.session.add(new_artist)

                if not existing_album:
                    new_album = Album(
                        title=album,
                        release_year=release_year,
                        genre=genre,
                    )
                    db.session.add(new_album)

                new_music = Music(
                    title=title,
                    artist=artist,
                    album_title=album,
                    genre=genre,
                    image=saved_file_path_image,
                    audio_file=saved_file_path_song,
                    uploader=user.username,
                    release_year=release_year,
                    lyrics=lyrics,
                )
                db.session.add(new_music)
                db.session.commit()
                print("OK END")
                return {"message": f"File uploaded successfully to {saved_file_path_image} and {saved_file_path_song}"}
            else:
                return {"message": "File not allowed or failed to save"}

        except Exception as e:
            return {"error": str(e)}


class EditMusic(Resource):
    @roles_accepted("creator", "admin")
    def put(self):
        try:
            data = request.get_json()

            # Extract data from the request
            email = data.get('email')
            music_id = data.get('music_id')
            user = datastore.find_user(email=email)
            print("USER: ", user.username)
            # Query the Music entry to update
            music_entry = Music.query.filter_by(uploader=user.username, music_id=music_id).first()
            print("MUSIC ENTRY: ", music_entry)

            # Update the Music entry if it exists
            if music_entry:
                music_entry.title = data.get('title')
                music_entry.artist = data.get('artist')
                music_entry.album_title = data.get('album')
                music_entry.genre = data.get('genre')
                music_entry.release_year = data.get('year')
                music_entry.lyrics = data.get('lyrics')

                db.session.commit()

                return {'message': 'Music entry updated successfully'}, 200
            else:
                return {'message': 'Music entry not found'}, 404

        except Exception as e:
            return {'error': str(e)}, 500
    
    def delete(self):
        data = request.get_json()
        music_id = data.get('music_id')
        music = Music.query.filter_by(music_id=music_id).first()
        if not music:
            return {"message": "Music not found"}, 404
        db.session.delete(music)
        db.session.commit()
        return {"message": "Music deleted successfully"}, 200


class GetProfile(Resource):
    @roles_accepted("creator", "admin")
    @cache.cached(timeout=60)
    def post(self):
        try:
            data = request.get_json()
            email = data.get('email') 
            print("EMAIL: ", email)
            
            if not email:
                return {"error": "Email is required"}, 400

            user = datastore.find_user(email=email)
            print("USER: ", user.roles[0].name)

            if not user:
                return {"error": "User not found"}, 404
            user_data = marshal(user, resource_user)
            user_data["role"] = user.roles[0].name
            print("USER DATA: ", user_data)
            
            return {"user": user_data}
        except Exception as e:
            return jsonify({"error": str(e)})

        
class ApplyForCreator(Resource):
    @roles_accepted("user")
    def post(self):
        data = request.get_json()
        email = data.get('email')
        print("EMAIL: ", email)
        user = datastore.find_user(email=email)
        if not user:
            return jsonify({"message": "User not found"}), 404
        curr_role = RolesUsers.query.filter_by(user_id=user.id).first()
        print("CURR ROLE: ", curr_role.role_id)
        updated_role = RolesUsers(user_id=user.id, role_id=2)
        RolesUsers.query.filter_by(user_id=user.id, role_id=3).delete()
        print("UPDATED ROLE: ", updated_role)
        db.session.add(updated_role)
        db.session.commit()
        return {"message": "User is now promoted to creator"}, 200
    
class DemoteCreator(Resource):
    @auth_required("token")
    @roles_accepted("admin")
    def post(self):
        data = request.get_json()
        email = data.get('email')
        print("EMAIL: ", email)
        user = datastore.find_user(email=email)
        if not user:
            return {"message": "User not found"}, 404
        curr_role = RolesUsers.query.filter_by(user_id=user.id).first()
        print("CURR ROLE: ", curr_role.role_id)
        updated_role = RolesUsers(user_id=user.id, role_id=3)
        RolesUsers.query.filter_by(user_id=user.id, role_id=2).delete()
        print("UPDATED ROLE: ", updated_role)
        db.session.add(updated_role)
        db.session.commit()
        return {"message": "Creator is now demoted to creator"}, 200


class GetCreatorList(Resource):
    @auth_required("token")
    @roles_accepted("admin")
    def get(self):
        try:
            creator_list = RolesUsers.query.filter_by(role_id=2).all()
            if not creator_list:
                return {"message": "No creators found"}, 404
            return marshal(creator_list, resource_role), 200
        except Exception as e:
            logging.error("Error: %s", e)
            return {"message": "Internal Server Error"}, 500

class GetAllUsers(Resource):
    @auth_required("token")
    def get(self):
        try:
            all_users = User.query.all()
            if not all_users:
                return {"message": "No users found"}, 404
            return marshal(all_users, resource_user), 200
        except Exception as e:
            return {"error": str(e)}, 500

class GetMusic(Resource):
    @auth_required("token")
    @cache.cached(timeout=60)
    def get(self):
        try:
            all_music = Music.query.all()
            if not all_music:
                return {"message": "No music found"}, 404
            print(marshal(all_music, resource_music))
            return marshal(all_music, resource_music)
        except Exception as e:
            return {"error": str(e)}, 500
    
    def delete(self):
        data = request.get_json()
        music_id = data.get('music_id')
        print("MUSIC ID: ", music_id)
        music = Music.query.filter_by(music_id=music_id).first()
        if not music:
            return {"message": "Music not found"}, 404
        db.session.delete(music)
        db.session.commit()
        return {"message": "Music deleted successfully"}, 200
    
class GetPlaylists(Resource):
    @cache.cached(timeout=60)
    def get(self):
        all_playlists = Playlist.query.all()
        # convert all_playlists[1].song_list from a string to array of integers
        # for playlist in all_playlists:
        #     playlist.song_list = process_song_list(playlist.song_list)
        if not all_playlists:
            return {"message": "No playlists found"}, 404
        return marshal(all_playlists, resource_playlist), 200
    
class CreatePlaylist(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        name = data.get('playlist_name')
        email = data.get('email')
        song = "0"
        print("DATA: ", data)
        if not name:
            return {"error": "All fields are required"}, 400
        new_playlist = Playlist(playlist_name=name, email=email, song_list=song)
        db.session.add(new_playlist)
        db.session.commit()
        return {"message": "Playlist created successfully"}, 201
    
class AddSongToPlaylist(Resource):
    def post(self):
        data = request.get_json()
        print("DATA: ", data)
        music_id = data.get('track_id')
        playlist_id = data.get('playlist_id')
        if not music_id or not playlist_id:
            return jsonify({"error": "All fields are required"}, 404)
        music = Music.query.filter_by(music_id=music_id).first()
        playlist = Playlist.query.filter_by(playlist_id=playlist_id).first()
        print("MUSIC: ", playlist)
        if not music or not playlist:
            return {"message": "Song or playlist not found"}, 404
        playlist.song_list += "," + str(music_id)
        db.session.add(playlist)
        db.session.commit()
        return {"message": "Music added to playlist successfully"}, 404
    

class RemoveSongFromPlaylist(Resource):
    def post(self):
        data = request.get_json()
        music_id = data.get('music_id')
        playlist_id = data.get('playlist_id')
        if not music_id or not playlist_id:
            return {"error": "All fields are required"}, 400
        music = Music.query.filter_by(music_id=music_id).first()
        playlist = Playlist.query.filter_by(playlist_id=playlist_id).first()
        if not music or not playlist:
            return {"message": "Music or playlist not found"}, 404
        playlist.song_list.remove(music)
        db.session.commit()
        return {"message": "Music removed from playlist successfully"}, 200
    

class DeletePlaylist(Resource):
    def post(self):
        data = request.get_json()
        print("DATA: ", data)
        playlist_id = data.get('playlist_id')
        playlist = Playlist.query.filter_by(playlist_id=playlist_id).first()
        if not playlist:
            return jsonify({"message": "Playlist not found"})
        db.session.delete(playlist)
        db.session.commit()
        response_data = {"message": "Playlist deleted successfully"}
        print("RESPONSE DATA: ", response_data)
        return jsonify(response_data)
    
def process_song_list(song_list):
    song_list = [int(i) for i in song_list.split(',')]
    return song_list

def get_music_from_id(music_id):
    music = Music.query.filter_by(music_id=music_id).first()
    print("MUSIC: ", music)

class GetPlaylist(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        playlist_id = int(data.get('playlist_id'))
        playlist = Playlist.query.filter_by(playlist_id=playlist_id).first()
        if not playlist:
            return jsonify({"message": "Playlist not found"})
        return marshal(playlist, resource_playlist)
    
class GetSong(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        # print("DATA: ", data)
        music_id = data.get('song_id')
        music = Music.query.filter_by(music_id=music_id).first_or_404()
        print("MUSIC: ", music)
        if not music:
            return {"message": "Music not found"}
        return marshal(music, resource_music)

class DeleteSongFromPlalist(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        print("DATA: ", data)
        music_id = data.get('track_id')
        playlist_id = data.get('playlist_id')
        playlist = Playlist.query.filter_by(playlist_id=playlist_id).first()
        if not playlist:
            return jsonify({"message": "Playlist not found"})
        playlist.song_list = process_song_list(playlist.song_list)
        playlist.song_list.remove(music_id)
        playlist.song_list = ','.join(str(i) for i in playlist.song_list)
        db.session.commit()
        return {"message": "Song removed from playlist successfully"}, 200
    
class UpdateListenCount(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        print("DATA: ", data)
        music_id = data.get('music_id')
        music = Music.query.filter_by(music_id=music_id).first()
        if not music:
            print("MUSIC NOT FOUND")
            return {"message": "Music not found"}, 400
        music.listened += 1
        db.session.commit()
        return jsonify({"count": music.listened})

def get_song_from_id(music_id):
    music = Music.query.filter_by(music_id=music_id).first()
    return music

class ReportSong(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        print("DATA: ", data)
        music_id = data.get('music_id')
        # add the music id to the flagged songs table
        flagged_song = FlaggedSongs(music_id=music_id)
        db.session.add(flagged_song)
        db.session.commit()
        return {"message": "Music reported successfully"}
    
    def get(self):
        flagged_songs = FlaggedSongs.query.all()
        print("TEST TEST TEST")
        if not flagged_songs:
            return {"message": "No flagged songs found"}, 404
        return marshal(flagged_songs, resource_flagged)

    def delete(self):
        data = request.get_json()
        music_id = data.get('music_id')
        flagged_song = FlaggedSongs.query.filter_by(music_id=music_id).first()
        if not flagged_song:
            return jsonify({"message": "Flagged song not found"})
        db.session.delete(flagged_song)
        db.session.commit()
        return {"message": "Flagged song deleted successfully"}, 200
    

class LikeSong(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        print("DATA: ", data)
        music_id = data.get('music_id')
        email = data.get('email')
        if not music_id or not email:
            return {"message": "Data not received"}, 404
        user_id = User.query.filter_by(email=email).first().id
        existing_like = Likes.query.filter_by(music_id=music_id, user_id=user_id).first()
        if existing_like:
            db.session.delete(existing_like)
            db.session.commit()
            return {"message": "Music already liked"}, 201
        else:
            new_like = Likes(music_id=music_id, user_id=user_id)
            db.session.add(new_like)
            db.session.commit()
            return {"message": "Music liked successfully"}, 200
    

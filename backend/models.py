#   __  __           _      _     
#  |  \/  |         | |    | |    
#  | \  / | ___   __| | ___| |___ 
#  | |\/| |/ _ \ / _` |/ _ \ / __|
#  | |  | | (_) | (_| |  __/ \__ \
#  |_|  |_|\___/ \__,_|\___|_|___/
                                

from flask_security import RoleMixin, UserMixin
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime as dt
# from app import login_manager
import hashlib

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'Roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('User.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('Role.id'))


class User(db.Model, UserMixin):
    __tablename__ = 'User'
    id = db.Column(db.Integer,primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String,nullable=False,unique=True)
    password = db.Column(db.String(255),nullable=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='Roles_users', backref=db.backref('users', lazy='dynamic'))    
    active = db.Column(db.Boolean(), default=True)
    
    def create(username, email, password):
        # Hash the password using SHA-256
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # Create and return a User instance
        return User(username, email, hashed_password)

class Role(db.Model, RoleMixin):
    __tablename__ = 'Role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class Playlist(db.Model, UserMixin):
    __tablename__ = 'Playlist'
    playlist_id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    playlist_name = db.Column(db.String,nullable=False)
    song_list = db.Column(db.String, nullable=False)
    email = db.Column(db.String, db.ForeignKey('User.email'))

class Music(db.Model, UserMixin):
    __tablename__ = 'Music'
    music_id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    title = db.Column(db.String,nullable=False)
    audio_file = db.Column(db.String,nullable=False)
    language = db.Column(db.String,nullable=False, default='nan')
    image = db.Column(db.String, nullable=False, default='https://img.icons8.com/ios/50/sheet-music.png')
    release_year = db.Column(db.String, db.ForeignKey('Album.release_year'))
    artist = db.Column(db.String, db.ForeignKey('Artist.name'))
    genre = db.Column(db.String, db.ForeignKey('Album.genre'))
    album_title = db.Column(db.String, db.ForeignKey('Album.title'))
    uploader = db.Column(db.String, db.ForeignKey('User.username'))
    listened = db.Column(db.Integer, default=0)
    lyrics = db.Column(db.String, nullable=False, default='No lyrics available')

class Album(db.Model, UserMixin):
    __tablename__ = 'Album'
    album_id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    title = db.Column(db.String,nullable=False)
    genre = db.Column(db.String,nullable=False)
    release_year = db.Column(db.String,nullable=False)

class Artist(db.Model, UserMixin):
    __tablename__ = 'Artist'
    artist_id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    name = db.Column(db.String,nullable=False)

class Likes(db.Model):
    likes_id = db.Column(db.Integer,primary_key = True, autoincrement = True)
    music_id = db.Column(db.Integer, db.ForeignKey("Music.music_id"),nullable = False)
    user_id = db.Column(db.Integer,db.ForeignKey("User.id"),nullable = False)

class FlaggedSongs(db.Model):
    id = db.Column(db.Integer,primary_key = True, autoincrement = True)
    music_id = db.Column(db.Integer,db.ForeignKey("Music.music_id"),nullable = False)

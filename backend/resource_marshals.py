from flask_restful import fields

resource_follower = {
    "id" : fields.Integer,
    "username" : fields.String,
    "email" : fields.String,
}

resource_user = {
    "id" : fields.Integer,
    "email" : fields.String,
    "active" : fields.Boolean,
    "username" : fields.String,
}
resource_music = {
    "album_title" : fields.String,
    "artist" : fields.String,
    "audio_file" : fields.String,
    "image" : fields.String,
    "genre" : fields.String,
    "language" : fields.String,
    "music_id" : fields.Integer,
    "release_year" : fields.String,
    "title" : fields.String,
    "uploader" : fields.String,
    "listened" : fields.Integer,
    "lyrics" : fields.String,
}
resource_playlist = {
    "playlist_id" : fields.Integer,
    "playlist_name" : fields.String,
    "email" : fields.String,
    "song_list" : fields.String
}
resource_flagged = {
    "id" : fields.Integer,
    "music_id" : fields.Integer,
}
resource_role = {
    "id" : fields.Integer,
    "user_id" : fields.Integer,
    "role_id" : fields.Integer,
}
resource_users = fields.List(fields.Nested(resource_user))
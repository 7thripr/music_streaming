#    ____   _____ __  __           _      
#   / __ \ / ____|  \/  |         (_)     
#  | |  | | (___ | \  / |_   _ ___ _  ___ 
#  | |  | |\___ \| |\/| | | | / __| |/ __|
#  | |__| |____) | |  | | |_| \__ \ | (__ 
#   \____/|_____/|_|  |_|\__,_|___/_|\___|

from flask import Flask, render_template
from flask import current_app as app
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_uploads import configure_uploads, UploadSet
from flask_security import Security
from flask_uploads import UploadSet
from celery.schedules import crontab


from backend.config import Config
from backend.cache import cache
from backend.workers import celery_init_app
from backend.security import datastore
from backend.task import daily_email, monthly_email
from backend.models import User, Role, db, Music
from jinja2 import Template

bcrypt = Bcrypt()
uploads = UploadSet('audios', extensions=('mp3', 'wav', 'flac'))

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    bcrypt.init_app(app)
    cache.init_app(app)
    app.security = Security(app, datastore)


    with app.app_context():
        import backend.api
    
    return app

app = create_app()
api = Api(app,prefix='/api')
celery_app = celery_init_app(app)
celery_app.conf.timezone = 'Asia/Kolkata'

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=12, minute=7),
        daily_email.s('prakashrishabh01@gmail.com', 'Daily Mail Test'),
    )

    sender.add_periodic_task(
        crontab(hour=0, minute=0, day_of_month=0),
        monthly_email.s('prakashrishabh01@gmail.com', 'Monthly Mail Test'),
    )

from backend.api import ServerStatus, AccountCount, UserRegistration, UserLogin, UploadMusic, GetProfile, \
    ApplyForCreator, GetMusic, GetPlaylists, CreatePlaylist, AddSongToPlaylist, RemoveSongFromPlaylist, \
    DeletePlaylist, GetPlaylist, LoggedUser, EditMusic, GetSong, DeleteSongFromPlalist, UpdateListenCount, \
    ReportSong, GetCreatorList, GetAllUsers, LikeSong, DemoteCreator

api.add_resource(LoggedUser,'/logged_user')
api.add_resource(ServerStatus, '/status')
api.add_resource(AccountCount, '/account-count')
api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/universal-login')
api.add_resource(UploadMusic, '/upload-music')
api.add_resource(GetProfile, '/profile')
api.add_resource(ApplyForCreator, '/applycreator')
api.add_resource(GetMusic, '/musicinfo')
api.add_resource(GetPlaylists, '/playlistinfo')
api.add_resource(CreatePlaylist, '/create-playlists')
api.add_resource(AddSongToPlaylist, '/add-to-playlist')
api.add_resource(RemoveSongFromPlaylist, '/remove-from-playlist')
api.add_resource(DeletePlaylist, '/delete-playlist')
api.add_resource(GetPlaylist, '/get-playlist')
api.add_resource(EditMusic, '/edit-music')
api.add_resource(GetSong, '/get-song')
api.add_resource(DeleteSongFromPlalist, '/delete-song-from-playlist')
api.add_resource(UpdateListenCount, '/update-listencount')
api.add_resource(ReportSong, '/report-song')
api.add_resource(GetCreatorList, '/get-creator-list')
api.add_resource(GetAllUsers, '/get-all-users')
api.add_resource(LikeSong, '/like-song')
api.add_resource(DemoteCreator, '/demote-creator')


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)

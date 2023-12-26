#    _____             __ _       
#   / ____|           / _(_)      
#  | |     ___  _ __ | |_ _  __ _ 
#  | |    / _ \| '_ \|  _| |/ _` |
#  | |___| (_) | | | | | | | (_| |
#   \_____\___/|_| |_|_| |_|\__, |
#                            __/ |
#                           |___/ 
class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SECRET_KEY = 'fdjiufj4wmo8rauwe8fw9e99rew8fj34ref42f'
    SECURITY_PASSWORD_SALT = 'somehexastring'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOADED_MUSIC_DEST = 'uploads'
    ALLOWED_EXTENSIONS = {'mp3', 'wav', 'flac'}
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'

    REDIS_URL = 'redis://localhost:6379'
    CACHE_TYPE = 'RedisCache'
    CACHE_REDIS_HOST = 'localhost'
    CACHE_REDIS_PORT = 6379
    CACHE_DEFAULT_TIMEOUT = 300
    CACHE_REDIS_DB = 9
    REDIS_HOST = 'localhost'
    REDIS_PORT = 6379
    REDIS_DB = 0
    CACHE_REDIS_URL = 'redis://localhost:6379/0'

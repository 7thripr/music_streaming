from app import app
from backend.security import datastore
from backend.models import db, Music
from werkzeug.security import generate_password_hash

# Ensure correct initialization order
with app.app_context():
    db.create_all()

    datastore.find_or_create_role(name="admin", description="Superuser")
    datastore.find_or_create_role(name="creator", description="Creator")
    datastore.find_or_create_role(name="user", description="User")

    db.session.commit()

    if not datastore.find_user(email="admin@os.com"):
        datastore.create_user(username="admeme", email="admin@os.com", password=generate_password_hash("admin"), roles=["admin"])

    if not datastore.find_user(email="creator1@os.com"):
        datastore.create_user(username = "creator1", email="creator1@os.com", password=generate_password_hash("creator1"), roles=["creator"], active=False)

    if not datastore.find_user(email="user1@os.com"):
        datastore.create_user(username = "user2", email="user1@os.com", password=generate_password_hash("user1"), roles=["user"])

    if not datastore.find_user(email="user2@os.com"):
        datastore.create_user(username = "user2",email="user2@os.com", password=generate_password_hash("user2"), roles=["user"])

    db.session.commit()

    # Add some music
    music1 = Music(title= "Flute",image= "/home/rishabh/Downloads/flute.jpg",artist= "flute-sample",album_title= "Sample",genre= "Classical",release_year= 2023,audio_file= "/home/rishabh/Downloads/flute.wav")
    db.session.add(music1)
    print("Database initialized!")

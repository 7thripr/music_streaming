# music_streaming
UBUNTU SETUP TUTORIAL - (Followed on Ubuntu 23.10)

Terminal 1

    Create a Virtual Environment
    
    --> python3 -m venv env

    Start the Virtual Environment
    --> source ./env/bin/activate

    Install the reqirements
    --> pip install -r requirements.txt

    Initialize Basic data
    --> python3 initial_data_db_create.py

    Start the app
    --> python3 app.py

Terminal 2 
    Start MailHog
    
    --> sudo apt-get -y install golang-go
    
    --> go get github.com/mailhog/MailHog
    
    --> ~/go/bin/MailHog

Terminal 3

    Start Redis Server
    
    --> redis-server --port 6380 --slaveof 127.0.0.1 6379

Terminal 4

    Start Celery Worker
    
    --> source ./env/bin/activate
    
    --> celery -A app.celery_app worker --loglevel=info

Terminal 5

    --> source ./env/bin/activate
    
    --> celery -A app.celery_app beat --loglevel=info -l debug --max-interval 5


NOTE - 

    To call worker instantly
    
    celery -A app.celery_app call app.monthly_email
    
    celery -A app.celery_app call app.daily_reminder

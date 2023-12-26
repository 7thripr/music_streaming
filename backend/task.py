from celery import shared_task
from jinja2 import Template
from flask import render_template
from datetime import datetime

from backend.models import User, Role, Music
from backend.mail_service import send_mail


@shared_task(ignore_result=True)

def daily_email(to, subject):
    subject = "Daily Reminder"
    music_list = Music.query.order_by(Music.listened.desc()).limit(5).all()
    email_content = render_template('mail.html', subject=subject, music_list=music_list)
    send_mail(to, subject, email_content)
    
    return "Daily reminder sent successfully!"


@shared_task(ignore_result=True)
def monthly_email(to, subject):
    subject = "Monthly Reminder"
    music_list = Music.query.order_by(Music.listened.desc()).limit(5).all()

    email_content = render_template('monthly.html', subject=subject, music_list=music_list)
    send_mail(to, subject, email_content)
    
    return "Monthly reminder sent successfully!"
# models.py
from mongoengine import Document, StringField, ReferenceField, DateTimeField
from datetime import datetime

class User(Document):
    username = StringField(required=True, unique=True)
    password = StringField(required=True)

class Note(Document):
    title = StringField(required=True)
    content = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    user = ReferenceField(User)

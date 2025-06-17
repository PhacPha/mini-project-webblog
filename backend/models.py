# models.py
from mongoengine import Document, StringField, ReferenceField, DateTimeField, ListField
from datetime import datetime

class User(Document):
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    bio = StringField()
    avatar = StringField()

class Post(Document):
    title = StringField(required=True)
    content = StringField(required=True)
    summary = StringField()
    tags = ListField(StringField())
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    user = ReferenceField(User)
    likes = ListField(ReferenceField(User))
    comments = ListField(ReferenceField('Comment'))

class Comment(Document):
    content = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    user = ReferenceField(User)
    post = ReferenceField(Post)

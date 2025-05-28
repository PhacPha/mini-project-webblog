# app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mongoengine import MongoEngine
from config import Config

from routes.auth import auth
from routes.notes import notes

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
JWTManager(app)
MongoEngine(app)

# Register routes
app.register_blueprint(auth, url_prefix='/api')
app.register_blueprint(notes, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)


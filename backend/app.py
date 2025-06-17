from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from mongoengine import connect
from config import Config

from routes.auth import auth
from routes.posts import posts

app = Flask(__name__)
app.config.from_object(Config)

# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
CORS(app, resources={r"/api/*": {"origins": "*"}})


JWTManager(app)

connect(
    db=app.config["MONGODB_SETTINGS"]["db"],
    host=app.config["MONGODB_SETTINGS"]["host"],
    port=app.config["MONGODB_SETTINGS"]["port"]
)

app.register_blueprint(auth, url_prefix="/api")
app.register_blueprint(posts, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5003)

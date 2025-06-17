# routes/auth.py
from flask import Blueprint, request, jsonify
from models import User
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"msg": "Missing username or password"}), 400
            
        if User.objects(username=data['username']):
            return jsonify({"msg": "Username already exists"}), 400
            
        hashed_pw = generate_password_hash(data['password'], method='pbkdf2:sha256')
        user = User(username=data['username'], password=hashed_pw)
        user.save()
        return jsonify({"msg": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"msg": "Missing username or password"}), 400
            
        user = User.objects(username=data['username']).first()
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({"msg": "Invalid username or password"}), 401
            
        token = create_access_token(identity=str(user.id))
        return jsonify({
            "msg": "Login successful",
            "access_token": token,
            "username": user.username
        }), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

# routes/notes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Note, User

notes = Blueprint('notes', __name__)

@notes.route('/notes', methods=['GET'])
@jwt_required()
def get_notes():
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()
    all_notes = Note.objects(user=user).order_by('-created_at')
    return jsonify([{
        "id": str(note.id),
        "title": note.title,
        "content": note.content,
        "created_at": note.created_at.strftime("%Y-%m-%d %H:%M:%S")
    } for note in all_notes])

@notes.route('/notes', methods=['POST'])
@jwt_required()
def create_note():
    user_id = get_jwt_identity()
    data = request.get_json()
    user = User.objects(id=user_id).first()
    note = Note(title=data['title'], content=data['content'], user=user)
    note.save()
    return jsonify({"msg": "Note created!"})

@notes.route('/notes/<note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    data = request.get_json()
    Note.objects(id=note_id).update_one(**data)
    return jsonify({"msg": "Note updated!"})

@notes.route('/notes/<note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    Note.objects(id=note_id).delete()
    return jsonify({"msg": "Note deleted!"})

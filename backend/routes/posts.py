# routes/posts.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Post, User, Comment
from datetime import datetime

posts = Blueprint('posts', __name__)

@posts.route('/posts', methods=['GET'])
def get_posts():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    tag = request.args.get('tag')
    
    query = Post.objects
    if tag:
        query = query.filter(tags=tag)
    
    posts = query.order_by('-created_at').skip((page-1)*per_page).limit(per_page)
    total = query.count()
    
    return jsonify({
        "posts": [{
            "id": str(post.id),
            "title": post.title,
            "summary": post.summary,
            "content": post.content,
            "tags": post.tags,
            "created_at": post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": post.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
            "author": {
                "id": str(post.user.id),
                "username": post.user.username,
                "avatar": post.user.avatar
            },
            "likes_count": len(post.likes),
            "comments_count": len(post.comments)
        } for post in posts],
        "total": total,
        "page": page,
        "per_page": per_page
    })

@posts.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.get_json()
    user = User.objects(id=user_id).first()
    
    post = Post(
        title=data['title'],
        content=data['content'],
        summary=data.get('summary', ''),
        tags=data.get('tags', []),
        user=user
    )
    post.save()
    return jsonify({"msg": "Post created!", "id": str(post.id)})

@posts.route('/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.objects(id=post_id).first()
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    return jsonify({
        "id": str(post.id),
        "title": post.title,
        "content": post.content,
        "summary": post.summary,
        "tags": post.tags,
        "created_at": post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "updated_at": post.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        "author": {
            "id": str(post.user.id),
            "username": post.user.username,
            "avatar": post.user.avatar
        },
        "likes_count": len(post.likes),
        "comments": [{
            "id": str(comment.id),
            "content": comment.content,
            "created_at": comment.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "author": {
                "id": str(comment.user.id),
                "username": comment.user.username,
                "avatar": comment.user.avatar
            }
        } for comment in post.comments]
    })

@posts.route('/posts/<post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    user_id = get_jwt_identity()
    post = Post.objects(id=post_id).first()
    
    if not post or str(post.user.id) != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.get_json()
    post.update(
        title=data.get('title', post.title),
        content=data.get('content', post.content),
        summary=data.get('summary', post.summary),
        tags=data.get('tags', post.tags),
        updated_at=datetime.utcnow()
    )
    return jsonify({"msg": "Post updated!"})

@posts.route('/posts/<post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    user_id = get_jwt_identity()
    post = Post.objects(id=post_id).first()
    
    if not post or str(post.user.id) != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    post.delete()
    return jsonify({"msg": "Post deleted!"})

@posts.route('/posts/<post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    user_id = get_jwt_identity()
    post = Post.objects(id=post_id).first()
    user = User.objects(id=user_id).first()
    
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    if user in post.likes:
        post.likes.remove(user)
        action = "unliked"
    else:
        post.likes.append(user)
        action = "liked"
    
    post.save()
    return jsonify({"msg": f"Post {action}!", "likes_count": len(post.likes)})

@posts.route('/posts/<post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    post = Post.objects(id=post_id).first()
    user = User.objects(id=user_id).first()
    
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    comment = Comment(
        content=data['content'],
        user=user,
        post=post
    )
    comment.save()
    post.comments.append(comment)
    post.save()
    
    return jsonify({
        "msg": "Comment added!",
        "comment": {
            "id": str(comment.id),
            "content": comment.content,
            "created_at": comment.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "author": {
                "id": str(user.id),
                "username": user.username,
                "avatar": user.avatar
            }
        }
    })

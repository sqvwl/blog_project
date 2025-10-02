from .models import User, Post
from .database import users, posts, next_user_id, next_post_id
from datetime import datetime

def create_user(email, login, password):
    global next_user_id
    user = User(next_user_id, email, login, password)
    users.append(user)
    next_user_id += 1
    return user

def get_user(user_id):
    for u in users:
        if u.id == user_id:
            return u
    return None

def update_user(user_id, email=None, login=None, password=None):
    user = get_user(user_id)
    if not user:
        return None
    if email:
        user.email = email
    if login:
        user.login = login
    if password:
        user.password = password
    user.updatedAt = datetime.now()
    return user

def delete_user(user_id):
    global users
    user = get_user(user_id)
    if not user:
        return False
    users = [u for u in users if u.id != user_id]
    return True

def create_post(authorId, title, content):
    global next_post_id
    post = Post(next_post_id, authorId, title, content)
    posts.append(post)
    next_post_id += 1
    return post

def get_post(post_id):
    for p in posts:
        if p.id == post_id:
            return p
    return None

def update_post(post_id, title=None, content=None):
    post = get_post(post_id)
    if not post:
        return None
    if title:
        post.title = title
    if content:
        post.content = content
    post.updatedAt = datetime.now()
    return post

def delete_post(post_id):
    global posts
    post = get_post(post_id)
    if not post:
        return False
    posts = [p for p in posts if p.id != post_id]
    return True

from datetime import datetime
from typing import Optional

from .database import next_post_id, next_user_id, posts, users  # noqa: F401
from .models import Post, User


def create_user(email: str, login: str, password: str) -> User:
    global next_user_id
    user = User(next_user_id, email, login, password)
    users.append(user)
    next_user_id += 1
    return user


def get_user(user_id: int) -> Optional[User]:
    for u in users:
        if u.id == user_id:
            return u
    return None


def update_user(
    user_id: int,
    email: Optional[str] = None,
    login: Optional[str] = None,
    password: Optional[str] = None,
) -> Optional[User]:
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


def delete_user(user_id: int) -> bool:
    global users
    user = get_user(user_id)
    if not user:
        return False
    users = [u for u in users if u.id != user_id]
    return True


def create_post(authorId: int, title: str, content: str) -> Post:
    global next_post_id
    post = Post(next_post_id, authorId, title, content)
    posts.append(post)
    next_post_id += 1
    return post


def get_post(post_id: int) -> Optional[Post]:
    for p in posts:
        if p.id == post_id:
            return p
    return None


def update_post(
    post_id: int, title: Optional[str] = None, content: Optional[str] = None
) -> Optional[Post]:
    post = get_post(post_id)
    if not post:
        return None
    if title:
        post.title = title
    if content:
        post.content = content
    post.updatedAt = datetime.now()
    return post


def delete_post(post_id: int) -> bool:
    global posts
    post = get_post(post_id)
    if not post:
        return False
    posts = [p for p in posts if p.id != post_id]
    return True

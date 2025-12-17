from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session, joinedload

from .models import Comment, Favorite, Like, Post, User


def create_user(db: Session, email: str, login: str, password: str) -> User:
    user = User(email=email, login=login, password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def update_user(
    db: Session,
    user_id: int,
    email: Optional[str] = None,
    login: Optional[str] = None,
    password: Optional[str] = None,
) -> Optional[User]:
    user = get_user(db, user_id)
    if not user:
        return None
    if email is not None:
        user.email = email
    if login is not None:
        user.login = login
    if password is not None:
        user.password = password
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> bool:
    user = get_user(db, user_id)
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True


def create_post(db: Session, author_id: int, title: str, content: str) -> Post:
    post = Post(author_id=author_id, title=title, content=content)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def get_posts(db: Session):
    return (
        db.query(Post)
        .options(
            joinedload(Post.author),
            joinedload(Post.likes),
            joinedload(Post.comments).joinedload(Comment.user),
        )
        .order_by(Post.created_at.desc())
        .all()
    )


def get_post(db: Session, post_id: int):
    return (
        db.query(Post)
        .options(joinedload(Post.author))
        .filter(Post.id == post_id)
        .first()
    )


def update_post(
    db: Session,
    post_id: int,
    title: Optional[str] = None,
    content: Optional[str] = None,
) -> Optional[Post]:
    post = get_post(db, post_id)
    if not post:
        return None
    if title is not None:
        post.title = title
    if content is not None:
        post.content = content
    post.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(post)
    return post


def delete_post(db: Session, post_id: int) -> bool:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        return False
    db.delete(post)
    db.commit()
    return True


def add_comment(db: Session, post_id: int, user_id: int, text: str):
    db_comment = Comment(post_id=post_id, user_id=user_id, text=text)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


def toggle_like(db: Session, post_id: int, user_id: int):
    existing_like = (
        db.query(Like).filter(Like.post_id == post_id,
                              Like.user_id == user_id).first()
    )
    if existing_like:
        db.delete(existing_like)
        db.commit()
        return False
    new_like = Like(post_id=post_id, user_id=user_id)
    db.add(new_like)
    db.commit()
    return True


def get_favorites(db: Session,
                  user_id: int):
    return db.query(Post).join(Favorite).filter(Favorite.user_id == user_id).all()


def get_user_favorites(db: Session, user_id: int):
    fav_records = db.query(Favorite).filter(Favorite.user_id == user_id).all()
    post_ids = [f.post_id for f in fav_records]

    if not post_ids:
        return []

    return (
        db.query(Post)
        .options(
            joinedload(Post.author),
            joinedload(Post.comments).joinedload(Comment.user),
            joinedload(Post.likes),
        )
        .filter(Post.id.in_(post_ids))
        .all()
    )

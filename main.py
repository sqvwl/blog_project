from typing import List

from cachetools import TTLCache
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.db import Base, engine, get_db

cache = TTLCache(maxsize=100, ttl=300)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blog API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/users/", response_model=schemas.UserResponse)
def create_user_endpoint(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user.email, user.login, user.password)


@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user_endpoint(
    user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)
):
    updated = crud.update_user(
        db, user_id, email=user.email, login=user.login, password=user.password
    )
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated


@app.delete("/users/{user_id}")
def delete_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}


@app.post("/posts/", response_model=schemas.PostResponse)
def create_post_endpoint(post: schemas.PostCreate, db: Session = Depends(get_db)):
    return crud.create_post(db, post.author_id, post.title, post.content)


@app.get("/posts/", response_model=List[schemas.PostResponse])
def read_posts(db: Session = Depends(get_db)):
    return crud.get_posts(db)


@app.get("/posts/{post_id}", response_model=schemas.PostResponse)
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = crud.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@app.put("/posts/{post_id}", response_model=schemas.PostResponse)
def update_post_endpoint(
    post_id: int, post: schemas.PostUpdate, db: Session = Depends(get_db)
):
    updated = crud.update_post(db, post_id, title=post.title, content=post.content)
    if not updated:
        raise HTTPException(status_code=404, detail="Post not found")
    return updated


@app.delete("/posts/{post_id}")
def delete_post_endpoint(post_id: int, user_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Пост не найден")

    if post.author_id != user_id:
        raise HTTPException(status_code=403, detail="Нельзя удалять чужие посты!")

    crud.delete_post(db, post_id)
    return {"status": "success"}


@app.post("/token", response_model=schemas.Token)
def login(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.login == user_data.login).first()
    if not user or user.password != user_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"access_token": "fake-token", "token_type": "bearer", "user_id": user.id}


@app.get("/popular_posts")
def get_popular_posts():
    if "popular" in cache:
        return cache["popular"]
    data = {"info": "Some popular data"}
    cache["popular"] = data
    return data


@app.get("/users/search/", response_model=List[schemas.UserResponse])
def search_users(q: str, db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.login.contains(q)).all()


@app.post("/posts/{post_id}/like")
def like_post(post_id: int, user_id: int, db: Session = Depends(get_db)):
    is_liked = crud.toggle_like(db, post_id, user_id)
    return {"status": "success", "is_liked": is_liked}


@app.post("/comments/", response_model=schemas.CommentResponse)
def create_comment(comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    user = crud.get_user(db, comment.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_comment = crud.add_comment(db, comment.post_id, comment.user_id, comment.text)

    return {
        "id": db_comment.id,
        "post_id": db_comment.post_id,
        "user_id": db_comment.user_id,
        "user_login": user.login,
        "text": db_comment.text,
        "created_at": db_comment.created_at,
    }


@app.post("/posts/{post_id}/favorite")
def toggle_favorite(post_id: int, user_id: int, db: Session = Depends(get_db)):
    fav = db.query(models.Favorite).filter_by(user_id=user_id, post_id=post_id).first()
    if fav:
        db.delete(fav)
        db.commit()  # Важно!
        return {"status": "removed"}
    else:
        new_fav = models.Favorite(user_id=user_id, post_id=post_id)
        db.add(new_fav)
        db.commit()
        return {"status": "added"}


@app.get("/users/{user_id}/favorites", response_model=List[schemas.PostResponse])
def read_favorites(user_id: int, db: Session = Depends(get_db)):
    fav_posts = crud.get_user_favorites(db, user_id)
    if not fav_posts:
        return []

    result = []
    for p in fav_posts:
        if p is not None:
            result.append(
                {
                    "id": p.id,
                    "author_id": p.author_id,
                    "author_login": p.author.login if p.author else "Unknown",
                    "title": p.title,
                    "content": p.content,
                    "created_at": p.created_at,
                    "updated_at": p.updated_at,
                    "likes_count": len(p.likes) if p.likes else 0,
                    "comments": (
                        [
                            {
                                "id": c.id,
                                "post_id": c.post_id,
                                "user_id": c.user_id,
                                "user_login": c.user.login if c.user else "Anonymous",
                                "text": c.text,
                                "created_at": c.created_at,
                            }
                            for c in p.comments
                        ]
                        if p.comments
                        else []
                    ),
                }
            )
    return result

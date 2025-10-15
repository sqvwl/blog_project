from typing import Dict

from fastapi import FastAPI, HTTPException

from app import crud
from app.schemas import PostCreate, PostResponse, UserCreate, UserResponse

app = FastAPI()


@app.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate) -> Dict:
    new_user = crud.create_user(user.email, user.login, user.password)
    return new_user.__dict__


@app.get("/users/{user_id}", response_model=UserResponse)
async def read_user(user_id: int) -> Dict:
    user = crud.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.__dict__


@app.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, user: UserCreate) -> Dict:
    updated = crud.update_user(user_id, user.email, user.login, user.password)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated.__dict__


@app.delete("/users/{user_id}")
async def delete_user_endpoint(user_id: int) -> Dict[str, str]:
    deleted = crud.delete_user(user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}


@app.post("/posts/", response_model=PostResponse)
async def create_post(post: PostCreate) -> Dict:
    new_post = crud.create_post(post.authorId, post.title, post.content)
    return new_post.__dict__


@app.get("/posts/{post_id}", response_model=PostResponse)
async def read_post(post_id: int) -> Dict:
    post = crud.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post.__dict__


@app.put("/posts/{post_id}", response_model=PostResponse)
async def update_post(post_id: int, post: PostCreate) -> Dict:
    updated = crud.update_post(post_id, post.title, post.content)
    if not updated:
        raise HTTPException(status_code=404, detail="Post not found")
    return updated.__dict__


@app.delete("/posts/{post_id}")
async def delete_post_endpoint(post_id: int) -> Dict[str, str]:
    deleted = crud.delete_post(post_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "User deleted"}

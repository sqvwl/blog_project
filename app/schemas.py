from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    login: str
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    login: Optional[str] = None
    password: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    login: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int


class CommentCreate(BaseModel):
    post_id: int
    user_id: int
    text: str


class CommentResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    user_login: str
    text: str
    created_at: datetime

    class Config:
        from_attributes = True


class PostCreate(BaseModel):
    author_id: int
    title: str
    content: str


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class PostResponse(BaseModel):
    id: int
    author_id: int
    author_login: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    likes_count: int = 0
    comments: List[CommentResponse] = []

    class Config:
        from_attributes = True

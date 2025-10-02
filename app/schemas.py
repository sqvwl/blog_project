from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    login: str
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr]
    login: Optional[str]
    password: Optional[str]

class UserResponse(BaseModel):
    id: int
    email: str
    login: str
    password: str
    createdAt: datetime
    updatedAt: datetime

class PostCreate(BaseModel):
    authorId: int
    title: str
    content: str

class PostUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]

class PostResponse(BaseModel):
    id: int
    authorId: int
    title: str
    content: str
    createdAt: datetime
    updatedAt: datetime
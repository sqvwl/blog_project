from .models import Post, User

users: list["User"] = []
posts: list["Post"] = []

next_user_id: int = 1
next_post_id: int = 1

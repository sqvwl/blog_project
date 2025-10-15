from datetime import datetime


class User:
    def __init__(self, id: int, email: str, login: str, password: str) -> None:
        self.id: int = id
        self.email: str = email
        self.login: str = login
        self.password: str = password
        self.createdAt: datetime = datetime.now()
        self.updatedAt: datetime = datetime.now()


class Post:
    def __init__(
        self,
        id: int,
        authorId: int,
        title: str,
        content: str,
    ) -> None:
        self.id: int = id
        self.authorId: int = authorId
        self.title: str = title
        self.content: str = content
        self.createdAt: datetime = datetime.now()
        self.updatedAt: datetime = datetime.now()

from datetime import datetime

class User:
    def __init__(self, id, email, login, password):
        self.id = id
        self.email = email
        self.login = login
        self.password = password
        self.createdAt = datetime.now()
        self.updatedAt = datetime.now()

class Post:
    def __init__(self, id, authorId, title, content):
        self.id = id
        self.authorId = authorId
        self.title = title
        self.content = content
        self.createdAt = datetime.now()
        self.updatedAt = datetime.now()

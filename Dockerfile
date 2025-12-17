FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc libsqlite3-dev && rm -rf /var/lib/apt/lists/*


COPY pyproject.toml .

RUN pip install --no-cache-dir .

RUN pip install --no-cache-dir python-jose[cryptography] passlib[bcrypt] cachetools uvicorn

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
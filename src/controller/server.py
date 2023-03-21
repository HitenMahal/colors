
from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import firestore

app = FastAPI()

# Replace with the path to your service account key file
key_path = "TOPSECRETDONOTSHARE.json"

# Initialize the Firestore client

#db = firestore.Client(project='colors-df7a2')
db = firestore.Client.from_service_account_json(key_path)

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
def get_routes():
    return

@app.get("/")
def get_users():
    users = db.collection('User').get()
    for user in users:
        print(user.to_dict())
    return users

app.get("/")
def get_user_posts(user_id):
    posts = db.collection('User').where("ID", "==", user_id)
    docs = posts.stream()
    for doc in docs:
        print(f'{doc.id} => {doc.to_dict()}')

get_user_posts("firstID1")
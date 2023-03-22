
from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import firestore
import firebase_admin
from firebase_admin import credentials

# Replace with the path to your service account key file
key_path = "TOPSECRETDONOTSHARE.json"


cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred)

app = FastAPI()

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

# Does not do anything
@app.get('/', tags=["root"])
def get_routes():
    return

#Get users - could be used for verification
@app.get('/')
def get_users():
    users = db.collection('User').get()
    return users

@app.get('/')
def get_user_posts(user_id):
    doc = db.collection('User').document(user_id).get()
    posts = doc.get("userPosts")
    print(posts)
    return

#assumes users are adding posts from the home page
@app.post('/home') #send image in bytes
def newPost(user_id, imgID, image):
    doc = db.collection("Posts").document(imgID)
    doc.set({
        "imgID": imgID,
        "img": image
    })
    doc = db.collection("User").document(user_id).get()
    num_posts = doc.get("totalPostsNum") + 1
    db.collection("User").document(user_id).update({
        'totalPostsNum': num_posts,
        'userPosts': firestore.ArrayUnion[imgID]
    })
    
    return
#assumes users are adding reactions from the home page
@app.post('/home') #send image in bytes
def newReaction(user_id, imgID, reaction):
    db.collection("Posts").document(imgID).update({
        'reactions': firestore.ArrayUnion[{user_id, reaction}]
    })
    return

#assumes users are adding friends from the home page
@app.post('/home') #send image in bytes
def addFriend(user_id, friend_id):
    db.collection("User").document(user_id).update({
        'friends': firestore.ArrayUnion[friend_id]
    })
    return


get_user_posts("firstID1")
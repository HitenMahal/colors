import numpy as np
from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import firestore
import firebase_admin
from firebase_admin import credentials
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

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

#returns a list of all of a user's post's ID's
def get_user_posts(user_id):
    doc = db.collection('User').document(user_id).get()
    posts = doc.get("userPosts")
    return posts

#returns a list of user ID's that are friends with given user ID
def get_user_friends(user_id):
    doc = db.collection('User').document(user_id).get()
    friends = doc.get("friends")
    return friends

#finds all posts meant to be displayed on a given user's home page
def get_home_posts(user_id):
    all_posts = get_user_posts(user_id)
    friends = get_user_friends(user_id)
    for friend in friends:
        friends_posts = get_user_posts(friend)
        np.concatenate(all_posts, friends_posts)
    
    for post in all_posts:
        doc = db.collection("Posts").document(post).get()
        #sort by date HERE
        all_images = np.add(doc.get("img"))
    
    return all_images

#adds new post to DB
def new_post(user_id, imgID, image):
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

#adds new reaction to DB
def new_reaction(user_id, imgID, reaction):
    db.collection("Posts").document(imgID).update({
        'reactions': firestore.ArrayUnion[{user_id, reaction}]
    })
    return

#adds a friend to a user's friends list
def add_friend(user_id, friend_id):
    db.collection("User").document(user_id).update({
        'friends': firestore.ArrayUnion[friend_id]
    })
    return


get_user_posts("firstID1")
import uvicorn
import firebase_admin
import pyrebase
import json
import numpy as np

from firebase_admin import credentials, auth, firestore
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

# Replace with the path to your service account key file
key_path = "TOPSECRETDONOTSHARE.json"
config = 'firebase_config.json'
#set up the firebase connection with API key
cred = credentials.Certificate(key_path)
firebase = firebase_admin.initialize_app(cred)

#use pyrebase to initalize a Firebase app. based on our config 
pb = pyrebase.initialize_app(json.load(open(config)))
#pb = pyrebase.initialize_app(config)

app = FastAPI()

storage = pb.storage()

allow_all = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins = allow_all,
    allow_credentials = True,
    allow_methods = allow_all,
    allow_headers = allow_all
)

#initalize firebase firestore
db = firestore.client()

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
    #get all user's posts
    all_posts = get_user_posts(user_id)
    #get all user's friends
    friends = get_user_friends(user_id)
    #get all of friend's posts
    for friend in friends:
        friends_posts = get_user_posts(friend)
        #create list of posts to display
        np.concatenate(all_posts, friends_posts)
    
    for post in all_posts:
        #for all posts, retrieve image
        doc = db.collection("Posts").document(post).get()
        image = doc.get("img")
        #get image url
        url = storage.child(image).get_url()
        print(url)
        #sort by date HERE
        all_images = np.add(doc.get("img"))
    
    return all_images

#adds new post to DB
def new_post(user_id, imgID, image):
    #put image in storage
    storage.child(image).put(image)
    #add image to posts database
    doc = db.collection("Posts").document(imgID)
    doc.set({
        "imgID": imgID,
        "img": image,
        "reactions": []
    })
    #add associate to user
    db.collection("User").document(user_id).update({
        'userPosts': firestore.ArrayUnion([imgID])
    })
    
    return

#returns top 3 most common reactions on a given post
def top_reactions(imgID):
    #get reference to post
    doc_ref = db.collection("Posts").document(imgID)
    doc = doc_ref.get()
    #if image exists, get reactions
    if(doc.exists):
        reactions = list(doc.to_dict()['reactions'])
    #sort reactions by their frequency of occurrance
    sorted_reactions = sort_by_frequency(reactions)
    result = []
    #if there are reactions, keep only unique values
    if sorted_reactions is not None:
        for reaction in sorted_reactions:
            if reaction not in result:
                result.append(reaction)
    #reverse order to retrieve descending order
    result.reverse()
    #return top 3 values
    return result[0:3]

#adds new reaction to DB, will replace past reactions with new one
def new_reaction(user_id, imgID, reaction):
    #delete any reactions already associated with this user ID
    delete_reaction(user_id, imgID)
    reaction_dict = {
        user_id : reaction,
    }
    db.collection("Posts").document(imgID).update({
        'reactions': firestore.ArrayUnion([reaction_dict])
    })
    return

#delete a reaction on a post associated with the user ID.
# if no such reaction exists, nothing will happen
def delete_reaction(user_id, imgID):
    doc_ref = db.collection("Posts").document(imgID)
    doc = doc_ref.get()
    #check if this image exists
    if(doc.exists):
        list_of_dicts = list(doc.to_dict()['reactions'])
    #for each reaction dictionary on this given post, check if one is associated
    # with this user ID
    for dictionary in list_of_dicts:
       if dictionary.__contains__(user_id):
           #found user ID, delete this reaction
           dict_to_delete = dictionary
    #if user ID is found, delete the associated reaction.
    if dict_to_delete:
        db.collection("Posts").document(imgID).update({
        'reactions': firestore.ArrayRemove([dict_to_delete])
        })
    return

#adds a friend to a user's friends list
def add_friend(user_id, friend_id):
    doc_ref = db.collection("User").document(friend_id)
    doc = doc_ref.get()
    #check if this friend exists
    if(doc.exists):
        db.collection("User").document(user_id).update({
            'friends': firestore.ArrayUnion([friend_id])
        })
        db.collection("User").document(friend_id).update({
            'friends': firestore.ArrayUnion([user_id])
        })
    else:
        return "Error: friend is not a valid user"
    return

#remove friend from user's friends list
def remove_friend(user_id, friend_id):
    doc_ref = db.collection("User").document(friend_id)
    doc = doc_ref.get()
    #check if this friend exists
    if(doc.exists):
        db.collection("User").document(user_id).update({
            'friends': firestore.ArrayRemove([friend_id])
        })
        db.collection("User").document(friend_id).update({
            'friends': firestore.ArrayRemove([user_id])
        })
    return
    

# code snippet taken from 
# #tutorialspoint.com/program-to-sort-array-by-increasing-frequency-of-elements-in-python
def sort_by_frequency(list_of_dicts):
   values = []
   for dictionary in list_of_dicts:
       for value in dictionary.values():
           values.append(value)
   mp = {}
   for i in set(values):
      x = values.count(i)
      try:
         mp[x].append(i)
      except:
         mp[x] = [i]
   ans=[]

   for i in sorted(mp):
      for j in sorted(mp[i], reverse=True):
         ans.extend([j]*i)
   return ans

#get_user_posts("firstID1")
#new_post("firstID1", "2", "sadditto.jpg")
#print(top_reactions("2"))
#new_reaction("firstID1", "2", "green")
#add_friend("firstID1", "secondID2")
remove_friend("firstID1", "secondID2")

import uvicorn
import operator
import datetime
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
key_path = "adminSDK.json"
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

def cnt_to_db():
    try:
        cred = credentials.Certificate(key_path)
        firebase = firebase_admin.initialize_app(cred)
    except:
        return False
    return True

#use pyrebase to initalize a Firebase app. based on our config 
pb = pyrebase.initialize_app(json.load(open(config)))
#returns a list of all of a user's post's ID's
def get_user_posts(userId):
    doc = db.collection('Posts').document(userId).get()
    all_urls = doc.get("imageSrc")
    return all_urls

#returns a list of user ID's that are friends with given user ID
def get_user_followers(userId):
    doc = db.collection('User').document(userId).get()
    friends = doc.get("followers")
    return friends

#get time user posted an image
def get_time_posted(userId):
    doc = db.collection("Posts").document(userId).get()
    date = doc.get("dateCreated")
    return date

def get_all_likes(imgID):
    doc = db.collection("Posts").document(imgID).get()
    likes = doc.get("likes")
    return likes

def get_username(userId):
    doc = db.collection("User").document(userId).get()
    username = doc.get("username")
    return username

#finds all post's links meant to be displayed on a given user's home page
def get_home_posts(userId):
    #get all user's posts
    all_posts = get_user_posts(userId)
    #get all user's friends
    friends = get_user_followers(userId)
    #get all of friend's posts
    for friend in friends:
        friends_posts = get_user_posts(friend)
        #create list of posts to display
        np.concatenate(all_posts, friends_posts)
    images_dict_list = []
    #all_images = []
    for post in all_posts:
        #for all posts, retrieve image
        doc = db.collection("Posts").document(post).get()
        date = doc.get("dateTime")
        image = doc.get("img")
        #get image url
        url = storage.child(image).get_url(image)
        img_dict = { "url": url, "date" : date }
        images_dict_list.append(img_dict)
    print(images_dict_list)
    in_order = images_dict_list.sort(key=operator.itemgetter('date'),reverse=True)
    return in_order

#adds new post to DB
def new_post(userId, imgID, image):
    #put image in storage
    storage.child(image).put(image)
    #add image to posts database
    doc = db.collection("Posts").document(imgID)
    date = datetime.datetime.now()
    doc.set({
        "imgID": imgID,
        "img": image,
        "dateTime": date,
        "likes": []
    })
    #add associate to user
    db.collection("User").document(userId).update({
        'userPosts': firestore.ArrayUnion([imgID])
    })
    
    return

#returns top 3 most common likes on a given post
def top_likes(imgID):
    #get reference to post
    doc_ref = db.collection("Posts").document(imgID)
    doc = doc_ref.get()
    #if image exists, get likes
    if(doc.exists):
        likes = list(doc.to_dict()['likes'])
    #sort likes by their frequency of occurrance
    sorted_likes = sort_by_frequency(likes)
    result = []
    #if there are likes, keep only unique values
    if sorted_likes is not None:
        for reaction in sorted_likes:
            if reaction not in result:
                result.append(reaction)
    #reverse order to retrieve descending order
    result.reverse()
    #return top 3 values
    return result[0:3]

#adds new reaction to DB, will replace past likes with new one
def new_reaction(userId, imgID, reaction):
    #delete any likes already associated with this user ID
    delete_reaction(userId, imgID)
    reaction_dict = {
        userId : reaction,
    }
    db.collection("Posts").document(imgID).update({
        'likes': firestore.ArrayUnion([reaction_dict])
    })
    return True

#delete a reaction on a post associated with the user ID.
# if no such reaction exists, nothing will happen
def delete_reaction(userId, imgID):
    doc_ref = db.collection("Posts").document(imgID)
    doc = doc_ref.get()
    dict_to_delete = None
    list_of_dicts = None
    #check if this image exists
    if(doc.exists):
        list_of_dicts = list(doc.to_dict()['likes'])
    #for each reaction dictionary on this given post, check if one is associated
    # with this user ID
    for dictionary in list_of_dicts:
       if dictionary.__contains__(userId):
           #found user ID, delete this reaction
           dict_to_delete = dictionary
    #if user ID is found, delete the associated reaction.
    if dict_to_delete is not None:
        db.collection("Posts").document(imgID).update({
        'likes': firestore.ArrayRemove([dict_to_delete])
        })
    return True

#adds a friend to a user's friends list
def add_friend(userId, friend_id):
    doc_ref = db.collection("User").document(friend_id)
    doc = doc_ref.get()
    #check if this friend exists
    if(doc.exists):
        db.collection("User").document(userId).update({
            'friends': firestore.ArrayUnion([friend_id])
        })
        db.collection("User").document(friend_id).update({
            'friends': firestore.ArrayUnion([userId])
        })
    else:
        return False
    return True

#remove friend from user's friends list
def remove_friend(userId, friend_id):
    doc_ref = db.collection("User").document(friend_id)
    doc = doc_ref.get()
    #check if this friend exists
    if(doc.exists):
        db.collection("User").document(userId).update({
            'friends': firestore.ArrayRemove([friend_id])
        })
        db.collection("User").document(friend_id).update({
            'friends': firestore.ArrayRemove([userId])
        })
    return True
    

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

#print(get_user_posts("firstID1"))
#new_post("firstID1", "2", "sadditto.jpg")
#print(top_likes("2"))
#new_reaction("firstID1", "2", "green")
#new_reaction("secondID2", "2", "blue")
#add_friend("firstID1", "secondID2")
#remove_friend("firstID1", "secondID2")
#print(get_home_posts("firstID1"))
#get_time_posted("2")
#print(get_all_likes("2"))
#print(get_username("firstID1"))
#print(get_user_posts("tDVuiOhVCCRLrG0t7l1l65dfIqL2"))
#print(get_user_followers("tDVuiOhVCCRLrG0t7l1l65dfIqL2"))
#print(get_time_posted("tDVuiOhVCCRLrG0t7l1l65dfIqL2"))
#print(get_home_posts("tDVuiOhVCCRLrG0t7l1l65dfIqL2"))
#delete_reaction("tDVuiOhVCCRLrG0t7l1l65dfIqL2", "noa1Q5EOwAfxBQw25qCf")
#new_reaction("tDVuiOhVCCRLrG0t7l1l65dfIqL2", "noa1Q5EOwAfxBQw25qCf", 5)

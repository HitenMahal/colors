import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth
from firebase_admin import storage


cred = credentials.Certificate("../ServiceAccountKey/colors-df7a2-firebase-adminsdk-cz3jt-534bff7918.json")
firebase_admin.initialize_app(cred, {'storageBucket': 'colors-df7a2.appspot.com'})



db = firestore.client()

#----------------------------------------------------------------------------------------------------------------------
#start of user db functions

#funcitons created:
"""
CAUTION: all user function inputs are strings

createUser(email, password, username) - creates a user based on the email, pass, and username sent in. Also makes sure that it's a unique email and username
-returns string

getUserIDByEmail(email) - retrieves an ID corresponding to the email sent in
-returns stirng

getUserName(ID) - retrieves the username of a user with the corresponding ID
-returns string

getUserFriends(ID) - retrieves the friends list of a user with the corresponding ID
-returns string

addFriend(userID, friendID) - adds a friends ID (friendID) to the friends list of a user with the corresponding userID. Also makes sure that the friend being 
added actaully exists. If the friend exists but is already in the friends list it does nothing but still returns the string "SUCCESS"
-returns string

removeFriend(userID, friendID) - removes a friends ID (friendID) from the friends list of a user with the corresponding userID. Also makes sure that the friend 
being removed actaully exists. if the friend exists but isn't in the friends list it does nothing but still returns the string "SUCCESS"
-returns string

updateUsername(ID, newUsername) - updates the username of a user with the corresponding ID. Also makes sure that the newUsername isn't already in use
-returns stirng

deleteUser(ID) - makes sure that the ID corresponds to a existing user then deletes the user information from the database and also deletes the user from 
authentications and deletes all the posts that where posted by the user
-returns string
"""



#createUser will take in an email, password, and username for a knew user
#it will first check if the username is being used already or not (if it is it will return the string "ERROR: username already exists")
#if the username is not in use already then it will attemp to create a user with the email and pass
#(if the email already exists it will return the string "ERROR: email already exists")
#and if everything goes to plan the string "SUCCESS" will be returned
def createUser(email, password, username):

    print("Creating user...")

    #get all the users from the database
    user = db.collection(u'User')
    usernameChecker = user.stream()

    #check each users username with the sent in username and if a match is found return error string message
    for i in usernameChecker:
        if username == i.to_dict()['username']:
            return "ERROR: username already exists"

    try:

        #if emails doesn't already exist it will create the user, save the UID into the database with the username sent in
        #then it will return the string "SUCCESS" to notify that a successful user was created

        #create user
        user = auth.create_user(email = email, password = password)

        print("User created successfully: {0}".format(user.uid))

        #user created thus create a userObj containing all information needed to be stored in database
        userObj = {
            'ID' : user.uid,
            'username' : username,
            'friends' : [],
            'numberOfPosts' : 0
        }

        #save the user info in the database
        documentRef = db.collection(u'User').document(userObj['ID'])
        documentRef.set(userObj)

        return "SUCCESS"
    except Exception as e:

        #if email already exists it will return a false 

        print(e)

        return "ERROR: email already exists"

#finds the user with the corresponding email sent in and returns their ID
def getUserIDByEmail(email):

    print("getting user ID")

    #finds the user with the corisponding email
    user = auth.get_user_by_email(email)

    print("User id is: {0}". format(user.uid))

    return user.uid

#Finds the user with the corresponding ID and returns their username
def getUsername(ID):

    print("Getting username from sent ID")

    user = db.collection(u'User').document(ID)

    userDoc = user.get()

    return userDoc.to_dict()['username']

#Finds the user with the corresponding ID and returns their friends
def getUserFriends(ID):

    print("Getting user Friends from sent ID")

    user = db.collection(u'User').document(ID)

    userDoc = user.get()

    return userDoc.to_dict()['friends']

#Finds the user with the corresponding ID and adds the friendID to their friends list
#and returns the string "SUCCESS" (also checks if the friendID actaully exists)
#if friend does not exists it will return the string "ERROR"
#if friend is already in the friends list it will just do nothing and return the string "SUCCESS"
def addFriend(userID, friendID):

    print("Adding friend to users friend list")

    #get user referance
    user = db.collection(u'User').document(userID)

    #get friend reference
    friend = db.collection(u'User').document(friendID)
    friendDoc = friend.get()

    if friendDoc.exists:

        userDoc = user.get()

        print("User friend list currently: {0}".format(userDoc.to_dict()['friends']))

        user.update({u'friends' : firestore.ArrayUnion([friendID])})

        userDoc = user.get()

        print("User friend list after: {0}".format(userDoc.to_dict()['friends']))

        return "SUCCESS"
    else:
        return "ERROR: friendID does not exist"

#Finds the user with the corresponding ID and Removes the friendID from their friends list
#and returns the string "SUCCESS" (also checks if the friendID actaully exists)
#if friend does not exists it will return the string "ERROR: friend ID does not exist"
#if friend is not in the friends list it will just do nothing and return the string "SUCCESS"
def removeFriend(userID, friendID):

    print("Removing friend from users friend list")

    #get user referance
    user = db.collection(u'User').document(userID)

    #get friend reference
    friend = db.collection(u'User').document(friendID)
    friendDoc = friend.get()

    if friendDoc.exists:

        userDoc = user.get()

        print("User friend list currently: {0}".format(userDoc.to_dict()['friends']))

        user.update({u'friends' : firestore.ArrayRemove([friendID])})

        userDoc = user.get()

        print("User friend list after: {0}".format(userDoc.to_dict()['friends']))

        return "SUCCESS"
    else:
        return "ERROR: friendID does not exist"
    
#Finds the user with the corresponding ID and updates their username to the new username
#and returns the string "SUCCESS" (also checks if the new username isn't used already)
#if new username is used already will return the stirng "ERROR: username already exists or is the user's username"
#and if the current username matches the new username return the string "ERROR: the new username matches the current username"
def updateUsername(ID, newUsername):

    print("Updating users username")

    #get all the users from the database
    users = db.collection(u'User')
    usernameChecker = users.stream()

    #get user referance
    user = db.collection(u'User').document(ID)
    userDoc = user.get()

    #check if the newUsername is already the current username
    if newUsername == userDoc.to_dict()['username']:
        return "ERROR: the new username matches the current username"

    #check each users username with the sent in username and if a match is found return error string message
    for i in usernameChecker:
        if newUsername == i.to_dict()['username']:
            return "ERROR: username already exists"

    print("Current username: {0}".format(userDoc.to_dict()['username']))

    user.update({u'username' : newUsername})

    userDoc = user.get()

    print("Updated username: {0}".format(userDoc.to_dict()['username']))

    return "SUCCESS"

#verifies that the ID sent in coresponds to a existing user
#then if the user exists it deletes the user from the database and returns the string "SUCCESS"
#if user does not exist it returns the string "ERROR: user does not exist"
def deleteUser(ID):

    #get user reference
    user = db.collection(u'User').document(ID)
    userDoc = user.get()

    if userDoc.exists:

        db.collection(u'User').document(ID).delete()

        auth.delete_user(ID)

        for i in userDoc.to_dict()['userPosts']:
            db.collection(u'Posts').document(i).delete()

        return "SUCCESS"
    else:
        return "ERROR: user does not exist"
    

# def getPosts(ID):

#     user = db.collection(u'User').document(ID)
#     userDoc = user.get()

#     if userDoc.exists:

#         imgID = userDoc.to_dict()['ID']

#         return db.collection(u'Posts').document(imgID)



#end of user db functions
#----------------------------------------------------------------------------------------------------------------------
#start of posts db functions

"""
CAUTION: All post inputs are string

uploadImage(imageTitle, userID) - creates a post in the database saving the image, imageID, reactions, userID, and username of user
-returns string

reaction(imageID, reaction, userID) - checks if the user has reacted to the image using imageID and userID. If they have delete previous
reaction, if they have not add the current reaction using the reaction variabel
-returns string

deletePost(imgID) - make sure the imgID corresponds to a Posts and if it does then deletes the Post and also updates the userPosts array in users
by deleting the imgID from there aswell
-returns string

changeImgUsername(imgID, newUsername) - makes sure the imgID exists then makes sure the username was changed and then changes the username on the Post
if both statments are true
-returns string
"""


#uploads an image and saves it in Posts
#creates an ID for the image using the userID and the number of posts the user has (userID - Post#NumberofPosts) giving the image a unique ID
#it also updates the userPosts array in users table to contrain the imgID
#it also increments the totalPostsNum (this represents the total number of posts the user has created
# since the start of their profile) by 1
def uploadImage(imageTitle, userID):

    userID = userID
    imageName = imageTitle
    bucket = storage.bucket()
    blob = bucket.blob(imageName)
    blob.upload_from_filename(imageName)

    print("image", blob.url)

    #get user referance
    user = db.collection(u'User').document(userID)
    userDoc = user.get()
    
    if userDoc.exists:
    
        imgID = userDoc.to_dict()['ID'] + " - Post#" + str(userDoc.to_dict()['totalPostsNum'])

        doc_ref = db.collection(u'Posts').document(imgID)
        doc_ref.set({

            'userPosted' : userDoc.to_dict()['username'],
            'userID' : userID,
            'reactions' : {},
            'img' : blob.url,
            'imgID' : imgID 

            }
        )

        #update the userPosts array in users database table to contrain the imgID
        user.update({u'userPosts' : firestore.ArrayUnion([imgID])})

        #update the totalPostsNum in users database table by 1
        user.update({"totalPostsNum" : firestore.Increment(1)})

        return "SUCCESS"

    else:
        return "ERROR: userID doesn't exist"

#takes in the reacion of a user to a image and saves it in the posts where the image is
#if user already reacted then it deletes their previous reaction
def reaction(imageID, reaction, userID):

    #get img reference
    img = db.collection(u'Posts').document(imageID)
    imgDoc = img.get()

    #get user reference
    user = db.collection(u'User').document(userID)
    userDoc = user.get()

    if imgDoc.exists:

        if userDoc.exists:

            imgDict = imgDoc.to_dict()

            for i in imgDict['reactions']:
                if i == userID:
                    img.update({
                        u'reactions.' + str(userID) : firestore.DELETE_FIELD
                    })

                    return "SUCCESS, reaction deleted"
            
            img.update({
                u'reactions.' + str(userID) : reaction
            })

            return "SUCCESS"
        else:
            return "ERROR: userID doesn't exist"
    else:
        return "ERROR: imgID doesn't exist"

#verifies that the ID sent in coresponds to a existing post
#then if the user exists it deletes the user from the database and returns the string "SUCCESS"
#if user does not exist it returns the string "ERROR: user does not exist"
def deletePost(imgID):

    #get user reference
    img = db.collection(u'Posts').document(imgID)
    imgDoc = img.get()

    if imgDoc.exists:

        db.collection(u'Posts').document(imgID).delete()

        user = db.collection(u'User').document(imgDoc.to_dict()['userID'])
        
        user.update({u'userPosts' : firestore.ArrayRemove([imgID])})

        return "SUCCESS"
    else:
        return "ERROR: post does not exist"
    
#verifies that the ID sent in coresponds to a existing user
#then makes sure 
def changeImgUsername(imgID, newUsername):

    #get user reference
    img = db.collection(u'Posts').document(imgID)
    imgDoc = img.get()

    if imgDoc.exists:

        user = db.collection(u'User').document(imgDoc.to_dict()['userID'])
        userDoc = user.get()

        if newUsername == userDoc.to_dict()['username']:
            return "ERROR: current username was not changed"
        else:
            img.update({
                u'userPosted' : newUsername
            })

        return "SUCCESS"
    else:
        return "ERROR: post does not exist"
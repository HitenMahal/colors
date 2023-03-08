import firebase_admin
from firebase_admin import firestore

# Application Default credentials are automatically created

app = firebase_admin.initialize_app()
db = firestore.client()

# Adding data and creating a new collection

doc_ref = db.collection(u'Users').documents(u'userInfo')
doc_ref.set({

    u'username':u'Gixxer'
    u'password':u'IL0veV@lorant123'
    u'rank':u'Radiant #1'
    })

# Reading data 

users_ref = db.collection(u'users')
docs = users_ref.stream()

gamer_ref = db.collection(u'users').document(u'userInfo')

# for doc in docs:
    # print(f'{doc.id} => {doc.to_dict()}')
    

# Secure your data
# Allow read/write access to all users under any conditions
# Warning: **NEVER** use this rule set in production; it allows
# Anyone to overwrite your entire database


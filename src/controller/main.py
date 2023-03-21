import uvicorn
import firebase_admin
import pyrebase
import json

from firebase_admin import credentials, auth, firestore
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

#initalizing using uvicorn in the command line: 
# uvicorn main:app --port 8000 --reload

#note that this will not run on the github yet. This code is looking for the service account keys, as well as the config file.

#set up the firebase connection with private api key
#by using service acc key, we initialize on our server instead of google cloud.
cred = credentials.Certificate('testFastAPI_service_account_keys.json')
firebase = firebase_admin.initialize_app(cred)

#use pyrebase to initalize a Firebase app. based on our config 
pb = pyrebase.initialize_app(json.load(open('firebase_config.json')))
app = FastAPI()
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

# signup endpoint
@app.post("/signup", include_in_schema=False)
async def signup(request: Request):
    req = await request.json()
    email = req['email']
    password = req['password']

    if email is None or password is None:
        return HTTPException(detail={'message': 'Error: Missing Email or Password'},
        status_code=400)

    try:
        user = auth.create_user(
            email=email,
            password=password
        )  

        return JSONResponse(content={'message': f'Successfully created user {user.uid}'},
        status_code=200)
        
    except:
        return HTTPException(detail={'message': 'Error creating user.'},
        status_code=400)
    

# login endpoint
@app.post("/login", include_in_schema=False)
async def log(request: Request):
    req_json = await request.json()
    email = req_json['email']
    password = req_json['password']
    try:
        user = pb.auth().sign_in_with_email_and_password(email,password)
        jwt = user['idToken']
        return JSONResponse(content={'token': jwt, 'message': 'Successfully logged in.'}, status_code=200)
    except:
        return HTTPException(detail={'message': 'Error logging in'}, 
        status_code=400)


# ping endpoint: validate jwt token
@app.post("/ping", include_in_schema=False)
async def validate(request: Request):
    headers = request.headers
    jwt = headers.get('authorization')
    print(f"jwt:{jwt}")
    user = auth.verify_id_token(jwt)
    return user["uid"]


if __name__ == "__main__":
    uvicorn.run("main:app")
import requests
import json

#given an email and pass as args, login to a valid account on our firebase auth.
def login(email: str, password: str):
    body = {
        "email": email,
        "password": password
    }
    response = requests.post(url="http://127.0.0.1:8000/login", json=body)

    #this message will be a string stating successful login, or error logging in.
    return json.loads(response.text)['message'] #['token']


#testing
user = input("Please input login email: \n")
pw = input("Please enter password: \n")

print("Attempting login: \n", login(user, pw))
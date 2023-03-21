import requests

#signs up with email and password. Does not allow duplicate user emails. user will be saved in firebase auth
def signup(email: str, password: str):
    body = {
        "email": email,
        "password": password
    }
    response = requests.post(url="http://127.0.0.1:8000/signup", json=body)
    return response.text


#testing..
email = input("Signup: Please enter your email: \n")
pw = input("Please enter your password: \n")

print ("Attempting to create new user... \n", signup(email, pw))
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from google.oauth2 import service_account
from googleapiclient.discovery import build
from google.cloud import firestore


app = FastAPI()

# Replace with the path to your service account key file
#key_path = 'C:\Users\Jenna\Documents\VS\TOPSECRETDONOTSHARE.json'
datastore_link = 'https://www.googleapis.com/auth/datastore'
temp = 'temp.html'


# Initialize the Firestore client
db = firestore.Client.from_service_account_json(r"C:\Users\Jenna\Documents\VS\TOPSECRETDONOTSHARE.json")

templates = Jinja2Templates(directory="templates")


@app.get("/")
def read_root():
    return templates.TemplateResponse(temp, {"request": Request})

@app.get("/login")
def login():
    if Request.method == 'GET':
        return  templates.TemplateResponse("home.hmtl")
    else:
        return templates.TemplateResponse(temp)
    
    
@app.get('/data')
async def get_data():
    # Replace with the name of your collection
    collection_name = 'User'

    # Get all documents in the collection
    collection_ref = db.collection(collection_name)
    documents = [doc.to_dict() for doc in collection_ref.stream()]

    return documents

"""

from fastapi import FastAPI
from google.oauth2 import service_account
from googleapiclient.discovery import build

from google.cloud import firestore

# Replace with the path to your service account key file
key_path = '/path/to/service-account-key.json'

# Initialize the Firestore client
db = firestore.Client.from_service_account_json(key_path)

app = FastAPI()


@app.get('/data')
async def get_data():
    # Replace with the name of your collection
    collection_name = 'my-collection'

    # Get all documents in the collection
    collection_ref = db.collection(collection_name)
    documents = [doc.to_dict() for doc in collection_ref.stream()]

    return documents




----------

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()
temp = "temp.html"

templates = Jinja2Templates(directory="templates")


@app.route("/")
def read_root():
    return templates.TemplateResponse(temp, {"request": Request})

@app.route("/login", methods=['GET', 'POST'], endpoint='login')
def login():
    if Request.method == 'GET':
        return  templates.TemplateResponse("home.hmtl")
    else:
        return templates.TemplateResponse(temp)
-----------

from fastapi import FastAPI

app = FastAPI()

items = [{"id": 1, "name": "Item 1"}, {"id": 2, "name": "Item 2"}]

@app.get("/items")
async def read_items():
    return items

@app.post("/items")
async def create_item(request: Request):
    item = await request.json()
    items.append(item)
    return {"status": "Item created"}

const newItem = {id: 3, name: "Item 3"};
fetch('/items', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newItem)
  })
  .then(response => response.json())
  .then(data => console.log(data));

-----

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

if __name__ == '__main__':
    app.run(debug=True)
-----------

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}
    
"""
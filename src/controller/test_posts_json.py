from main import db

#sets reference for ONE specific document from the database.
def convert_post_to_json(postID):
    doc_ref = db.collection('Posts').document(postID)
    doc = doc_ref.get()
    if doc.exists:
        print(
            f'{doc.to_dict()}'
        )
    else:
        print('No such document in database. Check given postID.')

#runs through all posts on the database. Returns a python list, containing a dictionary for each post.
def deliverPosts():
    json_list = []
    all_docs = db.collection('Posts').stream()

    for doc_ref in all_docs:
        #print(f'{doc_ref.id} => {doc_ref.to_dict()}\n')
        json_list.append(doc_ref.to_dict())
    
    print('pulled all posts.')
    return json_list

    
#testing.
pulledPosts = deliverPosts()
for obj in pulledPosts:
    print (obj)
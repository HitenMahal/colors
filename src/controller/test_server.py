import unittest
import server
from server import *

class ServerTest(unittest.TestCase):
    
    def test_get_user_posts(self):
        user_id = "tDVuiOhVCCRLrG0t7l1l65dfIqL2"
        result = get_user_posts(user_id)
        all_urls = "https://firebasestorage.googleapis.com/v0/b/colors-df7a2.appspot.com/o/FPO4wpRXsBMVaL-.jpg?alt=media&token=5f6fd414-3241-4675-9ce4-804befaa6b7c"
        self.assertEqual(result, all_urls)
   
    def test_get_user_followers(self):
        user_id = "tDVuiOhVCCRLrG0t7l1l65dfIqL2"
        result = get_user_followers(user_id)
        friends = ['o2yy6JaM1IaFr5MmLcE0e8y5EVN2', 'cGPhrr2EOVOsMjjaiEjGOckS3ub2']
        self.assertEqual(result, friends)
        
    def test_get_time_posted(self):
        user_id = "tDVuiOhVCCRLrG0t7l1l65dfIqL2"
        result = get_time_posted(user_id)
        timePosted = 13156
        self.assertEqual(result, timePosted)

    def test_sort_function(self):
        dict1 = { "one" : "1" }
        dict2 = { "two" : "1" }
        dict3 = { "three" : "1" }
        dict4 = { "four" : "2" }
        data = [dict1, dict2, dict3, dict4]
        result = sort_by_frequency(data)
        expected = ['2', '1', '1', '1']
        self.assertEqual(result, expected)
        
    def test_remove_friend(self):
        user_id = "tDVuiOhVCCRLrG0t7l1l65dfIqL2"
        friend_id = "aDDuaOh2CCRLrdAa9l8l65sFIqL2"
        result = remove_friend(user_id, friend_id)
        expected = True
        self.assertEqual(result, expected)
    
    def test_add_follower(self):
        user_id = "tDVuiOhVCCRLrG0t7l1l65dfIqL2"
        friend_id = "o2yy6JaM1IaFr5MmLcE0e8y5EVN2"
        result = add_friend(user_id, friend_id)
        expected = True
        self.assertEqual(result, expected)
        
    def test_delete_reaction(self):
        user_id = "tDVuiOhVCCRLrG0t7l1l65dfIqL2"
        imgId = "noa1Q5EOwAfxBQw25qCf"
        result = delete_reaction(user_id, imgId)
        expected = True
        self.assertEqual(result, expected)
        
    def test_add_friend(self):
        user_id = "tDVuiOhVCCRLrG0t7l1l65dfIqL2"
        friend_id = "aDDuaOh2CCRLrdAa9l8l65sFIqL2"
        result = add_friend(user_id, friend_id)
        expected = False
        self.assertEqual(result, expected)
        
    def test_new_reaction(self):
        user_id = "tDVuiOhVCCRLrG0t7l1l65dfIqL2"
        imgId = "noa1Q5EOwAfxBQw25qCf"
        reaction = "red"
        result = new_reaction(user_id, imgId, reaction)
        expected = True
        self.assertEqual(result, expected)
        
    def test_connection(self):
        result = cnt_to_db()
        expected = False
        self.assertEqual(result, expected)
            
        
    if __name__ == '__main__':
        unittest.main()
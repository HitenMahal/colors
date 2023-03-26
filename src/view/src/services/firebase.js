import { firebase, db } from './firebase-config';
import { doc, getDoc } from 'firebase/firestore';

export async function updateLoggedInUserFollowing(
    loggedInUserDocId, // currently logged in user document id (karl's profile)
    profileId, // the user that karl requests to follow
    isFollowingProfile // true/false (am i currently following this person?)
    ) {
    return firebase
      .firestore()
      .collection('users')
      .doc(loggedInUserDocId)
      .update({
        following: isFollowingProfile ?
          firebase.FieldValue.arrayRemove(profileId) :
          firebase.FieldValue.arrayUnion(profileId)
      });
}
  
  export async function updateFollowedUserFollowers(
    profileDocId, // currently logged in user document id (karl's profile)
    loggedInUserDocId, // the user that karl requests to follow
    isFollowingProfile // true/false (am i currently following this person?)
    ) {
    return firebase
      .firestore()
      .collection('users')
      .doc(profileDocId)
      .update({
        followers: isFollowingProfile ?
          firebase.FieldValue.arrayRemove(loggedInUserDocId) :
          firebase.FieldValue.arrayUnion(loggedInUserDocId)
      });
}
  
export async function getUserByUserId(userId) {
  console.log(userId);
  const result = await getDoc( doc(db, "User", userId) );
  console.log("getUserByUserId query=",result);
  // const user = result.map((item) => ({
  //   ...item.data(),
  //   docId: item.id
  // }));
  const user = result;
  console.log("getUserByUserId user=",user);
  return user;
}
  
export async function getSuggestedProfiles(userId, following) {
    let query = firebase.firestore().collection('users');
  
    if (following.length > 0) {
      query = query.where('userId', 'not-in', [...following, userId]);
    } else {
      query = query.where('userId', '!=', userId);
    }
    const result = await query.limit(10).get();
  
    const profiles = result.docs.map((user) => ({
      ...user.data(),
      docId: user.id
    }));
  
    return profiles;
}
  
export async function getPhotos(userId, following) {
    // [5,4,2] => following
    const result = await firebase
      .firestore()
      .collection('photos')
      .where('userId', 'in', following)
      .get();
  
    const userFollowedPhotos = result.docs.map((photo) => ({
      ...photo.data(),
      docId: photo.id
    }));
  
    const photosWithUserDetails = await Promise.all(
      userFollowedPhotos.map(async (photo) => {
        let userLikedPhoto = false;
        if (photo.likes.includes(userId)) {
          userLikedPhoto = true;
        }
        // photo.userId = 2
        const user = await getUserByUserId(photo.userId);
        // raphael
        const { username } = user[0];
        return { username, ...photo, userLikedPhoto };
      })
    );
  
    return photosWithUserDetails;
}
  
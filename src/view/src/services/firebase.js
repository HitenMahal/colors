import { firebase, db, storage } from './firebase-config';
import { collection, doc, getDoc, setDoc, query, where, getDocs, limit, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, getDownloadURL} from "firebase/storage";

export async function createUserProfile(userId, username, email) {
  console.log(userId, username, email);
  const userData = {
    userId: userId,
    username: username,
    email: email.toLowerCase(),
    following: [],
    followers: [],
    dateCreated: Date.now()
  }
  return await setDoc( doc(db, "User", userId), userData, { merge: true });
}

export async function doesUsernameExist(username) {
  const result = await getDocs( query( collection(db, "User"), where("username","==", username)));
  console.log("DOES USERNAME EXIST Result=",result);
  if (result.docs.length === 0) {
    return false;
  }
  else {
    return true;
  }
}

export async function updateLoggedInUserFollowing(
    userId, // currently logged in user document id (karl's profile)
    otherId, // the user that karl requests to follow
    isFollowingProfile // true/false (am i currently already following this person?)
    ) {
      console.log("UpdateLoggedInUserFollowing=",userId, otherId, isFollowingProfile);
    return updateDoc( doc(db, "User", userId), {
      following: isFollowingProfile ? arrayRemove(otherId) : arrayUnion(otherId)
    } );
}
  
  export async function updateFollowedUserFollowers(
    userId, // currently logged in user document id (karl's profile)
    otherId, // the user that karl requests to follow
    isFollowingProfile // true/false (am i currently already following this person?)
    ) {
      console.log("updateFollowedUserFollowers=",userId, otherId, isFollowingProfile);
    return updateDoc( doc(db, "User", otherId), {
      followers: isFollowingProfile ? arrayRemove(userId) : arrayUnion(userId)
    } );
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
  let result = await getDocs( query( collection(db, "User"), where("userId","not-in", [...following, userId]), limit(6)));

  // const profiles = result.docs.map((user) => ({
  //   ...user.data(),
  //   docId: user.id
  // }));

  console.log("GET_SUGGESTED_PROFILES", result);

  return result.docs;
}
  
export async function getPhotos(userId, following) {
  const result = await getDocs( query( collection(db, "Posts"), where('userId', 'in', following) ) );
  
    const userFollowedPhotos = result.docs.map((photo) => ({
      ...photo.data(),
      docId: photo.id,
    }));
  
    const photosWithUserDetails = await Promise.all(
      userFollowedPhotos.map(async (photo) => {
        let userLikedPhoto = false;
        if (photo.likes.includes(userId)) {
          userLikedPhoto = true;
        }
        // jac
        const { username } = photo.username;
        return { username, ...photo, userLikedPhoto };
      })
    );
  
    return photosWithUserDetails;
}

export async function getPhotoURL(photoName) {
  await getDownloadURL( ref(storage, photoName) ).then( (url) => {
    console.log("Get_Photo_URL got ", url);
    return url;
  });
}
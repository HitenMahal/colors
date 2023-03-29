import { firebase, db, storage } from './firebase-config';
import { collection, doc, getDoc, setDoc, query, where, getDocs, limit, updateDoc, arrayUnion, arrayRemove, or } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes} from "firebase/storage";
import { updateProfile } from 'firebase/auth';

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

export async function uploadUserPicture( auth, image) {
  // Upload Picture
  const imgRef = ref(storage, "profile/" + auth.currentUser.uid);
  const upload = await uploadBytes(imgRef, image);
  console.log("UPLOAD_USER_PIC upload =",upload);
  // Get Download Link
  const downloadLink = await getDownloadURL( imgRef )
  console.log("UPLOAD_USER_PIC auth", auth, downloadLink);
  // Update Profile Picture
  return await setDoc( doc(db, "User", auth.currentUser.uid), {profilePic: downloadLink}, { merge: true });
}

export async function doesUsernameOrEmailExist(username, email) {
  const result = await getDocs( query( collection(db, "User"), or(  where("username","==", username), where("email","==",email)  )   ));
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

export async function getUserByUsername(username) {
  console.log("GET_USER_BY_USERNAME username = ", username);
  let result = await getDocs( query( collection(db, "User"), where("username","==", username)));
  console.log("GET_USER_BY_USERNAME result=",result.docs[0].data());
  return result.docs[0].data();
}

// export async function isUserFollowingProfile(userId, profileUserId) {
//   const result = getDocs( query( collection(db, "User"), where("username", "==", )) );
//   const result = await firebase
//     .firestore()
//     .collection('users')
//     .where('username', '==', loggedInUserUsername) // karl (active logged in user)
//     .where('following', 'array-contains', profileUserId)
//     .get();

//   const [response = {}] = result.docs.map((item) => ({
//     ...item.data(),
//     docId: item.id
//   }));

//   return response.userId;
// }

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileUserId,
) {
  // 1st param: karl's doc id
  // 2nd param: raphael's user id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);

  // 1st param: karl's user id
  // 2nd param: raphael's doc id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateFollowedUserFollowers(activeUserDocId, profileUserId, isFollowingProfile);
}
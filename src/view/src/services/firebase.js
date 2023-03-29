import { firebase, db, storage } from './firebase-config';
import { collection, doc, getDoc, setDoc, query, where, getDocs, limit, updateDoc, arrayUnion, arrayRemove, or, deleteField } from 'firebase/firestore';
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

export async function createPost( uid, username, caption, img) {
  const timenow = Date.now();
  const id =  uid + timenow;
  // Upload Picture
  const imgRef = ref(storage, "profiles/" + id);
  const upload = await uploadBytes(imgRef, img);
  // Get Download Link
  const downloadLink = await getDownloadURL( imgRef )
  // Make data
  const data = {
    caption: caption,
    dateCreated: timenow,
    imageSrc: downloadLink,
    likes: [],
    userId: uid,
    username: username
  }
  // Update Profile Picture
  return await setDoc( doc(db, "Posts", id), data, { merge: true });
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
        let userReaction = 0;
        console.log("GET_PHOTOS photo.reaction = ",photo.reactions, userId, photo.reactions?.hasOwnProperty(userId));
        if (photo.reactions?.hasOwnProperty(userId)) {
          userReaction = photo.reactions[userId];
          console.log("USER ALREADY HAS REACTION = ", userReaction);
        }
        if ( photo?.reactions && Object.keys(photo?.reactions).length > 0) {
          const colorSummary = calculateColorSummary(photo.reactions);
        }
        // jac
        const { username } = photo.username;
        return { username, ...photo, userReaction };
      })
    );
  
    return photosWithUserDetails;
}

export function calculateColorSummary(reactions) {
  console.log("CALCULATE COLOR SUMMARY reactions = ", reactions);
  let summary = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0
  }
  for (var r in reactions) {
    console.log("CALCULATE COLOR SUMMARY r = ", r);
    if (Object.prototype.hasOwnProperty.call(reactions, r)) {
        summary[ reactions[r] ] += 1;
        console.log("CALCULATE COLOR SUMMARY summary[r]++ = ", reactions[r], summary[r], summary);
    }
  }
  var res = getThreeLargestKeys(summary);

  let colorSumRes = "";
  // Empty
  if (summary[res[0]] === 0) {
    colorSumRes = "place-content-center mb-12 m-auto p-4 bg-gradient-to-br from-r" + 0 + "s to-r" + + "e";
  }
  // One color
  else if (summary[res[1]] === 0) {

  }
  // 2 Color
  else if (summary[res[2]] === 0) {

  }
  else {

  }

  // for (let key in summary){
  //  res[3] = summary[key];
  //  res.sort(function(a,b){return b-a});
  // }
  // res.pop();
  
  console.log("CALCULATE COLOR SUMMARY = ", res);
  return 1;
}

function getThreeLargestKeys(obj){
  var k1, k2, k3;
  var v1, v2, v3;
  v1 = v2 = v3 = -Infinity;

  // O(1)
  var insertKey = function(key){
      var value = obj[key];  // note 1

      // note 2
      if(value >= v1){
          v3 = v2; v2 = v1; v1 = value;
          k3 = k2; k2 = k1; k1 = key;
      }else if(value >= v2){
          v3 = v2; v2 = value;
          k3 = k2; k2 = key;
      }else if(value >= v3){
          v3 = value;
          k3 = key;
      }
  };

  // O(n)
  for(var key in obj){
      // note 3
      insertKey(key);
  }

  return [k1, k2, k3];
}

// export async function getPhotoURL(photoName) {
//   await getDownloadURL( ref(storage, photoName) ).then( (url) => {
//     console.log("Get_Photo_URL got ", url);
//     return url;
//   });
// }

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

export async function toggleReaction( reaction, wantsToReact, docId, uid) {
  console.log("TOGGLE_REACTION", reaction, wantsToReact, docId, uid);
  return updateDoc( doc(db, "Posts", docId), {
      [`reactions.${uid}`]: wantsToReact ? reaction : deleteField()
  }, { merge: true });
}
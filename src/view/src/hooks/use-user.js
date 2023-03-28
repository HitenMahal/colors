import { useState, useEffect } from 'react';
import { getUserByUserId } from '../services/firebase';

export default function useUser(userId) {
  const [activeUser, setActiveUser] = useState();
  console.log("USE_USER called");

  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const user = await getUserByUserId(userId);
      console.log("USE_USER = ", user.data());
      setActiveUser(user.data() || {});
    }

    if (userId) {
      getUserObjByUserId(userId);
    }
  }, [userId]);

  return { user: activeUser, setActiveUser };
}
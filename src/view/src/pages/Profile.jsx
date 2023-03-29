import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserByUsername } from '../services/firebase';
import { UserAuth } from '../hooks/use-auth-listener';
import useUser from '../hooks/use-user';
import * as ROUTES from '../constants/routes';
import Header from '../components/header';
import UserProfile from '../components/profile-components/Profile';
import LoggedInUserContext from '../context/logged-in-user';

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { userAuth } = UserAuth() || {};
  const { user: userObj, setActiveUser } = useUser(userAuth?.uid);


  useEffect(() => {
    async function checkUserExists() {
      const user = await getUserByUsername(username);
      if (user?.userId) {
        setUser(user);
      } else {
        navigate.push(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();
  }, [username, navigate]);

  return user?.username ? (
    <LoggedInUserContext.Provider value={{userAuth, userObj, setActiveUser}}>
        <div className="bg-gradient-to-b from-official-background to-official-post h-[128rem]">
            <Header />
            <div className="mx-auto max-w-screen-lg">
                <UserProfile user={user} />
            </div>
        </div>
    </LoggedInUserContext.Provider>
  ) : null;
}

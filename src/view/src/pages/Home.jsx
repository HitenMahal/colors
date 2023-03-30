import React from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/header';
import Timeline from '../components/timeline';
import Sidebar from '../components/sidebar-components/SideBar';
import useUser from '../hooks/use-user';
import LoggedInUserContext from '../context/logged-in-user';
import { UserAuth } from "../hooks/use-auth-listener";

export default function Home() {
  const { userAuth } = UserAuth();
  console.log("HOME USERAUTH =",userAuth, userAuth.uid);
  const { user: userObj, setActiveUser } = useUser(userAuth.uid);
  console.log("HOME USEROBJ =",userObj);

  useEffect( () => {
    document.title = 'Colors';
  }, []);

  return (
    <LoggedInUserContext.Provider value={{userAuth, userObj, setActiveUser}}>
      <div className='bg-gradient-to-b from-official-background to-official-post min-h-[128rem] max-h-full'>
        <Header />
        <div className='grid grid-cols-3 gap-6 justify-between mx-auto max-w-screen-lg'>
          <Timeline />
          <Sidebar />
        </div>
      </div>
    </LoggedInUserContext.Provider>
  )
}

// Home.propTypes = {
//   user: PropTypes.object.isRequired
// }
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
  const { user } = UserAuth();
  console.log("Home=",user.email);

  useEffect( () => {
    document.title = 'Colors';
  }, []);

  return (
    <LoggedInUserContext.Provider value={{user}}>
      <div className='bg-gray-background'>
        <Header />
        <div className='grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg'>
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
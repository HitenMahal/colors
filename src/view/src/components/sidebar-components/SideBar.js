import { useContext } from 'react';
import User from './user';
import Suggestions from './suggestions';
import LoggedInUserContext from '../../context/logged-in-user';

export default function Sidebar() {
    console.log("Sidebar useContext(loggedin)=", useContext(LoggedInUserContext));
    const { userObj } = useContext(LoggedInUserContext);

    return (
        <div className="p-3 bg-official-post rounded-lg drop-shadow-lg max-h-[48rem]">
            <User username={ userObj?.username} profilePic={userObj?.profilePic} />
            <Suggestions userId={ userObj?.userId} following={ userObj?.following } />
        </div>
    )
}
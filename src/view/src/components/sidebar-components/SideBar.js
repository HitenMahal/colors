import { useContext } from 'react';
import User from './user';
import Suggestions from './suggestions';
import LoggedInUserContext from '../../context/logged-in-user';

export default function Sidebar() {

    console.log("Sidebar useContext(loggedin)=", useContext(LoggedInUserContext));
    const { userObj } = useContext(LoggedInUserContext);

    return (
        <div className="p-4 bg-official-post">
            <User username={ userObj?.username} />
            <Suggestions userId={ userObj?.userId} following={ userObj?.following } />
        </div>
    )
}
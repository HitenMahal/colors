import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    updateLoggedInUserFollowing,
    updateFollowedUserFollowers,
    getUserByUserId
} from '../../services/firebase';
import LoggedInUserContext from '../../context/logged-in-user';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

export default function SuggestedProfile( {
    username,
    userId
}) {
    const [followed, setFollowed] = useState(false);
    const { userObj ,setActiveUser } = useContext(LoggedInUserContext);

    console.log("SUGGESTED_PROFILE userObj = ", userObj.userId, userId);

    const handleFollowUser = async () => {
        console.log("Follow Button clicked");
        setFollowed(true);
        const x = await updateLoggedInUserFollowing( userObj.userId, userId, false);
        const y = await updateFollowedUserFollowers( userObj.userId, userId, false);
        // const [user] = await getUserByUserId(userId);
        console.log("HANDLE FOLLOW_USER",x,y);
        setActiveUser( userObj );
    }

    console.log("Sidebar - SUGGESTED PROFILE");

    return !followed ? (
        <div className="flex flex-row items-center align-items justify-between">
            <div className="flex items-center justify-between">
                <img
                    className="rounded-full w-8 flex mr-3 drop-shadow-lg"
                    src={`/images/avatars/${username}.jpg`}
                    alt={`${username} profile icon`}
                    onError={ (e) => {
                        e.target.src = DEFAULT_IMAGE_PATH;
                    }}
                />
                <Link to={`/p/${username}`}>
                    <p className="font-bold text-sm text-black-true">{username}</p>
                </Link>
            </div>
            <button className="text-sm font-bold text-official-text" type="button" onClick={handleFollowUser}>
                Follow
            </button>
        </div>
    ) : null;
}

SuggestedProfile.propTypes = {
    username: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
};  
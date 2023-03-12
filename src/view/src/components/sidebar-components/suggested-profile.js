import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
    updateLoggedInUserFollowing,
    updateFollowedUserFollowers,
    getUserByUserId
} from '../../services/firebase';
import LoggedInUserContext from '../../context/logged-in-user';

export default function SuggestedProfile( {
    profileDocId,
    username,
    profileId,
    userId,
    loggedInUserDocId
}) {
    const [followed, setFollowed] = useState(false);
    const { setActiveUser } = useContext(LoggedInUserContext);

    async function handleFollowUser() {
        setFollowed(true);
        await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
        await updateFollowedUserFollowers(profileDocId, userId, false);
        const [user] = await getUserByUserId(userId);
        setActiveUser(user);
    }

    return !followed ? (
        <div className="rec-profile-container">
            <div className="rec-profile-wrapper">
                <img
                    className="rec-profile-img"
                    src={`/images/avatars/${username}.jpg`}
                    alt={`${username} profile picture`}
                    onError={ (e) => {
                        e.target.src = `/images/avatars/default.png`;
                    }}
                />
                <Link to={`/p/${username}`}>
                    <p className="rec-profile-name">{username}</p>
                </Link>
            </div>
            <button className="rec-profile-btn" type="button" onClick={handleFollowUser}>
                Follow
            </button>
        </div>
    ) : null;
}

SuggestedProfile.PropTypes = {
    profileDocId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profileId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    loggedInUserDocId: PropTypes.string.isRequired
};  
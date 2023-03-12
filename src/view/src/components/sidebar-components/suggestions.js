import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { getSuggestedProfiles } from '../../services/firebase';
import SuggestedProfile from './suggested-profile';

export default function Suggestions( {userId, following, loggedInUserDocId} ) {
    const [profiles, setProfiles] = useState(null);
    
    useEffect( () => {
        async function suggestedProfiles() {
            const response = await getSuggestedProfiles(userId, following);
            setProfiles(response);
        }

        if (userId) {
           suggestedProfiles(); 
        }
    }, [userId]);

    return !profiles ? (
        <Skeleton count={1} height={150} className="profile-skeleton"/>
    ) : profiles.length > 0 ? (
        <div className="suggested-profile-container">
            <div className="suggested-text-wrapper">
                <p className="suggested-text">Suggested Profiles</p>
            </div>
            <div className="suggested-profiles">
                {profiles.map((profile) => (
                    <SuggestedProfile
                        key={profile.docId}
                        profileDocId={profile.docId}
                        username={profile.username}
                        profileId={profile.userId}
                        userId={userId}
                        loggedInUserDocId={loggedInUserDocId}
                    />
                ))}
            </div>
        </div>
    ) : null;
}

Suggestions.PropTypes = {
    userId: PropTypes.string,
    following: PropTypes.array,
    loggedInUserDocId: PropTypes.string
}
import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import useUser from '../../hooks/use-user';
import { isUserFollowingProfile, toggleFollow } from '../../services/firebase';
import UserContext from '../../context/user';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

export default function Header( {
    photosCount,
    followerCount,
    setFollowerCount,
    profile: {
        docId: profileDocId,
        userId: profileUserId,
        fullName,
        followers,
        following,
        username: profileUsername
    }
}) {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid)
    const [ isFollowingProfile, setIsFollowingProfile] = useState(null);
    const activeBtnFollow = user?.username && user?.username !== profileUsername;
    handleToggleFollow = async() => {
        setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
        setFollowerCount({
            followerCount: isFollowingProfile ? followerCount -1 : followerCount +1
        });
        await toggleFollow(isFollowingProfile, user.docId, profileDocId, profileUserId, user.userId);
    }

    useEffect( () => {
        const isLoggedInUserFollowingProfile = async () => {
            const isFollowing = await isFollowingProfile(user.username, profileUserId);
            setIsFollowingProfile(!!isFollowing);
        }
        if (user?.username && profileUserId) {
            isLoggedInUserFollowingProfile();
        }
    }, [user?.username, profileUserId]);

    return (
        <div className="profile-header">
            <div className="profile-header-inside">
                {profileUsername ? (
                    <img
                        className="profile-img"
                        alt={`${fullName} profile picture`}
                        src={`/images/avatars/${profileUsername}.jpg`}
                        onError={(e) => {
                            e.target.src = DEFAULT_IMAGE_PATH;
                        }}
                    />
                ):(
                    <Skeleton circle height={150} width={150} count={1}/>
                )}
            </div>
            <div className="profile-username">
                <div className="profile-username-inside">
                    <p className="profile-username-text">{profileUsername}</p>
                    {activeBtnFollow && isFollowingProfile === null ? (
                        <Skeleton count={1} width={80} height={32}/>
                    ) : (
                        activeBtnFollow && (
                            <button
                                className="profile-follow-btn"
                                type="button"
                                onClick={handleToggleFollow}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleToggleFollow();
                                    }
                                }}
                            >
                                {isFollowProfile ? 'Unfollow' : 'Follow'}
                            </button>
                        )
                    )}
                </div>
                <div className="follower-container">
                    {!followers || !following ? (
                        <Skeleton count={1} width={677} height={24} />
                    ) : (
                        <>
                            <p className="photo-counter">
                                <span className="photo-counter-text">{photosCount}</span> photos
                            </p>
                            <p className="follower-counter">
                                <span className="photo-counter-text">{followerCount}</span> {followerCount === 1 ? ` follower` : ` followers`}
                            </p>
                            <p className="following-counter">
                                <span className="following-counter-text">{following?.length}</span> following
                            </p>
                        </>
                    )}
                </div>
                <div className="name-container">
                    <p className="name-text">{!fullName ? <Skeleton count={1} height={24} /> : fullName}</p>
                </div>
            </div>
        </div>
    )
}

Header.propTypes = {
    photosCount: PropTypes.number.isRequired,
    followerCount: PropTypes.number.isRequired,
    setFollowerCount: PropTypes.func.isRequired,
    profile: PropTypes.shape({
      docId: PropTypes.string,
      userId: PropTypes.string,
      fullName: PropTypes.string,
      username: PropTypes.string,
      followers: PropTypes.array,
      following: PropTypes.array
    }).isRequired
  };
  
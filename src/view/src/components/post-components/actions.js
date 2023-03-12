import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import UserContext from '../../context/user';

export default function Actions( {docId, totalLikes, likedPhoto, handleFocus}) {
    const {
        user: {uid: userId}
    } = useContext(UserContext);

    const [toggleLiked, setToggleLiked] = useState(likedPhoto);
    const [likes, setLikes] = useState(totalLikes);

    const handleToggleLiked = async() => {
        setToggleLiked((toggleLiked) => !toggleLiked);

        setLikes((likes) => (toggleLiked ? likes-1 : likes+1));
    }

    return (
        <>
        <div className="actions">
            <div className="actions-inside">
                <svg>
                    onClick={handleToggleLiked()}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {handleToggleLiked()}
                    }}
                    xmlns="https://www.w3.org/2000/svg"
                    fill="none"
                    viewbox="0 0 24 24"
                    stroke="currentColor"
                    tabIndex={0}
                    className={toggleLiked ? `red-colored` : `grey-colored`}
                </svg>
                <svg
                    onClick={handleFocus}
                    onKeyDown={(event) => {if (event.key === `Enter`) {handleFocus()}}}
                    className="focus-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    tabIndex={0}        
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
            </div>
        </div>
        <div className="likes">
            <p className="likes-counter"> {likes===1 ? `${likes} like` : `${likes} likes`} </p>
        </div>
        </>
    )
}

Actions.PropTypes = {
    docId: PropTypes.string.isRequired,
    totalLikes: PropTypes.number.isRequired,
    likedPhoto: PropTypes.bool.isRequired,
    handleFocus: PropTypes.func.isRequired  
}
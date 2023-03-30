import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import Image from './image';
import Actions from './actions';
import Footer from './footer';
import Comments from './comments';
import { getPhotoURL } from '../../services/firebase';

export default function Post({content}) {
    // const [photoSrc, setPhotoSrc] = useState();

    const commentInput = useRef(null);
    const handleFocus = () => commentInput.current.focus();

    const colorSummary = content.colorSummary || "place-content-center mb-12 m-auto p-4 rounded-lg bg-gradient-to-br from-r0s to-r0e";

    console.log("POST downloadURL = ", content, content.imageSrc);

    return (
        <div className={colorSummary}>
        <div className="rounded-lg col-span-4 bg-official-post mb-12">
            <Header username={content.username} profilePic={content.profilePic} />
            <Image src={content.imageSrc} caption={content.caption}/>
            <Actions
                docId={content.docId}
                totalLikes={content.reactionNum}
                userReaction={content.userReaction}
                handleFocus={handleFocus}
            />
            <Footer caption={content.caption} username={content.username} />
            {/* <Comments 
                docId={content.docId}
                comments={content.comments}
                posted={content.dateCreated}
                commentInput={commentInput}
            /> */}
        </div>
        </div>
    );
}

Post.propTypes = {
    content: PropTypes.shape({
        username: PropTypes.string,
        imageSrc: PropTypes.string,
        caption: PropTypes.string,
        docId: PropTypes.string,
        userLikedPhoto: PropTypes.bool,
        likes: PropTypes.array,
        comments: PropTypes.array,
        dateCreated: PropTypes.number            
    })
};
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

    // getPhotoURL(content.imageSrc).then( (url) => {
    //     console.log("POST IMGURL = ", url);
    //     setPhotoSrc(url);
    // });

    console.log("POST downloadURL = ", content, content.imageSrc);

    return (
        <div className="place-content-center mb-12 m-auto p-4 bg-r1e">
        <div className="rounded col-span-4 bg-official-post">
            <Header username={content.username} profilePic={content.profilePic} />
            <Image src={content.imageSrc} caption={content.caption}/>
            <Actions
                docId={content.docId}
                totalLikes={content.likes.length}
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
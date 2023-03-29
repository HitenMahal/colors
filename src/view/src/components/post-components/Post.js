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
        <div className="rounded-lg col-span-4 bg-official-post mb-12 drop-shadow-lg">
            <Header username={content.username} profilePic={content.profilePic} />
            <Image src={content.imageSrc} caption={content.caption}/>
            <Actions
                docId={content.docId}
                totalLikes={content.likes.length}
                likedPhoto={content.userLikedPhoto}
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
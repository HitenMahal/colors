import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Comments( {docId, comments: allComments, posted, commentInput} ) {
    const [comments, setComments] = useState(allComments);
    const [commentsSlice, setCommentsSlice] = useState(3);
    const [comment, setComment] = useState('');
    const {
        user: { displayName }
    } = useContext(UserContext);

    const showAllComments = () => {
        setCommentsSlice(commentsSlice + 3);
    }

    const handleSubmitComment = (event) => {
        
    }

    return (
        <>
        <div className="p-4 pt-1 pb-4">
            {comments.slice(0, commentsSlice).map((item) => (
                <p key={`${item.comment}-${item.displayName}`} className="comment">
                    <Link to={`/p/${item.displayName}`}>
                        <span className="mr-1 font-bold">{item.displayName}</span>
                    </Link>
                </p>
            ))}
            {comments.length >= 3 && commentsSlice < comments.length && (
                <button 
                className="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
                type="button"
                onClick={showNextComments}
                onKeyDown={(event) => {if (event.key==='Enter') {showAllComments()}}}>
                    View more comments
                </button>
            )}
            <p className="text-gray-base uppercase text-xs mt-2">
                {formatDistance(posted, new Date())} ago
            </p>
        </div>
        <div className="border-t border-gray-primary">
            <form
                className="flex justify-between p1-0 pr-5"
                method="POST"
                onSubmit={(event) => comment.length >= 1 ? handleSubmitComment(event) : event.preventDefault()}
            >
                <input
                    aria-label="Add a comment"
                    autoComplete="off"
                    className="comment-input"
                    type="text"
                    name="add-comment"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={({target}) => setComment(target.value)}
                    ref={commentInput}
                />
                <button
                    className={`text-sm font-bold text-blue-medium ${!comment && 'opacity-25'}`}
                    type="button"
                    disabled={comment.length < 1}
                    onClick={handleSubmitComment}
                >
                    Post
                </button>
            </form>
        </div>
        </>
    )
}

Comments.propTypes = {
    docId: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    posted: PropTypes.number.isRequired,
    commentInput: PropTypes.object.isRequired
};  
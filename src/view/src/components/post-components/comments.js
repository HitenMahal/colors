import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';

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
        <div className="commentDiv">
            {comments.slice(0, commentsSlice).map((item) => (
                <p key={`${item.comment}-${item.displayName}`} className="comment">
                    <Link to={`/p/${item.displayName}`}>
                        <span className="comment-username">{item.displayName}</span>
                    </Link>
                </p>
            ))}
            {comments.length >= 3 && commentsSlice < comments.length && (
                <button 
                className="view-more-comments-btn"
                type="button"
                onClick={showNextComments}
                onKeyDown={(event) => {if (event.key==='Enter') {showAllComments()}}}>
                    View more comments
                </button>
            )}
            <p className="post-age">
                {formatDistance(posted, new Date())} ago
            </p>
        </div>
        <div className="comment-form-wrapper">
            <form
                className="comment-form"
                method="POST"
                onSubmit={(event) => comment.legnth >= 1 ? handleSubmitComment(event) : event.preventDefault()}
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
                    className="comment-input-btn"
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
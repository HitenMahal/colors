import PropTypes from 'prop-types';

export default function Footer( {caption, username} ) {
    return (
        <div className="footer">
            <span className="footer-username">{username}</span>
            <span className="footer-caption">{caption}</span>
        </div>
    );
}

Footer.propTypes = {
    caption: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
};
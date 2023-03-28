import PropTypes from 'prop-types';

export default function Footer( {caption, username} ) {
    return (
        <div className="p-3 pt-2 pb-2">
            <span className="mr-1 font-bold text-[#E7E9FF]">{username}</span>
            <span className="italic text-[#E7E9FF]">{caption}</span>
        </div>
    );
}

Footer.propTypes = {
    caption: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
};
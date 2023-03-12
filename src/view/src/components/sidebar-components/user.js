import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

export default function User( {username, fullName} ) {
    return !username || !fullName ? (
        <Skeleton count={1} height={61}/>
    ) : (
        <Link to={`/p/${username}`} className="sidebar-user">
            <div className="sidebar-img-container">
                <img 
                    className="sidebar-user-img"
                    src={`/images/avatars/${username}.jpg`}
                    alt=""
                    onError={(e) => {
                        e.target.src = DEFAULT_IMAGE_PATH;
                    }}
                />
            </div>
            <div className="siderbar-user-info">
                <p className="sidebar-user-info-username">{username}</p>
                <p className="sidebar-user-info-name">{fullName}</p>
            </div>
        </Link>
    )
}

User.PropTypes = {
    username: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired
}
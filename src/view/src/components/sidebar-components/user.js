import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

export default function User( {username, profilePic} ) {
    return !username ? (
        <Skeleton count={1} height={61}/>
    ) : (
        <Link to={`/p/${username}`} className="grid grid-cols-4 gap-4 mb-6 items-center">
            <div className="flex items-center justify-between col-span-1">
                <img 
                    className="rounded-full w-16 flex mr-3"
                    src={profilePic ? profilePic : "/"}
                    alt="profilePicture"
                    onError={(e) => {
                        e.target.src = DEFAULT_IMAGE_PATH;
                    }}
                />
            </div>
            <div className="col-span-3">
                <p className="font-bold text-m text-[#dbe9f4]">{username}</p>
            </div>
        </Link>
    )
}

User.propTypes = {
    username: PropTypes.string,
}

import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doesUsernameOrEmailExist } from '../services/firebase';
import { UserAuth } from "../hooks/use-auth-listener";
import { COLORS_BANNER_PATH, COLORS_LOGO_PATH, COLORS_REGISTER_PATH} from '../constants/paths';
import { DEFAULT_IMAGE_PATH } from '../constants/paths';


export default function Register() {
    const history = useNavigate();
    const { register } = UserAuth();
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [image, setImage] = useState();
    const [preview, setPreview] = useState('');  

    const [error, setError] = useState('');
    const isInvalid = (password === '' || email === '');

    useEffect( () => {
        if (!image) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    const handleImageChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImage(undefined);
            return;
        }
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
      };    
    
    const handleSignUp = async (e) => {
        e.preventDefault();

        const usernameExists = await doesUsernameOrEmailExist(username, email);
        if (password.length < 6) {
            setError("Password must be atleast 6 characters long. Please try again");
        }
        else if (!usernameExists) {
            try {
                const createdUserResult = await register(username, password, email, image); 
                history("/");
            }
            catch (error) {
                setUsername('');
                setEmail('');
                setPassword('');
                setError(error.message);        
            }
        } else {
            setError("That username or email is already taken, please try another");
        }
    };

    useEffect( () => {
        document.title = 'Sign-Up - Colors';
    })

    return (
            // Div to store the video that's running in the background
    <div className='flex justify-start items-center flex-col h-screen'>
    <div className='relative w-full h-full'>
      <video 
        src={COLORS_REGISTER_PATH}
        type="video/mp4"
        loop
        controls={false}
        muted
        autoPlay
        className='w-full h-full object-cover'
      />

    <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
            <div className="flex flex-col items-center p-4 bg-black mb-w rounded">
        <h1 className="flex justify-center w-full">
            <img src={COLORS_LOGO_PATH} alt="Colors" className="mt-2 w-6/12 mb-4" />
        </h1>

        { error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

        <form onSubmit={handleSignUp} method="POST" className='font-bold font-mono'>
            <input
                aria-label="Enter your username"
                type="text"
                placeholder="Username"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                onChange={({ target }) => setUsername(target.value)}
                value={username}
            />
            <input
                aria-label="Enter your email address"
                type="text"
                placeholder="Email address"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                onChange={({ target }) => setEmail(target.value)}
                value={email}
            />
            <input
                aria-label="Enter your password"
                type="password"
                placeholder="Password"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                onChange={({ target }) => setPassword(target.value)}
                value={password}
            />
                        <img
                            className="rounded-full h-40 w-40 flex"
                            src={preview}
                            alt={`profile`}
                            onError={(e) => {
                            e.target.src = DEFAULT_IMAGE_PATH;
                            }}
                        />
                        <input type="file" aria-label="profile picture" className="py-5" onChange={handleImageChange} />
            <button
                disabled={isInvalid}
                type="submit"
                className={`bg-blue-medium text-white w-full rounded h-8 
                ${isInvalid && 'opacity-50'}`}
            >
                Sign Up
            </button>
        </form>
        </div>
    </div>
    </div>
    </div>
    )

}
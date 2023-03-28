import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doesUsernameExist } from '../services/firebase';
import { UserAuth } from "../hooks/use-auth-listener";
import { COLORS_BANNER_PATH, COLORS_LOGO_PATH, COLORS_REGISTER_PATH} from '../constants/paths';

const Register = () => {
    const history = useNavigate();
    const { register } = UserAuth();
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const isInvalid = (password === '' || email === '');
    
    const handleSignUp = async (e) => {
        e.preventDefault();

        const usernameExists = await doesUsernameExist(username);
        if (!usernameExists) {
            try {
                const createdUserResult = await register(username, password, email); 
                history("/");
            }
            catch (error) {
                setUsername('');
                setEmail('');
                setPassword('');
                setError(error.message);        
            }
        } else {
            setError("That username is already taken, please try another");
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

export default Register;


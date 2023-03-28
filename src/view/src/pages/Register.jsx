import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doesUsernameExist } from '../services/firebase';
import { UserAuth } from "../hooks/use-auth-listener";
import { COLORS_BANNER_PATH, COLORS_LOGO_PATH } from '../constants/paths';

export default function Register() {
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
        <div className="container flex mx-auto w-full items-center h-screen">
            <div className="flex top-0 left-0 h-full w-1/2">
                <img src={COLORS_BANNER_PATH} alt="colors-banner"/>
            </div>
            <div className="flex flex-col w-3/5">
                <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-w rounded">
                    <h1 className="flex justify-center w-full">
                        <img src={COLORS_LOGO_PATH} alt="Colors" className="mt-2 w-6/12 mb-4" />
                    </h1>

                    { error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

                    <form onSubmit={handleSignUp} method="POST">
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
                            className={`bg-blue-medium text-white w-full rounded h-8 font-bold
                            ${isInvalid && 'opacity-50'}`}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )

}
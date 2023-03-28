import { useContext, useState, useEffect } from 'react'
import { UserAuth } from "../hooks/use-auth-listener";
import { COLORS_LOGO_PATH, COLORS_VIDEO_PATH } from '../constants/paths';
import { useNavigate } from 'react-router';

const Login = () => {
  const history = useNavigate();
  const { signIn } = UserAuth();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const isInvalid = password === '' || emailAddress === '';

  const handleLogin = async(event) => {
    event.preventDefault();
    setError('');
    try {
      await signIn(emailAddress, password);
      history("/");
    } catch (error) {
      setEmailAddress('');
      setPassword('');
      setError(error.message);
    }
  }

  useEffect( () => {
    document.title = "Login to Colors"
  }, [])

  return (
    // Div to store the video that's running in the background
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video 
          src={COLORS_VIDEO_PATH}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />

<div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={COLORS_LOGO_PATH} width="530px" alt='logo'/>
          </div>

          <div className="shadow-2xl">
            {/* <GoogleLogin
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-4 rounded-lg cursor-pointer outline-none font-bold font-mono"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign In / Sign Up
                </button>
              )}
            /> */}
                      {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

            <form onSubmit={handleLogin} method="POST">
              <input
                aria-label="Enter your email address"
                type="text"
                placeholder="Email address"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                onChange={({ target }) => setEmailAddress(target.value)}
                value={emailAddress}
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
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
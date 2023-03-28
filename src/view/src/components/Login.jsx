import React from 'react'
import GoogleLogin  from 'react-google-login'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import video from '../assets/ink.mp4'
// import logo from '../assets/colors.png'
import logo2 from '../assets/image.png'

const Login = () => {
  const navigate = useNavigate();
  return (
    // Div to store the video that's running in the background
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video 
          src={video}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />

<div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo2} width="530px" alt='logo'/>
          </div>

          <div className="shadow-2xl">
            {/** This is where you have to int */}
            <GoogleLogin
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-4 rounded-lg cursor-pointer outline-none font-bold font-mono"
                  onClick={() => navigate('/home')}
                >
                  <FcGoogle className="mr-4" /> Sign In / Sign Up
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
import React from 'react'
import video from '../assets/ink.mp4'

const Home = () => {
  return (
  
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
        <div class="py-12 px-12 rounded-2xl shadow-xl z-20">
          <div>
            <h1 class="text-3xl font-bold text-center mb-4 text-white font-bold font-mono">Welcome to Colors!</h1>
          </div>
          <div class="space-y-4">
            <input type="text" placeholder="Username" class="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />
          </div>
          <div class="text-center mt-6">
            <button class="py-2 w-64 text-xl text-white bg-mainColor rounded-2xl text-black font-bold font-mono">Create Username</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Home
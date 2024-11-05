import React, { useContext, useEffect } from 'react';
import start from "./assets/start.png";
import "./StartScreen.css";
import Signup from './Auth/Signup';
import { StateContext } from './Context/Context';

function StartScreen() {
  const {userData, emailUser} = useContext(StateContext)
  function getStarted() {
    document.getElementById("start-screen-main").style.display="none";
    document.getElementById("signup-main").style.display="block";
  }

  useEffect(() => {
    if (userData && emailUser) {
      document.getElementById("start-screen-main").style.display="none";
    }
  }, [])
  
  return (
    <>
    <div id="start-screen-main" className='h-screen w-[100vw] bg-black flex items-end'>
      <div className='m-10 mb-20'>
        <h1 className='text-5xl text-white mb-4'>All events happening on 1 platform</h1>
        <br/>
        <button onClick={getStarted} className='bg-[#B0EC70] p-[15px] text-xl font-bold w-[100%] rounded-2xl'>Get Started</button>
      </div>
    </div>
    <div id="signup-main">
      <Signup/>
    </div>
    </>
  )
}

export default StartScreen
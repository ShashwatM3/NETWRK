import React, { useContext, useState } from 'react';
import "./Signup.css";
import { useDialogs } from '@toolpad/core/useDialogs';
import { MuiTelInput } from 'mui-tel-input'
import Input from '@mui/joy/Input';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { StateContext } from '../Context/Context';
import { collection, getDocs } from "firebase/firestore";
import {iconlist} from "../assets/iconlist"

function Signup() {
  const {setUserNameUser, emailUser, setEmailUser} = useContext(StateContext)
  const dialogs = useDialogs();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState('');

  async function next1() {
    if (document.getElementById("fullName").value.length>0) {
      const username = document.getElementById("fullName").value;
      setUserName(username);
      clearAllSignups();
      console.log(username);
      document.getElementById("signup-2").style.display='flex';
    } else {
      await dialogs.alert("Please enter a suitable full name");
    }
  }

  function generateRandomPFP() {
    const digits = [0, 1, 2, 3, 4];
    const randomIndex = Math.floor(Math.random() * digits.length);
    const randomDigit = digits[randomIndex];
    return iconlist[randomDigit];
  }

  const handleChange = (newValue) => {
    setPhoneNum(newValue)
  }

  const handleChangeEmail = (newValue) => {
    setEmail(newValue)
  }

  async function next2() {
    if (document.getElementById("emailAddr").value.length>0) {
      const email_addr = document.getElementById("emailAddr").value;
      setEmail(email_addr);
      clearAllSignups();
      console.log(email_addr)
      document.getElementById("signup-3").style.display='flex';
    } else {
      await dialogs.alert("Please enter a suitable email address");
    }
  }

  async function next3() {
    clearAllSignups();
    document.getElementById("signup-4").style.display='flex';
    console.log(phoneNum);
  }

  async function next4() {
    clearAllSignups();
    document.getElementById("signup-5").style.display='flex';
  }

  function clearAllSignups() {
    document.getElementById("signup-1").style.display='none';
    document.getElementById("signup-2").style.display='none';
    document.getElementById("signup-3").style.display='none';
    document.getElementById("signup-4").style.display='none';
    document.getElementById("signup-5").style.display='none';
  }

  function generateRandomString(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async function getStarted() {
    let insta = document.getElementById("instaID").value;
    let link = document.getElementById("linkedinID").value;
    localStorage.setItem("email address netwrk web app", email);
    const pfp = generateRandomPFP();
    setEmailUser(email);
    const randomID = generateRandomString();
    const docRef = await getDoc(doc(db, "admin", "randomIDs"));
    const idList = docRef.data()["list"];
    if (idList.includes(randomID)) {
      getStarted();
    } else {
      await setDoc(doc(db, email, email), {
        "name": userName,
        "email_address": email,
        "instagram": insta,
        "linkedin": link,
        "total_connects": 0,
        "bubbles": "",
        "profile_pic": pfp,
        "netwrk_id": randomID
      });
    }
  }

  return (
    <div className='signup-main'>
      <div id='signup-1' className='signup-section'>
        <div>
          <h1>What should we call you?</h1><br/>
          <input id="fullName"/><br/>
          <button onClick={next1}>Continue</button>
        </div>
        <div className='setup-bar'>
          <a id="setup-section">hi</a>
          <a>hi</a>
          <a>hi</a>
          <a>hi</a>
        </div>
      </div>
      <div id='signup-2' className='signup-section'>
        <div>
          <h1><b>Welcome {userName}!</b><br/><br/>What's your email?</h1><br/>
          <input id="emailAddr" onChange={handleChangeEmail}/><br/>
          <button onClick={next2}>Continue</button>
        </div>
        <div className='setup-bar'>
          <a>hi</a>
          <a id="setup-section">hi</a>
          <a>hi</a>
          <a>hi</a>
        </div>
      </div>
      <div id='signup-3' className='signup-section'>
        <div>
          <h1>What's your mobile number, for <b>contact</b>?</h1><br/>
          <MuiTelInput defaultCountry="US" value={phoneNum} onChange={handleChange} /><br/>
          <button onClick={next4}>Skip</button>
        </div>
        <div className='setup-bar'>
          <a>hi</a>
          <a>hi</a>
          <a id="setup-section">hi</a>
          <a>hi</a>
        </div>
      </div>
      <div id='signup-4' className='signup-section'>
        <div>
          <h1>Lastly, do you have any <b>socials</b>?</h1><br/><br/>
          <div className='social'>
            <img src={"https://cdn-icons-png.flaticon.com/512/717/717392.png"}/>
            <Input id="instaID" placeholder="Enter Instagram ID" />
          </div><br/><br/>
          <div className='social'>
            <img src={"https://www.svgrepo.com/show/16193/linkedin-logo.svg"}/>
            <Input id="linkedinID" placeholder="Enter Linkedin ID" />
          </div>
          <br/><br/>
          <button onClick={next4}>Skip</button>
        </div>
        <div className='setup-bar'>
          <a>hi</a>
          <a>hi</a>
          <a>hi</a>
          <a id="setup-section">hi</a>
        </div>
      </div>
      <div id='signup-5' className='signup-section'>
        <div>
          <h1>You're all set <b>{userName}</b></h1><br/>
          <button onClick={getStarted}>LET'S GET STARTED</button>
        </div>
      </div>
    </div>
  )
}

export default Signup
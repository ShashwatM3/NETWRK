import React, { useState, useEffect } from 'react';
import "./Waitlist.css";
import waitlist from "./assets/waitlist.png";
import { useDialogs } from '@toolpad/core';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import mainlogo from "./assets/mainlogo.png"
import { Button } from '@mui/material';

function Waitlist() {
  const [submitted, setSubmitted] = useState(false);
  const dialogs = useDialogs();

  useEffect(() => {
    const savedEmail = localStorage.getItem("EMAIL WAITLIST NETWRK");
    if (savedEmail) {
      setSubmitted(true);
    }
  }, []);

  async function sendEmails(emailAddressSend) {
    // const response = await fetch('https://script.google.com/macros/s/AKfycbwBxaTqyI2-fw0gX5jCuJLEgny_mbKJPsUDafp3dRdIWLLXQxFjjUq1oPJZR3ZFQ0MfpA/exec',{
    //   method: 'POST',
    //   body: JSON.stringify({emailAddressSend}),
    //   header:{
    //     'Content-Type': 'application/json',
    //   },
      
    // });

    // const result = await response.json();
    // if(result.result === 'sucess'){
      // console.log('Email successfully submitted!');
      // setSubmitted(true);
      // localStorage.setItem("EMAIL WAITLIST NETWRK", emailAddressSend);
    // } else{
    //   console.log('Error submitting email.');
    // }
    await setDoc(doc(db, "email_list", emailAddressSend), {
      "email": emailAddressSend
    });
    console.log('Email successfully submitted!');
    setSubmitted(true);
    localStorage.setItem("EMAIL WAITLIST NETWRK", emailAddressSend);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email1 = document.getElementById("waitlist-input-1").value.trim();
    const email2 = document.getElementById("waitlist-input-2").value.trim();

    if(email1.length>0) {
      if (!email1.includes("@") || email1.length < 5) {
        await dialogs.alert("Invalid email address provided");
        window.location.reload();
      } else {
        sendEmails(email1);
      }
    } else if (email2.length>0) {
      if (!email2.includes("@") || email2.length < 5) {
        await dialogs.alert("Invalid email address provided");
        window.location.reload();
      } else {
        sendEmails(email2);
      }
    }
  };

  return (
    <>
      <div className='waitlist-main' id="waitlist-normal">
      <div>
        {submitted ? 
        <React.Fragment>
          <h1 className='successfully-submitted'>Email Successfully Submitted. <b>Check your mail</b> for updates</h1>
        </React.Fragment>
        :
        <React.Fragment>
          <img src={waitlist} alt="Waitlist"/><br/><br/>
          <div>
            <h1>GET NOTIFIED WHEN WE LAUNCH</h1><br/>
            <input id="waitlist-input-1" placeholder='Enter email address..'/><br/>
            <button onClick={handleSubmit}>JOIN THE JOURNEY</button>
          </div>
        </React.Fragment>
        }
      </div>
    </div>
    <div id="waitlist-phone">
      {submitted ?
        <React.Fragment>
          <h1 className='successfully-submitted'>Email Successfully Submitted. <b>Check your mail</b> for updates</h1>
        </React.Fragment> 
        :
        <React.Fragment>
          <img src={mainlogo}/>
          <div>
            <h1>THE FUTURE OF <span style={{fontWeight: "200"}}>NETWORK GROWTH</span> AND <i>HOSTING EVENTS</i></h1><br/>
            <input id="waitlist-input-2" placeholder='Enter email address..'/><br/>
            <Button variant="contained" onClick={handleSubmit}>JOIN THE JOURNEY</Button>
          </div>
        </React.Fragment>}
    </div>
    </>
  )
}

export default Waitlist;

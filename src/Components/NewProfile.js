import React, { useContext, useEffect, useState } from 'react';
import "./NewProfile.css";
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { StateContext } from '../Context/Context';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import profilePicDefault from "../assets/profilePicDefault.jpg";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DialpadIcon from '@mui/icons-material/Dialpad';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { Button } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

function NewProfile() {
  const {userData, emailUser, allEvents} = useContext(StateContext);
  const [passedEvents, setPassedEvents] = useState({});
  const [regEvents, setRegEvents] = useState({});

  function hasDatePassed(dateString) {
    const inputDate = new Date(dateString);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return inputDate < currentDate;
  }

  function getEventId(fullString) {
    return fullString.split('_').pop();
  }

  function getDataById(arr, id) {
    return arr.find(item => item.id === id);
  }

  useEffect(() => {
    if (userData) {
      const past = {};
      const curr = {};
      for (let att in userData) {
        if(att.includes("eventRSVPD_")) {
          console.log(getEventId(att));
          console.log(getDataById(allEvents, getEventId(att)));
          if (allEvents && getDataById(allEvents, getEventId(att))) {
            console.log(getDataById(allEvents, getEventId(att)).date);
            if(hasDatePassed(getDataById(allEvents, getEventId(att)).date)) {
              past[userData[att].eventID] = getDataById(allEvents, getEventId(att));
            } else {
              curr[userData[att].eventID] = getDataById(allEvents, getEventId(att));
            }
          }
        }
      }
      setPassedEvents(past);
      setRegEvents(curr);
    }
  }, [userData, allEvents]);

  function convertToReadableTime(time) {
    // Split the time string into hours and minutes
    let [hour, minute] = time.split(":").map(Number);
    
    // Determine am or pm
    const period = hour >= 12 ? "pm" : "am";
    
    // Convert to 12-hour format
    hour = hour % 12 || 12; // Convert 0 to 12 for midnight and handle other cases
    
    // Return formatted time
    return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  return (
    userData && emailUser ? (
      <React.Fragment>
        <div className='profile-main'>
          <div className='profile-header text-white flex w-full pt-12 items-center justify-center'>
            <h1 className='basis-full w-full text-center text-5xl'>Your Profile</h1>
          </div><br/>
          <div className='flex w-full p-8 pt-4'>
            <button onClick={() => {
              window.open("/", "_self");
            }} className='basis-full w-full p-2 mr-2 rounded-lg text-black bg-white'>All Events</button>
            <button onClick={() => {
              window.open("/CardView", "_self");
            }}  className='basis-full w-full p-2 rounded-lg text-white bg-slate-500'>Quick Swipe</button>
          </div>
          <div className='relative cardUser min-h-[40vh] m-6 mt-0 rounded-2xl p-6 pt-8 flex items-end'>
            <div className=''>
            <h1 className='text-4xl mb-4 font-bold'>{userData[emailUser].name}</h1>
            <h3 className='mb-2'>{userData[emailUser].email_address ? (<span className='flex items-center'><MailOutlineIcon/>&nbsp;{`${userData[emailUser].email_address}`}</span>): ""}</h3>
            <h3 className='mb-2'>{userData[emailUser].instagram ? (<span className='flex items-center'><InstagramIcon/>&nbsp;{`${userData[emailUser].instagram}`}</span>): ""}</h3>
            <h3 className='mb-2'>{userData[emailUser].linkedin ? (<span className='flex items-center'><LinkedInIcon/>&nbsp;{`${userData[emailUser].linkedin}`}</span>): ""}</h3>
            <h3 className='absolute top-5 left-5 font-bold opacity-50'>Netwrk ID: {userData[emailUser].netwrk_id}</h3>
            <img className='absolute top-5 right-5 h-12 w-12 rounded-[50%]' src={userData[emailUser].profile_picture ? userData[emailUser].profile_picture : `${profilePicDefault}`}/>
            </div>
          </div>
          <div className='p-8 pt-0'>
            <button onClick={() => {
              document.getElementById("current-events").style.display="block";
            }} className='basis-full w-full text-xl p-4 mr-2 pl-6 text-black bg-[#FD6218] mb-4 text-left rounded-xl flex items-center justify-between'>Registered Events<img className='h-[3vh]' src={"https://cdn-icons-png.flaticon.com/512/60/60947.png"}/></button>
            <button onClick={() => {
              document.getElementById("registered-events-past").style.display="block";
            }} className='basis-full w-full text-xl p-4 pl-6 border-solid bg-white text-left rounded-xl flex items-center justify-between'>Past Events<img className='h-[3vh]' src={"https://cdn-icons-png.flaticon.com/512/60/60947.png"}/></button>
          </div> 
        </div>
        <div id='registered-events-past'>
          <h1>Past Events</h1><br/>
          <Button onClick={() => {
            document.getElementById("registered-events-past").style.display="none";
          }}>Back to Profile</Button>
          <div id="registered-events-list">
            {passedEvents && Object.keys(passedEvents).length > 0 ? (
              Object.keys(passedEvents).map((event) => (
                  <React.Fragment>
                    <div key={event} id="listType-event" style={{ background: "transparent", border: "1px solid white", textAlign: "left" }} onClick={() => {document.getElementById(`description-event-${event}`).style.display="block"}}>
                      <div className='pr-5'>
                        <p className='text-lg'><AccessTimeIcon />&nbsp;&nbsp;{convertToReadableTime(passedEvents[event].time_start)}</p>
                        <h3 className='text-2xl mt-3'>{passedEvents[event].title}</h3>
                        <h4 className='text-lg'><LocationOnIcon />&nbsp;&nbsp;{passedEvents[event].location}</h4>
                        {passedEvents[event].contact && <p><DialpadIcon />&nbsp;&nbsp;{passedEvents[event].contact}</p>}
                        {/* <br/>
                        <Button style={{background: 'black', paddingLeft: 17, paddingRight: 17, color: "white"}}>Learn More</Button> */}
                      </div>
                      <img className='h-[15vh] w-[13vh] object-cover' src={passedEvents[event].poster} alt="Event poster" />
                    </div>
                    <div id={`description-event-${event}`} className='description-event-popup p-8 pt-12 bg-black'>
                      <button id='arrow' onClick={() => {
                        document.getElementById(`description-event-${event}`).style.display="none";
                      }} className='w-12 bg-white text-black text-3xl py-2 rounded-lg'>
                        &#8592;
                      </button><br/><br/>
                      <h1 className='text-white text-left'>{passedEvents[event].title}</h1><br/>
                      <hr className='mb-4'/>
                      <div
                        x-data="{}"
                        x-init="$nextTick(() => {
                            let ul = $refs.logos;
                            ul.insertAdjacentHTML('afterend', ul.outerHTML);
                            ul.nextSibling.setAttribute('aria-hidden', 'true');
                        })"
                        class="w-full inline-flex flex-nowrap overflow-hidden"
                      >
                        <ul x-ref="logos" class="flex items-center justify-center md:justify-start [&_li]:mx-2 [&_img]:max-w-none text-2xl animate-infinite-scroll text-white">
                            <li class="flex-shrink-0">
                              <h1>{ passedEvents[event].title }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ passedEvents[event].location }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ passedEvents[event].date }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ passedEvents[event].title }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ passedEvents[event].location }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ passedEvents[event].date }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ passedEvents[event].title }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ passedEvents[event].location }&nbsp;|</h1>
                            </li>
                        </ul>                
                      </div>
                      <hr className='mt-4'/>
                      <div className='flex mt-4'>
                        {/* <button className=' bg-white w-full basis-full text-center mr-4 p-4 rounded-lg'>RSVP</button> */}
                        <button onClick={() => {document.getElementById(`imgPoster-${event}`).style.display="block";document.getElementById(`imgPosterButton-${event}`).style.display="block"; }} className=' bg-[#B3FF41] w-full basis-full text-black text-center p-4 rounded-lg'>FLYER/POSTER</button>
                      </div><br/>
                      <img id={`imgPoster-${event}`} src={passedEvents[event].poster} className='imgPoster-eventT w-full rounded-lg'/>
                      <button className='imgPoster-eventT-button' id={`imgPosterButton-${event}`} onClick={() => {document.getElementById(`imgPoster-${event}`).style.display="none";document.getElementById(`imgPosterButton-${event}`).style.display="none"; }}>Close</button>
                      <div>
                        <h3 className='text-white flex items-center m-4 ml-0'><CalendarTodayIcon/>&nbsp;{passedEvents[event].date}</h3>
                        <h3 className='text-white flex items-center m-4 ml-0'><LocationOnIcon/>&nbsp;{passedEvents[event].location}</h3>
                        <h3 className='text-white flex items-center m-4 ml-0'><AccessAlarmIcon/>&nbsp;{convertToReadableTime(passedEvents[event].time_start)}</h3>
                      </div>
                      <h1 className='text-white'>Description</h1>
                      <h3 className='mt-2.5 text-neutral-300'>{passedEvents[event].note}</h3>
                      <br/>
                      <h3 className='text-neutral-500'>
                        Designed in Davis<br/>by California
                      </h3>
                      <br/>
                      <hr/>
                    </div>
                  </React.Fragment>
              ))
            ) : (
              <p className='mt-4'>No past events found.</p>
            )}
          </div>
        </div>
        <div id='current-events'>
          <h1>Registered Events</h1><br/>
          <Button onClick={() => {
            document.getElementById("current-events").style.display="none";
          }}>Back to Profile</Button>
          <div id="current-events-list">
            {regEvents && Object.keys(regEvents).length > 0 ? (
              Object.keys(regEvents).map((event) => (
                  <React.Fragment>
                    <div key={event} id="listType-event" style={{ background: "transparent", border: "1px solid white", textAlign: "left" }} onClick={() => {document.getElementById(`description-event-${event}`).style.display="block"}}>
                      <div className='pr-5'>
                        <p className='text-lg'><AccessTimeIcon />&nbsp;&nbsp;{convertToReadableTime(regEvents[event].time_start)}</p>
                        <h3 className='text-2xl mt-3'>{regEvents[event].title}</h3>
                        <h4 className='text-lg'><LocationOnIcon />&nbsp;&nbsp;{regEvents[event].location}</h4>
                        {regEvents[event].contact && <p><DialpadIcon />&nbsp;&nbsp;{regEvents[event].contact}</p>}
                        {/* <br/>
                        <Button style={{background: 'black', paddingLeft: 17, paddingRight: 17, color: "white"}}>Learn More</Button> */}
                      </div>
                      <img className='h-[15vh] w-[13vh] object-cover' src={regEvents[event].poster} alt="Event poster" />
                    </div>
                    <div id={`description-event-${event}`} className='description-event-popup p-8 pt-12 bg-black'>
                      <button id='arrow' onClick={() => {
                        document.getElementById(`description-event-${event}`).style.display="none";
                      }} className='w-12 bg-white text-black text-3xl py-2 rounded-lg'>
                        &#8592;
                      </button><br/><br/>
                      <h1 className='text-white text-left'>{regEvents[event].title}</h1><br/>
                      <hr className='mb-4'/>
                      <div
                        x-data="{}"
                        x-init="$nextTick(() => {
                            let ul = $refs.logos;
                            ul.insertAdjacentHTML('afterend', ul.outerHTML);
                            ul.nextSibling.setAttribute('aria-hidden', 'true');
                        })"
                        class="w-full inline-flex flex-nowrap overflow-hidden"
                      >
                        <ul x-ref="logos" class="flex items-center justify-center md:justify-start [&_li]:mx-2 [&_img]:max-w-none text-2xl animate-infinite-scroll text-white">
                            <li class="flex-shrink-0">
                              <h1>{ regEvents[event].title }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ regEvents[event].location }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ regEvents[event].date }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ regEvents[event].title }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ regEvents[event].location }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ regEvents[event].date }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ regEvents[event].title }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ regEvents[event].location }&nbsp;|</h1>
                            </li>
                        </ul>                
                      </div>
                      <hr className='mt-4'/>
                      <div className='flex mt-4'>
                        {/* <button className=' bg-white w-full basis-full text-center mr-4 p-4 rounded-lg'>RSVP</button> */}
                        <button onClick={() => {document.getElementById(`imgPoster-${event}`).style.display="block";document.getElementById(`imgPosterButton-${event}`).style.display="block"; }} className=' bg-[#B3FF41] w-full basis-full text-black text-center p-4 rounded-lg'>FLYER/POSTER</button>
                      </div><br/>
                      <img id={`imgPoster-${event}`} src={regEvents[event].poster} className='imgPoster-eventT w-full rounded-lg'/>
                      <button className='imgPoster-eventT-button' id={`imgPosterButton-${event}`} onClick={() => {document.getElementById(`imgPoster-${event}`).style.display="none";document.getElementById(`imgPosterButton-${event}`).style.display="none"; }}>Close</button>
                      <div>
                        <h3 className='text-white flex items-center m-4 ml-0'><CalendarTodayIcon/>&nbsp;{regEvents[event].date}</h3>
                        <h3 className='text-white flex items-center m-4 ml-0'><LocationOnIcon/>&nbsp;{regEvents[event].location}</h3>
                        <h3 className='text-white flex items-center m-4 ml-0'><AccessAlarmIcon/>&nbsp;{convertToReadableTime(regEvents[event].time_start)}</h3>
                      </div>
                      <h1 className='text-white'>Description</h1>
                      <h3 className='mt-2.5 text-neutral-300'>{regEvents[event].note}</h3>
                      <br/>
                      <h3 className='text-neutral-500'>
                        Designed in Davis<br/>by California
                      </h3>
                      <br/>
                      <hr/>
                    </div>
                  </React.Fragment>
              ))
            ) : (
              <p className='mt-4'>No registered events found.</p>
            )}
          </div>
        </div>
      </React.Fragment>
    ) : 
    <h1>Hi</h1>
  );
}

export default NewProfile;

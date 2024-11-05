import React, { useContext, useEffect, useState } from 'react';
import "./EventsList.css";
import { doc, setDoc, getDocs, collection, updateDoc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DialpadIcon from '@mui/icons-material/Dialpad';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { Button } from '@mui/material';
import { StateContext } from './Context/Context';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import add from "./assets/add.png";
import {Input} from '@mui/material';
import ConfettiExplosion from 'react-confetti-explosion';

function EventsList() {
  const [allEvents, setAllEvents] = useState([]);
  const { emailUser, eventsUser } = useContext(StateContext);
  const [file, setFile] = useState(null);
  const [showFullNote, setShowFullNote] = useState(false);
  const [storageUrl, setStorageUrl] = useState('');
  const [randomId, setRandomId] = useState('');
  const [isExploding, setIsExploding] = React.useState(false);

  const colors = ["#EDFF8C", "#CFE1CA", "#FD8A8A", "#9EA1D4", "#FFF0D9"];

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const fetchedEvents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      fetchedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Assign colors in sequence without randomization
      const eventsWithColors = fetchedEvents.map((event, index) => ({
        ...event,
        color: colors[index % colors.length], // Use modulus to cycle through colors
      }));
  
      setAllEvents(eventsWithColors);
    };
  
    fetchEvents();
  }, []);
  
  const handleFileSelect = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      await uploadFile(selectedFile);
    }
  };

  const makeEvent = async () => {
    const title = document.getElementById('title-event').value || 'Check QR Code/Poster';
    const date = document.getElementById('date-event').value || 'Check QR Code/Poster';
    const timeStart = document.getElementById('event-start').value || 'Check QR Code/Poster';
    const timeEnd = document.getElementById('event-end').value || 'no set end time';
    const location = document.getElementById('location-event').value || 'Check QR Code/Poster';
    const note = document.getElementById("event-note").value || 'Check QR Code/Poster';
    const link = document.getElementById('link-event').value || 'Check QR Code/Poster';
    const contactEmailNum = document.getElementById("contact-event").value || 'Check QR Code/Poster';

    const eventData = {
      title, date, time_start: timeStart, time_end: timeEnd,
      poster: storageUrl, location, link, note,
      contact: contactEmailNum
    };

    try {
      const randomId = Math.random().toString(36).slice(2);
      await setDoc(doc(db, 'events', randomId), eventData);
      alert("Event added!")
      document.getElementById("form-addingEvent").style.display="none";
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to create event. Please try again.');
    }
};

  const uploadFile = async (file) => {
    const randomID = Math.random().toString(36).slice(2);
    try {
      setRandomId(randomID);
      const storageRef = ref(storage, `events/${randomID}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setStorageUrl(downloadURL);
      document.getElementById("add-poster").setAttribute("src", downloadURL);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload event poster.');
    }
  };

  async function rsvpEvent(id) {
    await setDoc(doc(db, emailUser, "eventRSVPD_" + id), {
      "eventID": id
    });
    document.getElementById(`event-rsvp-button ${id}`).innerHTML = "ALREADY RSVPD";
    document.getElementById(`event-rsvp-button ${id}`).style.background = "black";
  }

  function adjustDateToDisplay(dateStr) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1); // Add one day
    return date.toISOString().split('T')[0];
  }
  
  // Group events by the adjusted date
  const groupEventsByDate = (allEvents) => {
    return allEvents.reduce((acc, event) => {
      const date = adjustDateToDisplay(event.date); // Adjust date for display
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
  };

  const renderNote = (note) => {
    const wordCount = note.trim().split(/\s+/).length;
    if (wordCount > 20) {
      return (
        <>
          {showFullNote ? note : note.split(/\s+/).slice(0, 20).join(" ") + "..."}<br />
          <button onClick={handleShowMoreToggle} className="show-more-button">
            {showFullNote ? "Show Less" : "Show More"}
          </button>
        </>
      );
    }
    return note;
  };

  const handleShowMoreToggle = () => {
    setShowFullNote(!showFullNote);
  };

  const currentDate = new Date().toISOString().split('T')[0];

  function convertDateFormat(dateStr) {
    const date = new Date(dateStr);
    function getOrdinalSuffix(day) {
      if (day % 10 === 1 && day % 100 !== 11) {
        return 'st';
      } else if (day % 10 === 2 && day % 100 !== 12) {
        return 'nd';
      } else if (day % 10 === 3 && day % 100 !== 13) {
        return 'rd';
      }
      return 'th';
    }
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  }

  function hasDatePassed(dateStr) {
    return dateStr < currentDate;
  }

  const eventsByDate = groupEventsByDate(allEvents);

  function checkDate(dateGiven) {
    const today = new Date();
    const formattedDate = today.getFullYear() + '-' + 
                          String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(today.getDate()).padStart(2, '0');
    const today1 = new Date();
    today1.setDate(today1.getDate() + 1);
    
    const formattedDate1 = today1.getFullYear() + '-' + 
                          String(today1.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(today1.getDate()).padStart(2, '0');
    
    console.log(formattedDate1);
    if (dateGiven.toString() === formattedDate) {
      return "Happening Today";
    } else if (dateGiven.toString() === formattedDate1) {
      return "Happening Tomorrow";
    } else {
      return convertDateFormat(dateGiven.toString());
    }
  }

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
    <div id="events-list-view" className='h-screen overflow-scroll w-[100vw]'>
      {/* <div id="make-event-main">
        <MakeEvent/>
      </div> */}
      {isExploding && <ConfettiExplosion
        force={0.4}
        duration ={2200}
        particleCount ={100}
        id="confettiThingy"
        onComplete={() => {
          setIsExploding(false);
        }}
        // style={{height: "100vh", width: "100vw", background: "transparent"}}
      />}
          <div className="form-addingEvent" id="form-addingEvent">
            <div>
              <center>
                <h1>Add Event</h1>
                <p>Add Poster of Event <b>(required)</b></p><br/>
                <img src={add} alt="Add Poster" id="add-poster" onClick={() => document.getElementById('fileInput').click()}  />
                <input type="file" id="fileInput" onChange={handleFileSelect} style={{ display: 'none' }} />
                <br />
              </center>
              <div>
                <h3>What's the title of the event? <b>(required)</b></h3>
                <input id="title-event" style={{borderBottom: "1px solid white", color: "white"}} required />
                <h3>When is the event? <b>(required)</b></h3>
                <input type="date" id="date-event" />
                <h3>When does the event <b>start</b>? <b>(required)</b></h3>
                <input type="time" id="event-start" />
                <h3>When does the event <b>end</b>?</h3>
                <p>(Optional)</p>
                <input type="time" id="event-end" />
                <h3>Add a description? (<b>Maximum</b> 40 words) <b>(required)</b></h3>
                {/* <h4 style={{margin: 0,marginBottom: "10px"}} >We cut you off at 20 words</h4> */}
                <input style={{borderBottom: "1px solid white", color: "white"}} id="event-note" />
                <h3>Where is the event <b>located</b>? <b>(required)</b></h3>
                <input style={{ borderBottom: "1px solid white", color: "white"}} id="location-event"/>
                <h3>Link to the event page? (Optional)</h3>
                <Input sx={{width: "90%", borderBottom: "1px solid white", color: "white"}} id="link-event"/><br/><br/>
                <h3>Contact Email/Number <b>(required)</b></h3>
                <Input sx={{width: "90%", borderBottom: "1px solid white", color: "white"}} id="contact-event"/>
                <br/><br/><br/>
                <center>
                  <Button
                    onClick={makeEvent}
                    size="large"
                    variant="contained"
                    style={{ background: 'black', minWidth: '30vw' }}
                  >
                    MAKE EVENT
                  </Button><br/><br/>
                  <Button onClick={() => {
                    // window.location.reload();
                    document.getElementById("form-addingEvent").style.display="none"
                  }}>
                  GO BACK
                  </Button><br/><br/>
                  <br/><br/><br/><br/>
                </center>
                
              </div>
            </div>
          </div>
      <div className='flex pl-6 items-end justify-between pr-6'>
        <h1 className=' mt-14 text-5xl text-white opacity-50 mb-4'>Netwrk.</h1>
        <h3 onClick={() => {
          window.open("/Profile", "_self")
        }} className=' mt-14 text-xl text-white border-solid border-b-2 border-white mb-4 '>Profile</h3>
      </div><br/>
      <div className='flex text-white items-center justify-between pl-6 pr-7'>
        <button onClick={() => {
          window.open("/CardView", "_self")
        }} className='p-3 bg-white text-black rounded-lg text-lg'>Quick Scroll&nbsp;&#8594;</button>
        <button className='p-3 bg-slate-800 rounded-lg text-lg' onClick={() => {document.getElementById("form-addingEvent").style.display="block"}}>Host Event</button>
      </div>
      <br/>
      <h1 className='text-center text-white border-solid border-neutral-400 border-[1px] border-r-0 border-l-0 pt-4 pb-4 mt-4'>You can see all your added events in your profile</h1>
      {allEvents && eventsUser!=null ? 
      Object.keys(eventsByDate).map((date) => (
        <React.Fragment key={date}>
          {hasDatePassed(date) ? (
            ""
          ) : (
            <React.Fragment>
              <div className='date-list-event mt-8'>
                {/* <h2 className='text-white pl-6 text-2xl mb-7'>{convertDateFormat(new Date(date).toLocaleDateString().toString()).toString().includes("Invalid") ? "No Date: See QR Codes" : convertDateFormat(new Date(date).toLocaleDateString().toString())}</h2> */}
                <h2 className='text-white pl-6 text-4xl mb-3'>{checkDate(date)}</h2>
                {eventsByDate[date].map((event) => (
                  <React.Fragment>
                    <div key={event.id} id="listType-event" style={{ background: event.color }} onClick={() => {document.getElementById(`description-event-${event.id}`).style.display="block"}}>
                      <div className='pr-5'>
                        <p className='text-md'><AccessTimeIcon />&nbsp;&nbsp;{convertToReadableTime(event.time_start)}</p>
                        <h3 className='text-2xl mt-3'>{event.title}</h3>
                        <h4 className='text-md'><LocationOnIcon />&nbsp;&nbsp;{event.location}</h4>
                        {/* {event.contact && <p><DialpadIcon />&nbsp;&nbsp;{event.contact}</p>} */}
                        {/* <br/>
                        <Button style={{background: 'black', paddingLeft: 17, paddingRight: 17, color: "white"}}>Learn More</Button> */}
                      </div>
                      <img className='h-[20vh] w-[13vh] object-cover rounded-xl' src={event.poster} alt="Event poster" />
                    </div>
                    <div id={`description-event-${event.id}`} className='description-event-popup p-8 pt-12 bg-black'>
                      <button id='arrow' onClick={() => {
                        document.getElementById(`description-event-${event.id}`).style.display="none";
                      }} className='w-12 bg-white text-black text-3xl py-2 rounded-lg'>
                        &#8592;
                      </button><br/><br/>
                      <h1 className='text-white text-left'>{event.title}</h1><br/>
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
                              <h1>{ event.title }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ event.location }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ event.date }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ event.title }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ event.location }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ event.date }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ event.title }&nbsp;|</h1>
                            </li>
                            <li class="flex-shrink-0">
                              <h1>{ event.location }&nbsp;|</h1>
                            </li>
                        </ul>                
                      </div>
                      <hr className='mt-4'/>
                      <div className='flex mt-4'>
                        {eventsUser.includes(event.id) ? 
                        (
                          <button id={`buttonRSVP-${event.id}`} className=' bg-neutral-800 text-white w-full basis-full text-center mr-4 p-4 rounded-lg'>
                            ALREADY RSVPD
                          </button>
                        )
                      :
                      (
                        <button id={`buttonRSVP-${event.id}`} onClick={async () => {
                          await setDoc(doc(db, emailUser, `eventRSVPD_${event.id}`), {
                            "eventID": event.id
                          });
                          setIsExploding(true);
                          document.getElementById(`description-event-${event.id}`).style.display="none";
                          document.getElementById(`buttonRSVP-${event.id}`).innerHTML='ALREADY RSVPD';
                          document.getElementById(`buttonRSVP-${event.id}`).style.background='grey';
                          window.location.reload();
                        }} className=' bg-white w-full basis-full text-center mr-4 p-4 rounded-lg'>
                          RSVP
                        </button>
                      ) }
                        
                        <button onClick={() => {document.getElementById(`imgPoster-${event.id}`).style.display="block";document.getElementById(`imgPosterButton-${event.id}`).style.display="block"; }} className=' bg-[#B3FF41] w-full basis-full text-center p-4 rounded-lg'>FLYER/POSTER</button>
                      </div><br/>
                      <img id={`imgPoster-${event.id}`} src={event.poster} className='imgPoster-eventT w-full rounded-lg'/>
                      <button className='imgPoster-eventT-button text-white' id={`imgPosterButton-${event.id}`} onClick={() => {document.getElementById(`imgPoster-${event.id}`).style.display="none";document.getElementById(`imgPosterButton-${event.id}`).style.display="none"; }}>Close</button><br/>
                      <div>
                        <h3 className='text-white flex items-center m-4 ml-0'><CalendarTodayIcon/>&nbsp;{event.date}</h3>
                        <h3 className='text-white flex items-center m-4 ml-0'><LocationOnIcon/>&nbsp;{event.location}</h3>
                        <h3 className='text-white flex items-center m-4 ml-0'><AccessAlarmIcon/>&nbsp;{convertToReadableTime(event.time_start)}</h3>
                      </div>
                      <h1 className='text-white'>Description</h1>
                      <h3 className='mt-2.5 text-neutral-300'>{event.note}</h3>
                      <br/>
                      <h3 className='text-neutral-500'>
                        Designed in Davis<br/>by California
                      </h3>
                      <br/>
                      <hr/>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )) : (
        <h3>Loading...</h3>
      )}
      <br /><br /><br /><br /><br />
    </div>
  );
}

export default EventsList;

import React, { useContext, useEffect, useState } from 'react';
import EventCard from './EventCard';
import "./Thing.css"
import { Button } from '@mui/material';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { StateContext } from './Context/Context';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Confetti from 'react-confetti'
import ConfettiExplosion from 'react-confetti-explosion';
import { useDialogs } from '@toolpad/core';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function Thing() {
  const width="600px";
  const height="300px";
  const dialogs = useDialogs();
  // const [allEvents, setAllEvents] = useState(null);
  const [myEvents, setMyEvents] = useState(null);
  const {emailUser, allEvents, eventsUser} = useContext(StateContext);
  let pointer = 0;
  let fullLength = 0;
  const currentDate = new Date().toISOString().split('T')[0];
  let eventsRSVPd = []

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
    if (dateGiven.toString()==today1.toString()) {
      return "Happening Today";
    } else if (dateGiven.toString()==today1.toString()) {
      return "Happening Tomorrow";
    } else {
      return convertDateFormat(dateGiven.toString());
    }
  }

  const [isExploding, setIsExploding] = React.useState(false);

  function convertToReadableTime(time) {
    if (!time) {
        return "Time not available"; // Or any default message you want
    }

    // Split the time string into hours and minutes
    let [hour, minute] = time.split(":").map(Number);
    
    // Determine am or pm
    const period = hour >= 12 ? "pm" : "am";
    
    // Convert to 12-hour format
    hour = hour % 12 || 12; // Convert 0 to 12 for midnight and handle other cases
    
    // Return formatted time
    return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
}

  // useEffect(() => {
  //   async function fetchEvents() {
  //     const allEventsPromise = getDocs(collection(db, 'events'));
  //     const myEventsPromise = getDocs(collection(db, emailUser));
      
  //     const [allEventsSnapshot, myEventsSnapshot] = await Promise.all([allEventsPromise, myEventsPromise]);
      
  //     const fetchedEvents = allEventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //     fetchedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  //     setAllEvents(fetchedEvents);
      
  //     const myEvents = {};
  //     myEventsSnapshot.forEach((doc) => {
  //       myEvents[doc.id] = doc.data();
  //     });
  //     setMyEvents(myEvents);
  //     console.log(myEvents);
  //     console.log(fetchedEvents)
  //   }
  //   fetchEvents();
  // }, [emailUser]);
  

  // useEffect(() => {
  // }, [])

  function display() {
    console.log(allEvents);
    let p = 0;
    for (let event in allEvents) {
      if(eventsUser.includes(allEvents[event].id)) {
        console.log("Skipped");
      } else {
        const id = event;
        const eventData = allEvents[event];
        const div = document.createElement("div");
        div.setAttribute("class", "eventCardMain");
        div.setAttribute("id", `eventCardMain${p}`);
        p=p+1;
        div.style.background=`linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1) 100%), url('${eventData.poster}')`;
        div.style.backgroundSize="cover";
        div.style.backgroundPosition="center";
        div.style.borderRadius="20px"
        const textDiv = document.createElement('div');
        const h1 = document.createElement("h1");
        h1.innerHTML=eventData.title;
        const h3 = document.createElement("h3");
        h3.innerHTML=`${checkDate(eventData.date)} | ${convertToReadableTime(eventData.timeStart)} | ${eventData.location}`;
        const flexButtons = document.createElement("div");
        flexButtons.setAttribute("class", "flexButtonsEvent");
        const button = document.createElement("button");
        button.innerHTML=`Learn more`;
        const button2 = document.createElement("button");
        button2.innerHTML=`Next Event &#8594;`;
        button2.addEventListener("click", function() {
          showEvent();
        })
        flexButtons.appendChild(button2);
        flexButtons.appendChild(button);
        textDiv.appendChild(h1);
        textDiv.appendChild(h3);
        textDiv.appendChild(flexButtons);
  
        const descriptionDiv = document.createElement("div");
        descriptionDiv.setAttribute('id', `eventCardMainDescription${p}`);
        descriptionDiv.setAttribute("class", "eventCardMainDescription")
        const arrow = document.createElement("h3");
        arrow.setAttribute("class", "arrow")
        arrow.innerHTML=`&#8592;`;
        arrow.addEventListener("click", function() {
          descriptionDiv.style.display="none";
        })
        const title = document.createElement("h1");
        title.innerHTML=eventData.title;
        const descript = document.createElement("div");
        descript.setAttribute("class", "descriptionLiner");
        const loc = document.createElement("span");
        loc.innerHTML=eventData.location ? eventData.location: "";
        const date = document.createElement("span");
        date.innerHTML=eventData.date ? convertDateFormat(eventData.date): "";
        const tm = document.createElement("span");
        tm.innerHTML=eventData.timeStart ? convertToReadableTime(eventData.timeStart) : "";
        descript.appendChild(loc);
        descript.appendChild(date);
        descript.appendChild(tm);
        const buttonDiv = document.createElement('div');
        buttonDiv.setAttribute("class", "buttonDivEvent");
        const but1 = document.createElement("button");
        but1.innerHTML="RSVP";
        but1.addEventListener("click", async function() {
          await setDoc(doc(db, emailUser, `eventRSVPD_${id}`), {
            "eventID": id
          });
          setIsExploding(true);
          descriptionDiv.style.display="none";
          showEvent();
        })
        const but2 = document.createElement("button");
        but2.innerHTML="View Flyer";
        const img = document.createElement("img");
        img.setAttribute("src", `${eventData.poster}`);
        const b = document.createElement("button");
        b.setAttribute("id", "buttonOpen");
        b.innerHTML="Close"
        but2.addEventListener("click", function() {
          img.style.display="block";
          b.style.display="block";
        })
        b.addEventListener("click", function() {
          img.style.display="none";
          b.style.display="none";
        })
        buttonDiv.append(but1);
        buttonDiv.append(but2);
        const totalDes = document.createElement("div");
        totalDes.setAttribute('class', "totalDescription");
        const titledes = document.createElement("h1");
        titledes.innerHTML="Description";
        const des = document.createElement("h4");
        des.innerHTML=eventData.note;
        const mark = document.createElement("h3");
        mark.innerHTML=`Designed in Davis by <br/> California`;
        button.addEventListener("click", function() {
          descriptionDiv.style.display="block";
        })
        totalDes.appendChild(titledes);
        totalDes.appendChild(des);
        totalDes.appendChild(mark);
        descriptionDiv.appendChild(arrow);
        descriptionDiv.appendChild(title);
        descriptionDiv.appendChild(descript);
        descriptionDiv.appendChild(buttonDiv);
        descriptionDiv.appendChild(img);
        descriptionDiv.append(b);
        descriptionDiv.appendChild(totalDes);
  
        div.appendChild(textDiv);
        div.appendChild(descriptionDiv);
        document.getElementById("events-card-listed").appendChild(div);
      }
    }
    fullLength=p;
  }

  async function showEvent() {
    for (let i=0; i<fullLength; i++) {
      const element = document.getElementById(`eventCardMain${i}`);
      element.classList.add("fade-out");
      element.addEventListener("animationend", () => {
        element.style.display = "none";
      });
      // document.getElementById(`eventCardMain${i}`).style.display="none";
    }
    if (pointer!=fullLength) {
      document.getElementById(`eventCardMain${pointer}`).classList.remove("fade-out");
      document.getElementById(`eventCardMain${pointer}`).style.display="flex";
      console.log(eventsRSVPd);
      pointer=pointer+1;
    } else {
      await dialogs.alert("No more events to show!");
    }
  }

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("skeleton-loading").style.display='none'
      if(allEvents && eventsUser) {
        console.log(eventsUser);
        display();
        showEvent();
      }
    }, 1500);
  }, [])
  
  return (
    <div id="events-container" className='h-screen overflow-scroll text-center'>
      <div className='flex pl-6'>
        <h1 className='text-center mt-10 text-6xl text-white opacity-50 mb-4'>Netwrk.</h1>
      </div>
      <div id='skeleton-loading' className='h-[100vh] w-full'>
      <Box sx={{ width: 300 }}>
        <Skeleton />
        <Skeleton animation="wave" />
        <Skeleton animation={false} />
      </Box>
      </div>
        <div className='text-white flex p-6 pb-6'>
          <button onClick={() => {
            window.open("/", "_self");
          }} className='basis-full w-full p-2 rounded-lg border-solid border-white bg-white mr-2 text-black'>List View</button>
          <button onClick={() => {
            window.open("/Profile", "_self");
          }} className='basis-full w-full p-2 rounded-lg border-solid border-white mr-2 bg-slate-700'>Profile</button>
          <button className='basis-full w-full p-2 rounded-lg border-solid border-white border-[0.5px]'>Add Event</button>
        </div>
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
      <div id="events-cards">
        {allEvents ? 
        <div id="events-card-listed">
          
        </div>
      :
      <h1>Loading...</h1>}
      </div>
    </div>
  )
}

export default Thing;


// <EventCard date={"30th Nov 2024"} timeStart={"4:00 pm"} name={"Halloween Block Party"} poster={"https://firebasestorage.googleapis.com/v0/b/netwrk-82dc0.appspot.com/o/events%2F28gnvyvzspb?alt=media&token=cdbba233-0699-4171-b3ce-9ff30454238b"} description={"Everyone is invited for the Co-op’s annual Member appreciation festivities including live music, local food trucks, vendors & more! There will be activities for all ages, costume contest, free photo booth, trick-or-treating, and a dance party with Cowboys After Dark. Co-op Members get special access to the VIP Lounge for the first hour of the event for drinks and charcuterie (vegan options too). The first 50 members who check in get a surprise gift from local artist, bb mad. See the full schedule below"} contact={"530 979 7177"} location={"620 G. St. Davis CA"}/>
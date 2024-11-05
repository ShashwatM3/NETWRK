import React, {useState} from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import "./EventCard.css";
import { Button } from '@mui/material';

function EventCard({ name, date, timeStart, poster, description, contact, location }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLimitedText = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') : text;
  };
  
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

  // Check if the description exceeds 20 words
  const isLongText = description.split(' ').length > 20;
  
  return (
    <div id="event-card-main" className='text-white p-5 pt-0'>
      <div id='name-card' className='h-[85vh] bg-cover bg-center rounded-2xl' style={{backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0)),url(${poster})`}}>
        <div>
        <h1>{name}</h1>
        <h3>{date}</h3>
        <h3>{convertToReadableTime(timeStart)}</h3>
        <br/>
        <Button variant="contained" style={{background: "white", color: "black", marginRight: "10px"}} onClick={() => {document.getElementById("card-content-hidden").style.display="flex"}}>Learn More</Button>
        {/* <Button variant="contained" color="warning" style={{marginBottom: "10px"}}>RSVP</Button><br/> */}
        <Button>Next Event &#8594;</Button>
        </div>
      </div>
      <div id="card-content-hidden">
          {/* <h3>
            {isExpanded ? description : getLimitedText(description, 20)}
            {isLongText && (
              <span
                style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? ' See less' : ' See more'}
              </span>
            )}
          </h3> */}
          <div className='bg-neutral-800 text-left' style={{borderRadius: "20px 20px 0px 0px"}} id="description">
            <div id='banner-card' style={{background: `url(${poster})`, height: "30vh", backgroundSize: "cover", borderRadius: "20px 20px 0px 0px"}}></div>
            <br/>
            <h1 className='p-3 text-3xl'>{name}</h1>
            <div className='p-3'>
            <h3>{date} | Starts at {timeStart}</h3>
            <h3>Contact @ {contact}</h3>
            <h3><LocationOnIcon/>&nbsp;&nbsp;{location}</h3>
            <br/>
            </div>
            <h4 className='p-3 pt-0 pb-5'>{description}</h4>
            <div className='flex'>
            <Button style={{marginLeft: "10px", marginRight: "10px"}} onClick={() => {
              document.getElementById("card-content-hidden").style.display="none";
            }}>Close</Button>
            {/* <Button variant="contained">RSVP</Button> */}
            </div>
          </div>
      </div>
    </div>
  )
}

export default EventCard
import React, { useEffect, useState } from 'react';
import "./App.css";
import StartScreen from './StartScreen';
import { DialogsProvider } from '@toolpad/core/useDialogs';
import { StateContext } from "./Context/Context";
import mainlogo from "./assets/mainlogo.png";
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from './firebase';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Thing from './Thing';
import { Theme } from "@radix-ui/themes";
import EventsList from './EventsList';
import NewProfile from './Components/NewProfile';
import Waitlist from "./Waitlist";

function App() {
  const [userNameUser, setUserNameUser] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [userData, setUserData] = useState(null);
  const [userData2, setUserData2] = useState(null);
  const [videoVisible, setVideoVisible] = useState(true);
  const [allEvents, setAllEvents] = useState([]);
  const [eventsUser, setEventsUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchUserData = async () => {
      const emailFromStorage = localStorage.getItem("email address netwrk web app");
      if (emailFromStorage) {
        const querySnapshot = await getDocs(collection(db, emailFromStorage));
        let obj = {};
        querySnapshot.forEach((doc) => {
          obj[doc.id] = doc.data();
        });
        console.log(obj);

        const querySnapshot1 = await getDocs(collection(db, 'events'));
        const fetchedEvents = querySnapshot1.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const arr = [];
        function getEventId(fullString) {
          return fullString.split('_').pop();
        }
        for (let el in obj) {
          if (el.includes("eventRSVPD_")) {
            arr.push(getEventId(el));
          }
        }
        console.log(arr);

        if (Object.keys(obj).length !== 0) {
          setEmailUser(emailFromStorage);
          setUserData(obj);
          console.log(fetchedEvents);
          setAllEvents(fetchedEvents);
          console.log(arr);
          setEventsUser(arr);
        }
      }
      setLoading(false); // Set loading to false once data fetching is complete
    };

    fetchUserData();
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <StateContext.Provider value={{ videoVisible, setVideoVisible, userNameUser, setUserNameUser, emailUser, setEmailUser, userData, userData2, setUserData2, allEvents, eventsUser, setEventsUser }}>
      <Theme>
        <DialogsProvider>
          {loading ? (
            <div className='h-screen bg-black w-full text-transparent'>Loading...</div> // You can replace this with a loading spinner if desired
          ) : (emailUser || userData ? (
            <Router>
              <Switch>
                <Route path='/Profile'>
                  <NewProfile />
                </Route>
                <Route path="/CardView">
                  <Thing />
                </Route>
                <Route path="/">
                  <EventsList />
                </Route>
              </Switch>
            </Router>
          ) : (
            <StartScreen />
          ))}
        </DialogsProvider>
      </Theme>
    </StateContext.Provider>
  );
}

export default App;

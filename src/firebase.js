// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWouaTbDi376xONXR9dEQXEArUNp7Qgzc",
  authDomain: "netwrk-82dc0.firebaseapp.com",
  projectId: "netwrk-82dc0",
  storageBucket: "netwrk-82dc0.appspot.com",
  messagingSenderId: "955659663300",
  appId: "1:955659663300:web:403a72ecf40ea005551691",
  measurementId: "G-MFW091PZ1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
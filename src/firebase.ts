// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1G-tmuDOhlf9Tu7--ELBhcSc0f147FCg",
  authDomain: "user-languages-db.firebaseapp.com",
  databaseURL: "https://user-languages-db-default-rtdb.firebaseio.com",
  projectId: "user-languages-db",
  storageBucket: "user-languages-db.appspot.com",
  messagingSenderId: "996638784599",
  appId: "1:996638784599:web:595cd8ef2f9a715aa2b712",
  measurementId: "G-GNQJ3B862J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
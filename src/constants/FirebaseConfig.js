import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

export const firebaseConfig = {
  apiKey: "AIzaSyAdKDNH8JCsZ1oRqgr1FEALF7epF09alUQ",
  authDomain: "final-otp-validation.firebaseapp.com",
  projectId: "final-otp-validation",
  storageBucket: "final-otp-validation.appspot.com",
  messagingSenderId: "577840032711",
  appId: "1:577840032711:web:3bf76f648b6b8e95dbc7e2",
  measurementId: "G-X31S4FKYN3"
  };

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
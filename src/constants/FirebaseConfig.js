import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

export const firebaseConfig = {
    apiKey: "AIzaSyD3zQ5N7Q-X1iIlOs8VxR58a_3OlDORy0c",
    authDomain: "otp-validation-f84d2.firebaseapp.com",
    projectId: "otp-validation-f84d2",
    storageBucket: "otp-validation-f84d2.appspot.com",
    messagingSenderId: "1059269265861",
    appId: "1:1059269265861:web:2fdf1cc103d16fa380a3ac",
    measurementId: "G-36NMREFKQ6"
  };

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
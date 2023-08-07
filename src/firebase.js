import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCt3jGYBUayaqvvMyNZTAG5dYixtxWQv-c",
  authDomain: "hogwartvoyages.firebaseapp.com",
  projectId: "hogwartvoyages",
  storageBucket: "hogwartvoyages.appspot.com",
  messagingSenderId: "988036262167",
  appId: "1:988036262167:web:0269e2a8d4446ae351ef52",
  measurementId: "G-QLFFP7TC8R",
};

firebase.initializeApp(firebaseConfig);

// export const auth = firebase.auth();
// export default firebase;
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
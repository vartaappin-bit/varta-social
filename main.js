import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDiiG8WXvkd0p1d7hpyV_oN3Y4N3SskvQ",
  authDomain: "varta-251e7.firebaseapp.com",
  projectId: "varta-251e7",
  storageBucket: "varta-251e7.appspot.com",
  messagingSenderId: "9622396658",
  appId: "1:9622396658:web:56485a906fa12a0cdc7a6b",
  measurementId: "G-1S5XCJGJ2"
};

const app = initializeApp(firebaseConfig);

document.getElementById("app").innerText = "Varta App Initialized!";

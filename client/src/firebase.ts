// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9c1T5DN_XSUucGdzg_0VJl9Skh2wfK8Q",
  authDomain: "mini-militia-web.firebaseapp.com",
  projectId: "mini-militia-web",
  storageBucket: "mini-militia-web.firebasestorage.app",
  messagingSenderId: "633329355861",
  appId: "1:633329355861:web:53cae1960ded3a064118dc",
  measurementId: "G-82KPKBH5NM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app, analytics };
// Initialize Firebase Authentication and get a reference to the service

// Import the functions you need from the SDKs you need
import { initializeApp,getApps,getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_AUTH_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_APP_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_AUTH_APP_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_AUTH_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_AUTH_APP_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_AUTH_APP_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_AUTH_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export {app,auth};


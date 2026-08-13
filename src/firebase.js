import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// הגדרות פרויקט ה-Firebase של challenges-app
const firebaseConfig = {
  apiKey: "AIzaSyCPqztRzP5ICsCW7UV3KePdKM5-AyyKJjc",
  authDomain: "challenges-app-cbed3.firebaseapp.com",
  projectId: "challenges-app-cbed3",
  storageBucket: "challenges-app-cbed3.firebasestorage.app",
  messagingSenderId: "808601459739",
  appId: "1:808601459739:web:05c41cec9ff505068cecbe",
  measurementId: "G-VRV3S1L6QG"
};

// אתחול Firebase
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (e) {
  console.warn("Firebase failed to initialize.", e);
}

export const isFirebaseActive = typeof db !== 'undefined' && db !== null;
export { db, auth };
export default app;

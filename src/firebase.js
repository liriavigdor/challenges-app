import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// הזן כאן את הגדרות פרויקט ה-Firebase שלך מה-Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// אתחול Firebase (נא להחליף בערכים האמיתיים כשתרצה להפעיל את בסיס הנתונים בענן)
let app;
let db;
let auth;

try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  }
} catch (e) {
  console.warn("Firebase failed to initialize. Using mock data mode.", e);
}

export const isFirebaseActive = typeof db !== 'undefined' && db !== null;
export { db, auth };
export default app;

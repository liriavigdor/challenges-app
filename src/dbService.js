import { db, isFirebaseActive } from "./firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  addDoc 
} from "firebase/firestore";
import { initialUsers, initialChallenges, initialFeed } from "./mockData";

// LocalStorage Helper Keys
const USERS_KEY = "challenges_users";
const CHALLENGES_KEY = "challenges_items";
const FEED_KEY = "challenges_feed";

// Initialize LocalStorage if empty
function initLocalStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(CHALLENGES_KEY)) {
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(initialChallenges));
  }
  if (!localStorage.getItem(FEED_KEY)) {
    localStorage.setItem(FEED_KEY, JSON.stringify(initialFeed));
  }
}

initLocalStorage();

// Users Service
export async function getUsers() {
  if (isFirebaseActive) {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      if (usersList.length === 0) {
        // Seed Firestore if empty
        for (const user of initialUsers) {
          const { id, ...rest } = user;
          await setDoc(doc(db, "users", id), rest);
          usersList.push(user);
        }
      }
      return usersList;
    } catch (e) {
      console.error("Error fetching users from Firebase, using LocalStorage fallback", e);
    }
  }
  return JSON.parse(localStorage.getItem(USERS_KEY));
}

export async function updateUser(user) {
  if (isFirebaseActive) {
    try {
      const { id, ...rest } = user;
      await setDoc(doc(db, "users", id), rest, { merge: true });
      return;
    } catch (e) {
      console.error("Error updating user in Firebase, using LocalStorage fallback", e);
    }
  }
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const updatedUsers = users.map(u => u.id === user.id ? user : u);
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
}

// Challenges Service
export async function getChallenges() {
  if (isFirebaseActive) {
    try {
      const querySnapshot = await getDocs(collection(db, "challenges"));
      const challengesList = [];
      querySnapshot.forEach((doc) => {
        challengesList.push({ id: doc.id, ...doc.data() });
      });
      if (challengesList.length === 0) {
        // Seed Firestore if empty
        for (const challenge of initialChallenges) {
          const { id, ...rest } = challenge;
          await setDoc(doc(db, "challenges", id), rest);
          challengesList.push(challenge);
        }
      }
      return challengesList;
    } catch (e) {
      console.error("Error fetching challenges from Firebase, using LocalStorage fallback", e);
    }
  }
  return JSON.parse(localStorage.getItem(CHALLENGES_KEY));
}

export async function saveChallenge(challenge) {
  if (isFirebaseActive) {
    try {
      const { id, ...rest } = challenge;
      await setDoc(doc(db, "challenges", id), rest);
      return;
    } catch (e) {
      console.error("Error saving challenge to Firebase, using LocalStorage fallback", e);
    }
  }
  const challenges = JSON.parse(localStorage.getItem(CHALLENGES_KEY)) || [];
  challenges.push(challenge);
  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
}

// Feed Service
export async function getFeed() {
  if (isFirebaseActive) {
    try {
      const querySnapshot = await getDocs(collection(db, "feed"));
      const feedList = [];
      querySnapshot.forEach((doc) => {
        feedList.push({ id: doc.id, ...doc.data() });
      });
      if (feedList.length === 0) {
        // Seed Firestore if empty
        for (const post of initialFeed) {
          const { id, ...rest } = post;
          await setDoc(doc(db, "feed", id), rest);
          feedList.push(post);
        }
      }
      return feedList;
    } catch (e) {
      console.error("Error fetching feed from Firebase, using LocalStorage fallback", e);
    }
  }
  return JSON.parse(localStorage.getItem(FEED_KEY));
}

export async function addFeedPost(post) {
  if (isFirebaseActive) {
    try {
      const { id, ...rest } = post;
      await setDoc(doc(db, "feed", id), rest);
      return;
    } catch (e) {
      console.error("Error adding feed post to Firebase, using LocalStorage fallback", e);
    }
  }
  const feed = JSON.parse(localStorage.getItem(FEED_KEY)) || [];
  feed.unshift(post); // Add new post at the top
  localStorage.setItem(FEED_KEY, JSON.stringify(feed));
}

export async function updateFeedPost(post) {
  if (isFirebaseActive) {
    try {
      const { id, ...rest } = post;
      await setDoc(doc(db, "feed", id), rest, { merge: true });
      return;
    } catch (e) {
      console.error("Error updating feed post in Firebase, using LocalStorage fallback", e);
    }
  }
  const feed = JSON.parse(localStorage.getItem(FEED_KEY)) || [];
  const updatedFeed = feed.map(p => p.id === post.id ? post : p);
  localStorage.setItem(FEED_KEY, JSON.stringify(updatedFeed));
}

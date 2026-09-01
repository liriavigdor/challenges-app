import { db, isFirebaseActive } from "./firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { initialUsers, initialChallenges, initialFeed } from "./mockData";

// LocalStorage Helper Keys
const USERS_KEY = "challenges_users";
const CHALLENGES_KEY = "challenges_items";
const FEED_KEY = "challenges_feed";

// Initialize LocalStorage if empty or if initial data has been expanded
function initLocalStorage() {
  const storedUsers = localStorage.getItem(USERS_KEY);
  // Force update if user badges count changed
  const parsedStored = storedUsers ? JSON.parse(storedUsers) : [];
  const storedUser1Badges = parsedStored.find(u => u.id === 'user_1')?.badges || [];
  if (!storedUsers || parsedStored.length < initialUsers.length || storedUser1Badges.length < 16) {
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
  
  const storedChallenges = localStorage.getItem(CHALLENGES_KEY);
  if (!storedChallenges || JSON.parse(storedChallenges).length < initialChallenges.length) {
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(initialChallenges));
  }
  
  const storedFeed = localStorage.getItem(FEED_KEY);
  if (!storedFeed || JSON.parse(storedFeed).length < initialFeed.length) {
    localStorage.setItem(FEED_KEY, JSON.stringify(initialFeed));
  }
}

initLocalStorage();

export async function getUsers() {
  if (isFirebaseActive) {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      // Seed Firestore with any missing users or update user_1 badges if they are outdated
      for (const user of initialUsers) {
        const existing = usersList.find(u => u.id === user.id);
        if (!existing) {
          const { id, ...rest } = user;
          await Promise.race([setDoc(doc(db, "users", id), rest), new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 3000))]);
          usersList.push(user);
        } else if (user.id === 'user_1' && (!existing.badges || existing.badges.length < 16)) {
          // Force update user_1's badges in Firebase to match new full badge list
          const { id, ...rest } = user;
          await Promise.race([setDoc(doc(db, "users", id), rest, { merge: true }), new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 3000))]);
          existing.badges = user.badges;
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
      await Promise.race([setDoc(doc(db, "users", id), rest, { merge: true }), new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 3000))]);
      return;
    } catch (e) {
      console.error("Error updating user in Firebase, using LocalStorage fallback", e);
    }
  }
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const updatedUsers = users.map(u => u.id === user.id ? user : u);
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
}

export async function getChallenges() {
  if (isFirebaseActive) {
    try {
      const querySnapshot = await getDocs(collection(db, "challenges"));
      const challengesList = [];
      querySnapshot.forEach((doc) => {
        challengesList.push({ id: doc.id, ...doc.data() });
      });
      // Seed Firestore with any missing challenges
      for (const challenge of initialChallenges) {
        if (!challengesList.some(c => c.id === challenge.id)) {
          const { id, ...rest } = challenge;
          await Promise.race([setDoc(doc(db, "challenges", id), rest), new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 3000))]);
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
      await Promise.race([setDoc(doc(db, "challenges", id), rest), new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 3000))]);
      return;
    } catch (e) {
      console.error("Error saving challenge to Firebase, using LocalStorage fallback", e);
    }
  }
  const challenges = JSON.parse(localStorage.getItem(CHALLENGES_KEY)) || [];
  challenges.push(challenge);
  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
}

export async function getFeed() {
  if (isFirebaseActive) {
    try {
      const querySnapshot = await getDocs(collection(db, "feed"));
      const feedList = [];
      querySnapshot.forEach((doc) => {
        feedList.push({ id: doc.id, ...doc.data() });
      });
      // Seed Firestore with any missing feed items
      for (const post of initialFeed) {
        if (!feedList.some(p => p.id === post.id)) {
          const { id, ...rest } = post;
          await Promise.race([setDoc(doc(db, "feed", id), rest), new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 3000))]);
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
      await Promise.race([setDoc(doc(db, "feed", id), rest), new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 3000))]);
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
      await Promise.race([setDoc(doc(db, "feed", id), rest, { merge: true }), new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 3000))]);
      return;
    } catch (e) {
      console.error("Error updating feed post in Firebase, using LocalStorage fallback", e);
    }
  }
  const feed = JSON.parse(localStorage.getItem(FEED_KEY)) || [];
  const updatedFeed = feed.map(p => p.id === post.id ? post : p);
  localStorage.setItem(FEED_KEY, JSON.stringify(updatedFeed));
}

export async function deleteFeedPost(postId) {
  if (isFirebaseActive) {
    try {
      await Promise.race([deleteDoc(doc(db, "feed", postId)), new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 3000))]);
      return;
    } catch (e) {
      console.error("Error deleting feed post in Firebase, using LocalStorage fallback", e);
    }
  }
  const feed = JSON.parse(localStorage.getItem(FEED_KEY)) || [];
  const updatedFeed = feed.filter(p => p.id !== postId);
  localStorage.setItem(FEED_KEY, JSON.stringify(updatedFeed));
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmPb0tlwlXM3tQFNVjQKwcqTbyyQrveco",
  authDomain: "infinite-math-5.firebaseapp.com",
  projectId: "infinite-math-5",
  storageBucket: "infinite-math-5.firebasestorage.app",
  messagingSenderId: "766660533268",
  appId: "1:766660533268:web:fc708491246d4271ab1b01",
  measurementId: "G-QZH4L7JRVS",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  app,
  auth,
  db,
  onAuthStateChanged,
  signOut,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  writeBatch,
};

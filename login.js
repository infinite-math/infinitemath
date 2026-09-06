import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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

const provider = new GoogleAuthProvider();

const googleButton = document.getElementById("googleSignIn");
const errorMessage = document.getElementById("errorMessage");

googleButton.addEventListener("click", async () => {
  errorMessage.textContent = "";

  googleButton.disabled = true;
  googleButton.textContent = "Signing in...";

  try {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    console.log("LOGIN SUCCESS");
    console.log("User:", user);
    console.log("Name:", user.displayName);
    console.log("Email:", user.email);
    console.log("UID:", user.uid);

    window.location.href = "home.html";
  } catch (error) {
    console.error("========== FIREBASE AUTH ERROR ==========");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Full error:", error);
    console.error("=========================================");

    errorMessage.textContent = `${error.code}: ${error.message}`;

    googleButton.disabled = false;
    googleButton.textContent = "Continue with Google";
  }
});

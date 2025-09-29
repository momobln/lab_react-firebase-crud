import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvOv-yVsaQx-kWOIYRV0gox0T7H1OAxNg",
  authDomain: "movie-watchlist-9287a.firebaseapp.com",
  databaseURL: "https://movie-watchlist-9287a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "movie-watchlist-9287a",
  storageBucket: "movie-watchlist-9287a.firebasestorage.app",
  messagingSenderId: "23012186765",
  appId: "1:23012186765:web:ef1f51c984f270843a20c4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const loginWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

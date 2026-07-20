import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyA6ej-ESIn3yGqRB35yKtH2-VlXGeBl1Eo",
  authDomain: "kleen-86c6d.firebaseapp.com",
  projectId: "kleen-86c6d",
  storageBucket: "kleen-86c6d.firebasestorage.app",
  messagingSenderId: "710534891702",
  appId: "1:710534891702:web:0f553782e590d2ae94fe17",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const functions = getFunctions(firebaseApp, "asia-southeast1");

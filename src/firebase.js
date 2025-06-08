// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx7degWRAyjKoey5vrsKXDeMD4EXegWcc",
  authDomain: "mundonerd-app.firebaseapp.com",
  projectId: "mundonerd-app",
  storageBucket: "mundonerd-app.appspot.com",
  messagingSenderId: "507296290570",
  appId: "1:507296290570:web:6ad22a11d99055cb124cf3"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Firestore
export const db = getFirestore(app);

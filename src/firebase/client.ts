import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC3VhPrRkzQkk_qo_yZVzBspwUdUjGBefE",
  authDomain: "line-properties.firebaseapp.com",
  projectId: "line-properties",
  storageBucket: "line-properties.appspot.com",
  messagingSenderId: "1060815628098",
  appId: "1:1060815628098:web:86ea69fafe16d62e42cadb",
};

export const app = initializeApp(firebaseConfig);
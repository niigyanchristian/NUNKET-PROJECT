import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";


// Initialize Firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export {storage};

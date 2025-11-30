// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDtLV_di4V_0T9uzjed7X56AiaJeDrQuL8',
  authDomain: 'air-plane-api.firebaseapp.com',
  projectId: 'air-plane-api',
  storageBucket: 'air-plane-api.firebasestorage.app',
  messagingSenderId: '267531388237',
  appId: '1:267531388237:web:06dcb55a4df493e8d42304',
  measurementId: 'G-MQX324Y7L6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

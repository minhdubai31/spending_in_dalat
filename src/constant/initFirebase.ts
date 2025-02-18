// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCW0hw3m5wLxnTMjT2xyuIpVK5EGGLkQQc',
  authDomain: 'spendingindalat-b69bf.firebaseapp.com',
  databaseURL: 'https://spendingindalat-b69bf-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'spendingindalat-b69bf',
  storageBucket: 'spendingindalat-b69bf.firebasestorage.app',
  messagingSenderId: '470331161548',
  appId: '1:470331161548:web:3c3fbdc50d0bacfd98fb69',
  measurementId: 'G-YBTFNK83R3',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export { db }

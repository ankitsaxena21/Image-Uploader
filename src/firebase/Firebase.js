import firebase from 'firebase/app'
import 'firebase/storage'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA06JJrD7aq3Xj2kBEBbV9yt5aMaoiXIA0",
    authDomain: "image-uploader-aab31.firebaseapp.com",
    databaseURL: "https://image-uploader-aab31.firebaseio.com",
    projectId: "image-uploader-aab31",
    storageBucket: "image-uploader-aab31.appspot.com",
    messagingSenderId: "83662300078",
    appId: "1:83662300078:web:ec4a8111bbdde86d8f5e3f",
    measurementId: "G-CC8C9TS6M5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage()
export {
    storage, firebase as default
}

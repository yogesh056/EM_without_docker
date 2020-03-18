import firebase from 'firebase/app'
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyAfY2NnIcGdbUQj73FOKbaMVAR1dRMSeF4",
    authDomain: "event-management-1581765238758.firebaseapp.com",
    databaseURL: "https://event-management-1581765238758.firebaseio.com",
    projectId: "event-management-1581765238758",
    storageBucket: "event-management-1581765238758.appspot.com",
    messagingSenderId: "335076764870",
    appId: "1:335076764870:web:4d4ac9b6b8ccfde30dbbc7",
    measurementId: "G-YH4E6QQQ83"
  };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 const storage=firebase.storage();
 export {
     storage,firebase as default
 }
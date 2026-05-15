import firebase from "firebase/compat/app"
import "firebase/compat/firestore";
import "firebase/compat/auth";


const app = firebase.initializeApp({
    apiKey: "AIzaSyCd2l6sMc3Z2mnRsCbXcPZ2AfrkFYolhrs",
    authDomain: "post-89756.firebaseapp.com",
    databaseURL: "https://post-89756-default-rtdb.firebaseio.com",
    projectId: "post-89756",
    storageBucket: "post-89756.appspot.com",
    messagingSenderId: "550108395843",
    appId: "1:550108395843:web:994e1ac496269eedbd57f6",
    measurementId: "G-JWYWYRVDDZ"
});

const firestore = firebase.firestore();
const auth = firebase.auth();
export const db = firebase.firestore(app);

export { firestore, auth };
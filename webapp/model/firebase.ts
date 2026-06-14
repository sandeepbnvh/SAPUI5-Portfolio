import JSONModel from "sap/ui/model/json/JSONModel";

declare const firebase: any;

declare const process: {
    env: {
        [key: string]: string;
    };
};

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

export function initializeFirebase(): JSONModel {
    // Initialize Firebase with the Firebase-config
    firebase.initializeApp(firebaseConfig);
    
    // Create a Firestore reference
    const firestore = firebase.firestore();
    
    // Firebase services object
    const oFirebase = {
        firestore: firestore
    };
    
    // Create a Firebase model out of the oFirebase service object
    const fbModel = new JSONModel(oFirebase);
    
    // Return the Firebase Model
    return fbModel;
}

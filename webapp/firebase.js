sap.ui.define([
	"sap/ui/model/json/JSONModel",
   
], function (JSONModel) {
	"use strict";
	
	// Firebase-config retrieved from the Firebase-console
	const firebaseConfig = {
        apiKey: "AIzaSyChnPo9nTSEFrQVP4ghoBTrMky5yfvot4s",
        authDomain: "portfolio-7b056.firebaseapp.com",
        databaseURL: "https://portfolio-7b056-default-rtdb.firebaseio.com",
        projectId: "portfolio-7b056",
        storageBucket: "portfolio-7b056.appspot.com",
        messagingSenderId: "28130104990",
        appId: "1:28130104990:web:886caa46e6d492c2ea8d8f",
        measurementId: "G-59WKP2F05T"
	};

	return {
		initializeFirebase: function () {
			// Initialize Firebase with the Firebase-config
			firebase.initializeApp(firebaseConfig);
			
			// Create a Firestore reference
			const firestore = firebase.firestore();
			
			// Firebase services object
			const oFirebase = {
				firestore: firestore
			};
			
			// Create a Firebase model out of the oFirebase service object which contains all required Firebase services
			var fbModel = new JSONModel(oFirebase);
			
			// Return the Firebase Model
			return fbModel;
		}
	};
});
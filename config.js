const { initializeApp } = require('firebase-admin/app');

const firebaseConfig = {
    apiKey: "AIzaSyDFyHKrkVZ0WEW7wx-zyaLBqA_vdJGNO1U",
    authDomain: "telemedisin-aadf1.firebaseapp.com",
    databaseURL: "https://telemedisin-aadf1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "telemedisin-aadf1",
    storageBucket: "telemedisin-aadf1.appspot.com",
    messagingSenderId: "447766178807",
    appId: "1:447766178807:web:d241ee57a59d7370929cf2",
    measurementId: "G-Y9108W5WKV"
};

// Initialize Firebase
const fire = initializeApp(firebaseConfig);
module.exports = fire;
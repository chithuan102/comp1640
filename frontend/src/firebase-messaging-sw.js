importScripts('https://www.gstatic.com/firebasejs/7.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.5.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyCvzL1n7Y4C88I-EnauSOh6R2F9uGm9eYM",
    authDomain: "mctproject-bcdad.firebaseapp.com",
    databaseURL: "https://mctproject-bcdad.firebaseio.com",
    projectId: "mctproject-bcdad",
    storageBucket: "mctproject-bcdad.appspot.com",
    messagingSenderId: "915607070785",
    appId: "1:915607070785:web:761943f9a3edabddfafec0"
});
const messaging = firebase.messaging();
if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('../firebase-messaging-sw.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  }).catch(function(err) {
    console.log('Service worker registration failed, error:', err);
  });
}
/**
 * Created by sukumar on 12/15/2016.
 */

angular.module('store', [])
    .factory('firebaseStore', ['$q', '$rootScope', '$timeout',
        function ($q, $rootScope, $timeout) {
            var config = {
                apiKey: "AIzaSyB1HknDOAZG9yoBG0ZYq0-QmpqVAfEY5CA",
                authDomain: "contactmanager-6deb1.firebaseapp.com",
                databaseURL: "https://contactmanager-6deb1.firebaseio.com",
                storageBucket: "contactmanager-6deb1.appspot.com",
                messagingSenderId: "135599941997"
            };
            firebase.initializeApp(config);
            const auth = firebase.auth();
            const dbRef = firebase.database().ref().child('contacts');
            var userContactRef = null;
            var store = {};
            store._login = function (email, pass) {
                return auth.signInWithEmailAndPassword(email, pass);
            };
            store._signUp = function (email, pass) {
                return auth.createUserWithEmailAndPassword(email, pass);
            };
            store._logOut = function () {
                return auth.signOut();
            };
            store._addUserAsContactKey = function () {
                var obj = {};
                if (auth.currentUser) {
                    obj[auth.currentUser.uid] = {}
                    console.log(obj)
                    return dbRef.set(obj);
                }
            },
                store._getUser = function () {
                    return auth.currentUser.email;
                };
            store._addData = function (data) {
                var userDbRef = dbRef.child(auth.currentUser.uid);
                var newRef = userDbRef.push();
                return newRef.set(data);
            };
            store._editContact = function (key, contact) {
                return userContactRef.child(key).update(contact);
            };
            store._deleteContact = function (key, contact) {
                return userContactRef.child(key).remove();
            };
            store._deleteAllContacts = function () {
                return userContactRef.remove()
            }
            var userContacts = {};
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    console.log("auth");
                    userContactRef = dbRef.child(auth.currentUser.uid);
                    userContactRef.on('value', function (snap) {
                        $timeout(function () {
                            console.log("snap :" + snap)
                            console.log("snap :" + snap.val())
                            userContacts.contact = snap.val();
                            $rootScope.$broadcast('newUserContacts', userContacts);
                        }, 0);
                    });
                }
            });

            return store;
        }]);

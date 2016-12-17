'use strict';

angular.module('myApp.view2', ['ngRoute', 'store'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
        $routeProvider.when('/view2:id=', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', ['$rootScope', '$scope', 'firebaseStore', '$location',
        function ($rootScope, $scope, firebaseStore, $location) {
            $scope.user = firebaseStore._getUser();
            $scope.userContacts = null;
            $scope.contactEditInProgress = false;
            $scope.$on('newUserContacts', function (event, data) {
                console.log(data)
                $scope.$apply($scope.userContacts = data.contact)
            });
            $scope.logout = function () {
                var logOut = firebaseStore._logOut();
                logOut.then(function () {
                    $location.path('/view1');
                    $rootScope = $rootScope.$new(true);
                    $scope = $scope.$new(true);
                }).catch(function (e) {
                    alert("error while logging out")
                });
            }
            $scope.addContact = function (contact) {
                var addContact = firebaseStore._addData(contact);
                addContact.then(function () {
                    console.log("contact added")
                }).catch(function (e) {
                    console.log(e);
                })
            }
            $scope.deleteContact = function (key, contact) {
                firebaseStore._deleteContact(key, contact).then(function () {

                }).catch(function (e) {

                });
            }
            $scope.saveEditContact = function (contact) {

                firebaseStore._editContact($scope.editedKey, contact).then(function () {
                    $scope.contactEditInProgress = false;
                }).catch(function (e) {

                });
            }
            $scope.deleteAll = function () {
                firebaseStore._deleteAllContacts().then(function () {

                }).catch(function (e) {

                });
            };
            $scope.enableEditContact = function (key, contact) {
                $scope.contactEditInProgress = true;
                $scope.editContact = angular.copy(contact, {});
                $scope.editedKey = key;
            };
            $scope.showAddContact = function () {
                $scope.contactEditInProgress = false;
                $scope.editContact = {};
                $scope.editedKey = null;
            }
        }]);
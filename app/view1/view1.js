'use strict';

angular.module('myApp.view1', ['ngRoute', 'store'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', 'firebaseStore', '$location', '$rootScope',
        function ($scope, firebaseStore, $location, $rootScope) {
            $scope.loginError = false;
            $scope.signUpError = false;
            $scope.formError = [];
            $scope.loginUser = function (user) {
                var login = firebaseStore._login(user.email, user.password);
                login.then(function () {
                    $rootScope.user = firebaseStore._user;
                    $location.path('/view2');
                    $scope.apply();
                }).catch(function (e) {
                    $scope.formError.push(e);
                    $scope.loginError = true;
                    $rootScope.$apply();
                })
            };
            $scope.signUp = function (user) {
                var signUp = firebaseStore._signUp(user.email, user.password);
                signUp.then(function () {
                    $rootScope.user = firebaseStore._user;
                    $location.path('/view2');
                    $scope.$apply();
                }).catch(function (e) {
                    console.log(e);
                    $scope.formError.push(e);
                    $scope.signUpError = true;
                    $rootScope.$apply();
                })
            }
        }]);
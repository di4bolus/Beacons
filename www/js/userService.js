angular.module('starter')
    .factory('userService', function () {
        var setUser = function (user) {
            localStorage.setItem('user', user);
        };

        var getUser = function () {
            return localStorage.getItem('user');
        };
             
        return {
            setUser: setUser,
            getUser: getUser
        };
    });
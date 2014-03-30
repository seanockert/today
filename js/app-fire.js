'use strict';

/**
 */
var today = angular.module('today', ['ngResource', 'ngRoute', 'firebase']);

today.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'TodayCtrl'
        })        
        
        .when('/day/:day',
        {
            controller: 'TodayCtrl'
        })

        .otherwise({ redirectTo: '/'});
})


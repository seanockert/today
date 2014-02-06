'use strict';

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
var today = angular.module('today', ['ngResource']);

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


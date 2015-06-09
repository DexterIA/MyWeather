angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleLightContent();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: "templates/tabs.html"
            })
            .state('tab.city', {
                url: '/city',
                views: {
                    'tab-city': {
                        templateUrl: 'templates/tab-city.html',
                        controller: 'CityCtrl'
                    }
                }
            })
            .state('tab.city-detail', {
                url: '/city/:id',
                views: {
                    'tab-city': {
                        templateUrl: 'templates/city-detail.html',
                        controller: 'CityDetailCtrl'
                    }
                }
            })
            .state('tab.city_30',{
                 url: '/city_30',
                views:{
                    'tab-city_30':{
                        templateUrl: 'templates/tab-city_30.html',
                        controller: 'City_30Ctrl'
                    }
                }
            })
            .state('tab.city_30-detail', {
                url: '/city_30/:id',
                views: {
                    'tab-city_30': {
                        templateUrl: 'templates/city_30-detail.html',
                        controller: 'City_30DetailCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('/tab/city');
    });

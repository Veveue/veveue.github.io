var scotchApp = angular.module('scotchApp', ['ngRoute']);

// configure our routes
scotchApp.config(function($routeProvider) {
	$routeProvider
 
	.when('/', {
		templateUrl: 'pages/home.html',
		controller: 'mainController'
	})
	.when('/home', {
		templateUrl: 'pages/home.html',
		controller: 'mainController'
	}) 
	.when('/movie', {
		templateUrl: 'pages/movie.html',
		controller: 'mainController'
	})
 
	.when('/game', {
		templateUrl: 'pages/game.html',
		controller: 'mainController'
	})
	 
	.when('/music', {
		templateUrl: 'pages/music.html',
		controller: 'mainController'
	})
	
	.when('/culture', {
		templateUrl: 'pages/culture.html',
		controller: 'mainController'
	})
	
	.when('/article', {
		templateUrl: 'pages/article.html',
		controller: 'mainController'
	})
	
	.when('/movieinfo', {
		templateUrl: 'pages/movieinfo.html',
		controller: 'mainController'
	});
});
 
scotchApp.controller('mainController', function($scope) { 
	$scope.message = ' ';
});

 
 
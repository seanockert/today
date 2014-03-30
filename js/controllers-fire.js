/*global today, angular */
'use strict';


today.controller('TodayCtrl', function TodayCtrl($scope, $route, $location, $routeParams, $timeout, $firebase, $filter) {
	
	var fbURL = 'https://balsamade.firebaseio.com/today';	

	$scope.todos = [];

	$scope.editedTodo = null;

  	var db = new Firebase(fbURL);
    $scope.todos = $firebase(db);
    $scope.len = $scope.todos.length;
 

	$scope.oneday = 1000*60*60*24; // One day in milliseconds

	var now = new Date();
	$scope.today = Math.round(new Date(now.getFullYear(), now.getMonth(), now.getDate())/$scope.oneday);

	$scope.selectedDay = $scope.today;
	$scope.dayFilter = { day: $scope.selectedDay };

	// Init days starting from yesterday
	$scope.days = [
	    {day: $scope.today - 1},	
	    {day: $scope.today},
	    {day: $scope.today + 1},
	    {day: $scope.today + 2},
	    {day: $scope.today + 3},
	    {day: $scope.today + 4},
	    {day: $scope.today + 5},
	    {day: $scope.today + 6},
	    {day: $scope.today + 7},
	];
	
	$scope.$watch('todos', function () {
		var total = 0;
		$scope.todos.$getIndex().forEach(function (index) {
			var todo = $scope.todos[index];
			// Skip invalid entries so they don't break the entire app.
			if (!todo || !todo.title) {
				return;
			}
			total++;
			
		
		});
		$scope.totalCount = total;
		$scope.count();
		//console.log($scope.days);
	}, true);   
			
    // Change day
	$scope.$on('$routeChangeSuccess', function (ev, current, prev) {
		var day = $routeParams['day']
	   	if (day && day.length > 4) {
			if (day.length > 5) {
				// Full date passed
				day = Math.round(new Date(day).getTime() / $scope.oneday);
			}	
			
			$scope.selectedDay = day;
			$scope.dayFilter = { day: $scope.selectedDay };
			
		}	
	});	


	$scope.create = function () {	
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}

		$scope.todos.$add({
			title: newTodo,
			day: $scope.selectedDay,
			completed: false
		});	
		$scope.newTodo = '';
	};

	$scope.delete = function (todo) {
		$scope.todos.$remove(todo.$id);
	};	
	
	$scope.prevday = function (todo) {
		todo.day = todo.day - 1;
		$scope.todos.$save();
	};	
	
	$scope.nextday = function (todo) {
		todo.day = todo.day + 1;
		$scope.todos.$save(); 
	};
	
	$scope.update = function(todo) {
		todo.completed = (todo.completed == true ? false : true);
		$scope.todos.$save(); 
	}	

	// Edit an existing item
	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		$scope.originalTodo = angular.extend({}, todo);
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		todo.title = todo.title.trim();

		if (!todo.title) {
			$scope.removeTodo(todo);
		} else {
			$scope.todos.$save();
		}
	};

	$scope.revertEditing = function (todo) {
		$scope.todos[$scope.todos.indexOf(todo)] = $scope.originalTodo;
		$scope.doneEditing($scope.originalTodo);
	};	
	
	$scope.startEditing = function (todo) {
		todo = $scope.editedTodo;
	};
	
	$scope.count = function () { 
		// Recount number of tasks per day - do this more efficiently
		angular.forEach($scope.days, function(day) {
			day.tasks = 0;
	    	angular.forEach($scope.todos, function(todo) {
		    	if (todo.day == day.day && todo.completed == false) {
		      		++day.tasks;	    		
		    	}
		    });	
	    });	 
	}
});



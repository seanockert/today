/*global today, angular */
'use strict';


today.controller('TodayCtrl', function TodayCtrl($scope, $route, $location, $routeParams, todoCRUD, $timeout, Data) {
		
	var pollTime = 3000;
	var isPolling = true;
	
	$scope.todos = [];

	$scope.editedTodo = null;

	function tick() {
        Data.query(function(todos){
        	$scope.todos = todos;
        	todoCRUD.count($scope);	
            $timeout(tick, 5000);
        });
    };
    tick();

	// Polling
	/*function tick() {
		todoCRUD.read().then(function(promise) {
			if ($scope.editedTodo == null && isPolling) {
				//console.log('Scope:');
				//console.log(JSON.stringify($scope.todos));
				console.log('Data:');
				console.log(JSON.stringify(promise.data));
				
				if (JSON.stringify($scope.todos) == JSON.stringify(promise.data)) {
					console.log('data not updated');
				} else {
					$scope.todos = promise.data;	
					
					//console.log('Data updated');
					//console.log(JSON.stringify(promise.data));
				}
				
				todoCRUD.count($scope);	
			} else {
				//console.log('Pause');
				$timeout(function() { isPolling = true;console.log('Unpause'); }, 10000);	
			}
			$timeout(tick, pollTime);
		});	      
    };
    
    tick();*/

	document.addEventListener('focus',function(e){
	    tick();
	    console.log('Focused');
	}, true);

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
	

    // Change day
	$scope.$on('$routeChangeSuccess', function (ev, current, prev) {
		var day = $routeParams['day']
	   	if (day && day.length > 4) {
			if (day.length > 5) {
				// Full date passed
				day = Math.round(new Date(day).getTime() / $scope.oneday);
			}	
			
			$scope.selectedDay = day;
			$scope.dayFilter = { day: $scope.selectedDay};
			
		}	
	});	


	$scope.create = function () {	
		todoCRUD.create($scope);
		$scope.newTodo = '';
		isPolling = false;	

	};

	$scope.delete = function (todo) {
		isPolling = false;
		todoCRUD.delete($scope, todo);	
	};
	
	$scope.update = function() {
		todoCRUD.update($scope);
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
			todoCRUD.update($scope);
		}
	};

	$scope.revertEditing = function (todo) {
		$scope.todos[$scope.todos.indexOf(todo)] = $scope.originalTodo;
		$scope.doneEditing($scope.originalTodo);
	};


});

/*global today */
'use strict';

/**
 * Services that persists and retrieves TODOs from items.json via api.php script
 */
 
today.factory('Data', function ($resource) {
   return $resource('api.php?a=read', {}, {
    get: { method: 'GET', params: {}, isArray: true }
	});
});   
 
today.factory('todoCRUD', function ($http, $timeout) {

	return {
		create: function ($scope) {
			var newTodo = $scope.newTodo.trim();
			if (!newTodo.length) {
				return;
			}

			$scope.todos.push({
				title: newTodo,
				day: $scope.selectedDay,
				completed: false
			});	
			
			this.update($scope);	
		}, 
			
		read: function () {
			var promise = $http({method:'GET', url:'api.php?a=read'})
				.success(function (data, status, headers, config) {
					return data;
				})
				.error(function (data, status, headers, config) {
					console.log('error');
					return {'status': false};
				});
			
			return promise;
			
			//return $http({method:'GET', url: 'items.json'});
			//return angular.fromJson(localStorage.getItem(id) || '[]');
		},

		update: function ($scope) {
				
			$http({method:'POST', url: 'api.php?a=update', data : $scope.todos}).success(function(status) {
				console.log(status);
			});
			this.count($scope);	
	
			//localStorage.setItem(id, angular.toJson(todos));
		},
		
		delete: function ($scope, index) { 
			console.log($scope.todos.indexOf(index));
			$scope.todos.splice($scope.todos.indexOf(index), 1);
				
			this.update($scope);
		}, 
		
		count: function ($scope) { 
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
	};
});

'use strict';

/* Services */

var KeyChainService = angular.module('KeyChainService', ['ngResource']).config(function ($httpProvider) {
    $httpProvider.defaults.transformRequest = function(data)
    {
        
    };
});;

KeyChainService.factory('KeyChainService', ['$resource',
  function($resource){
    return $resource('logic/:command/:action', {}, {
      passwords: {method:'GET', params: { command: 'password', action: 'index.php' }, isArray: true},
      delete_password: {method:'POST', params: { command: 'password', action: 'delete.php' }, isArray: false},
      add_password: {method:'POST', params: { command: 'password', action: 'add.php' }, isArray: false},
      update_password: {method:'POST', params: { command: 'password', action: 'update.php' }, isArray: false}
    });
  }]);
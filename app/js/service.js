'use strict';

/* Services */
var KeyChainService = angular.module('KeyChainService', ['ngResource']).config(function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    var old_transformResponse = $httpProvider.defaults.transformResponse;
    $httpProvider.defaults.transformResponse = function(data, parser, statusCode) {
        var retVal = old_transformResponse[0].apply(this, arguments);
        if (statusCode == 401) { 
          swal({title: "Hoşgeldiniz", text: "Keychain Service", confirmButtonColor: "#DD6B55", confirmButtonText: "Giriş", closeOnConfirm: false}, function(){ window.location = "login.php"; });
          return undefined;
        }
        if (statusCode != 200) {
          sweetAlert(retVal.code.toString(), retVal.message, "error");
          return undefined;
        }
        return retVal;
    };
});

KeyChainService.factory('KeyChainService', ['$resource',
  function($resource){
    return $resource('logic/:command/:action', {}, {
      passwords: {method:'GET', params: { command: 'password', action: 'index.php' }, isArray: true},
      delete_password: {method:'POST', params: { command: 'password', action: 'delete.php' }, isArray: false},
      add_password: {method:'POST', params: { command: 'password', action: 'add.php' }, isArray: false},
      update_password: {method:'POST', params: { command: 'password', action: 'update.php' }, isArray: false}
    });
  }]);
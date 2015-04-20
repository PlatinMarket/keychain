'use strict';

/* Applications Controller */

KeyChain.controller('LoginController', function ($scope, $timeout, $sce, KeyChainService) {

  $scope.username = "";
  $scope.password = "";
  $scope.validating = false;

  $scope.params = function(){
    return {
      "username": $scope.username,
      "password": $scope.password
    }
  }

  var timeOutHandler;
  $scope.login = function(){
    $scope.validating = true;
    $("#btn-login").button("loading");
    KeyChainService.login($scope.params(), function(data){
      $scope.validating = false;
      $("#btn-login").button("reset");
      if (data.result === true) { 
        swal({
          title: "Giriş başarılı",
          showConfirmButton: false,
          closeOnConfirm: false,
          type:"success"
        });
        setTimeout(function(){ window.location = "index.html";  }, 2000);
        return undefined;
      }
      $scope.message = data.message;
      $timeout.cancel(timeOutHandler);
      timeOutHandler = $timeout(function(){ $scope.message = null; }, 3000); 
    });
  };

  $scope.validate = function(){
    return $scope.username.trim() != "" && $scope.password.trim() != ""
  };

});


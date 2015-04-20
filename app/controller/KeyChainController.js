'use strict';

/* Applications Controller */

KeyChain.controller('KeyChainController', function ($scope, $timeout, $sce, KeyChainService) {

  $scope.passwords = KeyChainService.passwords();
  $scope.name = "";
  $scope.value = "";

  $scope.current_password = null;
  $scope.edit = function(password){
    $scope.edit_form_clear(password, password.name, password.value);
    password.isEditing = true;
  };

  $scope.update = function(password){
    password.updating = true;
    if (!ValidatePassword(password, false)) return swal("Hata", "Geçersiz Şifre Kaydı");
    KeyChainService.update_password(password, function(data){
      password.updating = false;
      if (data.result == false) { return swal("Hata", "Hata Kaydedilemedi!");  }
      password.isEditing = false;
      password.value = data.value;
      password.name = data.name;
      password.slug = data.slug;
    });
  };

  $scope.add = function() {
    $scope.updating = true;
    var password = {name: $scope.name, value: $scope.value};
    if (!ValidatePassword(password, true)) return swal("Hata", "Geçersiz Şifre Kaydı");
    $scope.search = "";
    KeyChainService.add_password(password, function(data){
      $scope.updating = false;
      if (data.result == false) { return swal("Hata", "Kaydedilemedi!");  }
      $scope.passwords.push(data);
      $scope.name = "";
      $scope.value = "";
    });
  };

  $scope.edit_form_clear = function(password, name, value){
    password.name_edited = name ? name : "";
    password.value_edited = value ? value : "";
  };

  $scope.cancel = function(password) {
    $scope.edit_form_clear(password, password.name, password.value);
    password.isEditing = false;
  };

  $scope.delete = function(password) {
    if (!confirm("Sure ?")) {return;}
    password.updating = true;
    var index = $scope.passwords.indexOf(password);
    KeyChainService.delete_password(password, function(data){
      if (data.result == true) { $scope.passwords.splice(index, 1); }
      password.updating = false;
    });
  };

  $scope.copied = function(password){
    password.copied = true;
    $timeout(function(){ password.copied = false; }, 1000);   
  }

  $scope.highlight = function(text, search) {
    if (!search) return $sce.trustAsHtml(text);
    return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlighted">$&</span>'));
  };

  $scope.logout = function(){
    KeyChainService.logout(function(data){
      if (data.result === true) { window.location = "login.html"; }
    });
  };

  $scope.generatePassword = function($event){
    var symbols = false;
    if ($event.altKey) symbols = true;
    $scope.value = generatePassword(20, symbols);

  };

  function generatePassword(length, symbols) {
    var length = (length ? length : 8),
        symbols = symbols ? symbols : false,
        charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "",
        symbolStr = "@!_";

    if (symbols == true) charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + symbolStr
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    if (symbols == true) {
      var tobeAdd = symbolStr.charAt(Math.floor(Math.random() * (symbolStr.length - 1)));
      console.log("eklenecek " + tobeAdd);
      retVal = retVal.split('');
      var targetIndex = Math.floor(Math.random() * retVal.length) % (retVal.length - 1)
      retVal[targetIndex] = tobeAdd;
      retVal = retVal.join('');
    }
    return retVal;
  }

  function ValidatePassword(password, newFlag){
    if (!newFlag) newFlag = false;
    return password.name.trim() != "" && password.value.trim() != "" && (newFlag == false || _.pluck($scope.passwords, "name").indexOf(password.name) == -1)
  }

});


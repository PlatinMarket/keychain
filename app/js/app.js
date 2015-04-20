'use strict';

/* App Module */

var KeyChain = angular.module('KeyChain', [
  'KeyChainService',
  'ngClipboard'
]);

KeyChain.config(['ngClipProvider', function(ngClipProvider) {
  ngClipProvider.setPath("components/zeroclipboard/dist/ZeroClipboard.swf");
}]);

moment.locale('tr');

swal.setDefaults({
  confirmButtonText: 'Tamam',
  cancelButtonText: 'İptal'
});
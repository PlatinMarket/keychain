<?php 
  require_once "logic/vendor/autoload.php";
  PlatinBox\OpenId::SetOpenId("https://openid.platinbox.org");

  PlatinBox\OpenId::logout();

  header('Location: index.html');
?>
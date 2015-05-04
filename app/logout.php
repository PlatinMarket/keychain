<?php 
  require_once "logic/vendor/autoload.php";
  require "logic/password/config.php";
  PlatinBox\OpenId::SetOpenId(OPENID_SERVER);

  PlatinBox\OpenId::logout();

  header('Location: index.html');
?>
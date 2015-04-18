<?php
require "ldap.php";

function checkConfig($file = "config.php"){
  if (!file_exists($file)) {return false;}
  if (defined("LDAP_URILDAP_URI")) {return true;}
  require $file;
  if (defined("LDAP_URILDAP_URI")) {return true;}
  return $false;
}

function connect() {
  if (!checkConfig()) {
    throwError(new Exception("Config file missing!"));
    return false;
  }
  try {
    $ldap = new ldap\LDAP(LDAP_URILDAP_URI, LDAP_BASE_DN, LDAP_SEARCH_DN, LDAP_BASE_DOMAIN);
    return $ldap;
  } catch (Exception $err) {
    throwError($err);
    return false;
  }
}

function loginUser($username, $password) {
  if ($ldap = connect()) {
    try {
      
      if (!$ldap->authenticate($username, $password)) return false;
      $users = $ldap->get_users();
      
      return in_array($username, $users);
      


      return false;
    } catch (Exception $e) {
      throwError($e);
      return false;
    }
  }
  return false;
}

function checkSession(){
  return isset($_SESSION["user_name"]) && !is_null($_SESSION["user_name"]);
}

function createSession($user_name, $name, $group) {
  $_SESSION["user_name"] = $user_name;
  $_SESSION["name"] = $name;
  $_SESSION["group"] = $group;
  return true;
}

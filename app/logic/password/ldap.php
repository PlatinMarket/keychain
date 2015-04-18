<?php
//require_once "../vendor/autoload.php";

use Toyota\Component\Ldap\Core\Manager;
use Toyota\Component\Ldap\Platform\Native\Driver;

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
    $params = array(
      'hostname' => LDAP_URILDAP_URI,
      'base_dn' => LDAP_BASE_DN
    );
    return new Manager($params, new Driver());
  } catch (Exception $err) {
    throwError($err);
    return false;
  }
}

function loginUser($username, $password) {
  if ($manager = connect()) {
    try {
      $manager->connect();
      $manager->bind($username, $password);

      //$users = $manager->getNode(LDAP_SEARCH_DN);

      //$members = $users->get("member");
      //print_r(get_class_methods($members));
      //print_r($members->getValues());

      $results = $manager->search(0, LDAP_SEARCH_DN, "(cn=*)");
      print_r($results);
      print_r(get_class_methods($results));
      foreach ($results as $node) {
          echo $node->getDn();
          foreach ($node->getAttributes() as $attribute) {
              echo sprintf('%s => %s', $attribute->getName(), implode(',', $attribute->getValues()));
          }
      }

      return true;
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

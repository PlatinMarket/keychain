<?php
session_start();
$_SESSION["last_exception"] = null;

require "ldap_utils.php";

define('FILE', "password_file.dat");

if (!file_exists(FILE)) { file_put_contents(FILE, serialize(array())); }

function getPasswords(){
  return unserialize(file_get_contents(FILE));
}

function addPassword($slug, $name, $value){
  $passwords = getPasswords();
  if (isset($passwords[$slug])) { return false; }
  $passwords[$slug] = array('name' => $name, 'value' => $value, 'slug' => $slug);
  if (commitChanges($passwords)) { return true; }
  return false;
}

function updatePassword($slugOld, $slugNew, $name, $value){
  $passwords = getPasswords();
  if (!isset($passwords[$slugOld])) { return false; }
  unset($passwords[$slugOld]);
  $passwords[$slugNew] = array('name' => $name, 'value' => $value, 'slug' => $slugNew);
  if (commitChanges($passwords)) { return true; }
  return false;
}

function deletePassword($slug){
  $passwords = getPasswords();
  if (!isset($passwords[$slug])) { return false; }
  unset($passwords[$slug]);
  if (commitChanges($passwords)) { return true; }
  return false;
}

function throwError($err){
  if (!isset($_SESSION["last_exception"])) $_SESSION["last_exception"] = array();
  $_SESSION["last_exception"][] = $err;
}

function readError(){
  return $_SESSION["last_exception"];
}

function commitChanges($passwords){
  if (!file_exists(FILE)) { file_put_contents(FILE, serialize(array())); }
  try {
    file_put_contents(FILE, serialize($passwords));
    return true;
  } catch (Exception $err) {
    return false;
  }
}

setlocale(LC_ALL, 'en_US.UTF8');
function toAscii($str, $replace=array(), $delimiter='-') {
  if( !empty($replace) ) {
    $str = str_replace((array)$replace, ' ', $str);
  }

  $clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
  $clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
  $clean = strtolower(trim($clean, '-'));
  $clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);

  return $clean;
}

?>

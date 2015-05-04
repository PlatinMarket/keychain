<?php
  require_once "logic/vendor/autoload.php";
  require "logic/password/config.php";
  PlatinBox\OpenId::SetOpenId(OPENID_SERVER);
  PlatinBox\OpenId::setRequiredMember(OPENID_MEMBER_OF);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
</head>
<body>
  <?php
    if (PlatinBox\OpenId::login() === false || PlatinBox\OpenId::logged() === true) header('Location: index.html');
  ?>
</body>
</html>
<?php

/* $dbusername = "219307_sa98017";
$dbhost = "dashboard-219307.mysql.binero.se";
$dbpassword = "Leinad024311";
$db = "219307-dashboard"; */

$dbusername = "root";
$dbhost = "localhost";
$dbpassword = "";
$db = "dashboard";

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');


$connection = mysqli_connect($dbhost, $dbusername, $dbpassword, $db);
mysqli_query($connection, "SET NAMES utf8");
?>
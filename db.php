<?php
$host = "localhost";
$user = "root";          // change if needed
$pass = "";              // your MySQL password
$dbname = "regreeen";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
  die(json_encode(["error" => "DB connection failed: " . $conn->connect_error]));
}
?>

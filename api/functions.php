<?php

//escapes special characters in a string
function escape($string) {
    global $connection;
    return mysqli_real_escape_string($connection, $string);
}
//checks if the value is a number
function check_number($number) {
    if (is_numeric($number)){
        return $number;
    } else {
        return false;
    }
}

?>
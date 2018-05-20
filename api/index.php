<?php
session_name('token');
if(isset($_GET['token'])){
    session_id($_GET['token']);
}
session_start(['use_cookies' => 0, 'use_trans_sid' => 1]);
#
# Det här är indexfilen som hela API:et utgår från

# Här inkluderar vi två filer som innehåller två classer som behövs för vårt API
require_once "config.php";
require_once "functions.php";
require_once "api.class.php";
require_once "resource.class.php";

# Här skapas ett API-object av classen API
$API = new API();


# Vi skapar en sträng som består av ett _ samt namnet på den resurs vi efterfrågar, exempelvis som vi anropar /?/user kommer vår sträng blir _user. Detta gör vi för att skapa lite säkerhet så man inte kan anropa klasser/objekt som vi inte vill ska kunna köras via vårt API
$class = "_".$API->resource;

# Vi inkluderar filen med klassen för den resurs som efterfrågats, exempelvis user.resource.php och denna fil innehåller en class med _user

require_once $API->resource.".resource.php";

# Här händer "magin" och vi skapar ett objet av den klass som motsvarar den resurs som efterfrågats, exempelvis _user
# Till det objekt som skapas skickar vi med två saker till konstruktorn (funktionen som körs när objektet skapas)

# De två parametrar vi skickar med är resursens id (ex. 15 i /?/user/15) och sen resten av URL:en som en array (Ex. i /?/user/15/friends/all kommer arrayen innehålla [0] "friends" och [1] "all")

$resource = new $class($API->resource_id, $API->request);

# Här anropar vi en metod/funktion i det objekt som skapas med samma namn som den HTTP-metod som anropats, exempelvis GET() eller POST()
$method = $API->method;
$resource->$method($API->input, $connection);

# Här körs metoden/funktionen output() i det objekt vi skapat

$resource->output();
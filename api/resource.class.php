<?php
#
# Det här är den generella klassen Resource som våra olika resurser ärver från så att de får med alla de funktioner och variabler
# som denna klass har så vi inte behöver deklarera dem i varje resurs vi skapar
#

class Resource{
    
    
    #protected variables are visible for the current class and classes inheriting from it
        protected $id, $request;
    
    # En generell konstruktor som gör samma sak som vår konstruktor i _user klassen
    function __construct($resource_id, $request){
        
        if(is_numeric($resource_id))
        $this->id = $resource_id;
        
        $this->request = $request;
    }
    
    
    # En generell output() funktion som skriver ut det egna objektet som JSON
    function output(){
        echo json_encode($this);
    }
    
}
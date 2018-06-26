<?php

class _reports extends Resource{
    public $reports, $request;
    
    function __construct($resource_id, $request){
        if(is_numeric($resource_id))
        $this->id = $resource_id;
        $this->request = $request;
    }
    
    function GET($input, $connection){
        $result_bok = mysqli_query($connection, "SELECT * FROM bookings");
        $result_nat = mysqli_query($connection, "SELECT * FROM nationalities");
        $result_sale = mysqli_query($connection, "SELECT * FROM sale");
        $result_tod = mysqli_query($connection, "SELECT * FROM todays_event");
        
        $bok_options = mysqli_fetch_assoc(mysqli_query( $connection, "SELECT * FROM booking_options LIMIT 1" ));
        $nat_options = mysqli_fetch_assoc(mysqli_query( $connection, "SELECT * FROM nationalities_options LIMIT 1" ));
        $sale_options = mysqli_fetch_assoc(mysqli_query( $connection, "SELECT * FROM sale_options LIMIT 1" ));
        $tod_options = mysqli_fetch_assoc(mysqli_query( $connection, "SELECT * FROM todays_event_options LIMIT 1" ));
        
        $options_bookings = chart_options($bok_options);
        $options_nationalities = chart_options($nat_options);
        $options_sale = chart_options($sale_options);
        $options_todays_event = chart_options($tod_options);
        
        $bok_data = array();
        $bok_data["cols"] = array(
        array("id" => "", "label" => "Biljett", "type" => "string"),
        array("id" => "", "label" => "Antal bokningar", "type" => "number")
        );
        
        $bok_rows = array();
        foreach ($result_bok as $bok_row) {
            $bok_temp = array();
            $bok_temp[] = array("v" => (string) $bok_row["ticket_v"]);
            $bok_temp[] = array("v" => (int) $bok_row["bookings_v"]);
            $bok_temp[] = array("f" => (string) $bok_row["tooltip_f"]);
            $bok_rows[] = array("c" => $bok_temp);
        }
        $bok_data["rows"] = $bok_rows;
        
        $nat_data = array();
        $nat_data["cols"] = array(
        array("id" => "", "label" => "Land", "type" => "string"),
        array("id" => "", "label" => "Antal", "type" => "number")
        );
        
        $nat_rows = array();
        foreach ($result_nat as $nat_row) {
            $nat_temp = array();
            $nat_temp[] = array("v" => (string) $nat_row["country_v"]);
            $nat_temp[] = array("v" => (int) $nat_row["number_v"]);
            $nat_temp[] = array("f" => (string) $nat_row["tooltip_f"]);
            $nat_rows[] = array("c" => $nat_temp);
        }
        $nat_data["rows"] = $nat_rows;
        
        $sale_data = array();
        $sale_data["cols"] = array(
        array("id" => "", "label" => "År", "type" => "string"),
        array("id" => "", "label" => "Kort", "type" => "number"),
        array("id" => "", "label" => "Faktura", "type" => "number")
        );
        
        $sale_rows = array();
        foreach ($result_sale as $sale_row) {
            $sale_temp = array();
            $sale_temp[] = array("v" => (string) $sale_row["year_v"]);
            $sale_temp[] = array("v" => (int) $sale_row["credit_card_v"]);
            $sale_temp[] = array("v" => (int) $sale_row["bill_v"]);
            $sale_rows[] = array("c" => $sale_temp);
        }
        $sale_data["rows"] = $sale_rows;
        
        $tod_data = array();
        $tod_data["cols"] = array(
        array("id" => "", "label" => "Land", "type" => "string"),
        array("id" => "", "label" => "Män", "type" => "number"),
        array("id" => "", "label" => "Kvinnor", "type" => "number")
        );
        
        $tod_rows = array();
        foreach ($result_tod as $tod_row) {
            $tod_temp = array();
            $tod_temp[] = array("v" => (string) $tod_row["country_v"]);
            $tod_temp[] = array("v" => (int) $tod_row["men_v"]);
            $tod_temp[] = array("v" => (int) $tod_row["women_v"]);
            $tod_rows[] = array("c" => $tod_temp);
        }
        $tod_data["rows"] = $tod_rows;
        
        $obj = (object) [
        "bookings" => (object)["data" => $bok_data, "options" => $options_bookings],
        "nationalities" => (object)["data" => $nat_data, "options" => $options_nationalities],
        "sale" => (object)["data" => $sale_data, "options" => $options_sale],
        "todaysEvent" => (object)["data" => $tod_data, "options" => $options_todays_event]
        ];
        
        $this->reports = $obj;
        
    }
}
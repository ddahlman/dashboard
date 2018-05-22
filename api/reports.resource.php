<?php
#
# Den här klassen ska köras om vi anropat resursen user i vårt API genom /?/user
#
class _reports extends Resource{ // Klassen ärver egenskaper från den generella klassen Resource som finns i resource.class.php
    # Här deklareras de variabler/members som objektet ska ha
    public $bajs, $reports, $request;
    # Här skapas konstruktorn som körs när objektet skapas
    function __construct($resource_id, $request){
        
        # Om vi fått med ett id på resurser (Ex /?/user/15) och det är ett nummer sparar vi det i objektet genom $this->id
        if(is_numeric($resource_id))
        $this->id = $resource_id;
        # Vi sparar också det som kommer med i URL:en efter vårt id som en array
        $this->request = $request;
    }
    # Denna funktion körs om vi anropat resursen genom HTTP-metoden GET
    function GET($input, $connection){
        // om vår URL inte innehåller ett ID hämtas alla users
        $result_bok = mysqli_query($connection, "SELECT * FROM bookings");
        $result_nat = mysqli_query($connection, "SELECT * FROM nationalities");
        $result_sale = mysqli_query($connection, "SELECT * FROM sale");
        $result_tod = mysqli_query($connection, "SELECT * FROM todays_event");
        
        $bok_options = mysqli_fetch_assoc(mysqli_query( $connection, "SELECT * FROM booking_options LIMIT 1" ));
        $nat_options = mysqli_fetch_assoc(mysqli_query( $connection, "SELECT * FROM nationalities_options LIMIT 1" ));
        $sale_options = mysqli_fetch_assoc(mysqli_query( $connection, "SELECT * FROM sale_options LIMIT 1" ));
        $tod_options = mysqli_fetch_assoc(mysqli_query( $connection, "SELECT * FROM todays_event_options LIMIT 1" ));
        
        $options_bookings = chart_options($bok_options);
        /* $options_bookings = (object) [
        "regular" => (object)
        [
        "title" => $bok_options["title"],
        "backgroundColor" => $bok_options["backgroundColor"],
        "titleTextStyle" =>(object)[
        "color" => $bok_options["title_color"],
        "fontName" => $bok_options["title_fontName"],
        "fontSize" => $bok_options["title_fontSize"]
        ],
        "hAxis" =>(object)[
        "textStyle" => (object)[
        "color" => $bok_options["hAxis_textStyle_color"]
        ],
        "gridlines" => (object)[
        "color" => $bok_options["hAxis_gridlines_color"]
        ]
        ],
        "vAxis" => (object)[
        "textStyle" => (object)[
        "color" => $bok_options["vAxis_textStyle_color"]
        ],
        "titleTextStyle" => (object)[
        "color" => $bok_options["vAxis_titleTextStyle_color"]
        ],
        "baseLineColor" => $bok_options["vAxis_baseLineColor"]
        ],
        "legend" => (object)[
        "textStyle" => (object)[
        "color" => $bok_options["legend_textStyle_color"]
        ]
        ],
        "colors" => array($bok_options["colors1"], $bok_options["colors2"], $bok_options["colors3"]),
        "chartArea" => (object)[
        "left"=> $bok_options["chartArea_left"],
        "top"=> $bok_options["chartArea_top"],
        "height"=> $bok_options["chartArea_height"],
        "width"=> $bok_options["chartArea_width"]
        ],
        "aniamtion" => (object)[
        "startup" => $bok_options["animation_startup"],
        "duration" => $bok_options["animation_duration"],
        "easing" => $bok_options["animation_easing"]
        ]
        ],
        "pie" => (object)[
        "title" => $bok_options["pie_title"],
        "backgroundColor" => $bok_options["pie_backgroundColor"],
        "titleTextStyle" =>(object)[
        "color" => $bok_options["pie_title_color"],
        "fontName" => $bok_options["pie_title_fontName"],
        "fontSize" => $bok_options["pie_title_fontSize"]
        ],
        "legend" => (object)[
        "textStyle" => (object)[
        "color" => $bok_options["pie_legend_textStyle_color"]
        ]
        ],
        "colors" => array($bok_options["pie_color1"], $bok_options["pie_color2"], $bok_options["pie_color3"]),
        "chartArea" => (object)[
        "left"=> $bok_options["pie_chartArea_left"],
        "top"=> $bok_options["pie_chartArea_top"],
        "height"=> $bok_options["pie_chartArea_height"],
        "width"=> $bok_options["pie_chartArea_width"]
        ],
        "aniamtion" => (object)[
        "startup" => $bok_options["pie_animation_startup"],
        "duration" => $bok_options["pie_animation_duration"],
        "easing" => $bok_options["pie_animation_easing"]
        ],
        "pieHole" => $bok_options["pie_pieHole"]
        ]
        ]; */
        
        $this->bajs = $options_bookings;
        
        $bok_data = array();
        $bok_data["cols"] = array(
        //Labels for the chart, these represent the column titles
        array("id" => "", "label" => "Biljett", "type" => "string"),
        array("id" => "", "label" => "Antal bokningar", "type" => "number")
        );
        
        $bok_rows = array();
        foreach ($result_bok as $bok_row) {
            $bok_temp = array();
            //Values
            $bok_temp[] = array("v" => (string) $bok_row["ticket_v"]);
            $bok_temp[] = array("v" => (int) $bok_row["bookings_v"]);
            $bok_temp[] = array("f" => (string) $bok_row["tooltip_f"]);
            $bok_rows[] = array("c" => $bok_temp);
        }
        $bok_data["rows"] = $bok_rows;
        
        $nat_data = array();
        $nat_data["cols"] = array(
        //Labels for the chart, these represent the column titles
        array("id" => "", "label" => "Land", "type" => "string"),
        array("id" => "", "label" => "Antal", "type" => "number")
        );
        
        $nat_rows = array();
        foreach ($result_nat as $nat_row) {
            $nat_temp = array();
            //Values
            $nat_temp[] = array("v" => (string) $nat_row["country_v"]);
            $nat_temp[] = array("v" => (int) $nat_row["number_v"]);
            $nat_temp[] = array("f" => (string) $nat_row["tooltip_f"]);
            $nat_rows[] = array("c" => $nat_temp);
        }
        $nat_data["rows"] = $nat_rows;
        
        $sale_data = array();
        $sale_data["cols"] = array(
        //Labels for the chart, these represent the column titles
        array("id" => "", "label" => "År", "type" => "string"),
        array("id" => "", "label" => "Kort", "type" => "number"),
        array("id" => "", "label" => "Faktura", "type" => "number")
        );
        
        $sale_rows = array();
        foreach ($result_sale as $sale_row) {
            $sale_temp = array();
            //Values
            $sale_temp[] = array("v" => (string) $sale_row["year_v"]);
            $sale_temp[] = array("v" => (int) $sale_row["credit_card_v"]);
            $sale_temp[] = array("v" => (int) $sale_row["bill_v"]);
            $sale_rows[] = array("c" => $sale_temp);
        }
        $sale_data["rows"] = $sale_rows;
        
        $tod_data = array();
        $tod_data["cols"] = array(
        //Labels for the chart, these represent the column titles
        array("id" => "", "label" => "Land", "type" => "string"),
        array("id" => "", "label" => "Män", "type" => "number"),
        array("id" => "", "label" => "Kvinnor", "type" => "number")
        );
        
        $tod_rows = array();
        foreach ($result_tod as $tod_row) {
            $tod_temp = array();
            //Values
            $tod_temp[] = array("v" => (string) $tod_row["country_v"]);
            $tod_temp[] = array("v" => (int) $tod_row["men_v"]);
            $tod_temp[] = array("v" => (int) $tod_row["women_v"]);
            $tod_rows[] = array("c" => $tod_temp);
        }
        $tod_data["rows"] = $tod_rows;
        
        $obj = (object) [
        "bookings" => (object)["data" => $bok_data],
        "nationalities" => (object)["data" => $nat_data],
        "sale" => (object)["data" => $sale_data],
        "todaysEvent" => (object)["data" => $tod_data]
        ];
        
        $this->reports = $obj;
    }
    # Denna funktion körs om vi anropat resursen genom HTTP-metoden POST
    function POST($input, $connection){
        # I denna funktion skapar vi en ny user med den input vi fått
        $item = escape($input['item']);
        $headersID = escape($input['headersID']);
        
        $query = "INSERT INTO items (headersID, list_item)
        VALUES ('$headersID', '$item')";
        
        if(mysqli_query($connection, $query)) {
            $this->headersID = $headersID;
            $this->item = $item;
        }
    }
    # Denna funktion körs om vi anropat resursen genom HTTP-metoden PUT
    function PUT($input, $connection){
        # I denna funktion uppdateras en specifik user med den input vi fått
        # Observera att allt uppdaterad varje gång och att denna borde byggas om så att bara det vi skickar med uppdateras
        if($this->id){
            $item = escape($input['item']);
            
            $query = "UPDATE items
            SET list_item = '$item'
            WHERE id = $this->id
            ";
            
            if(mysqli_query($connection, $query)) {
                $this->item = $item;
            }
        }else{
            echo "No resource given";
        }
    }
    # Denna funktion körs om vi anropat resursen genom HTTP-metoden DELETE
    function DELETE($input, $connection){
        # I denna funktion tar vi bort en specifik user med det ID vi fått med
        if($this->id){
            $query = "DELETE FROM items
            WHERE id = $this->id";
            mysqli_query($connection, $query);
        }else{
            echo "No resource given";
        }
    }
}
<?php
#
# Den här klassen ska köras om vi anropat resursen user i vårt API genom /?/user
#
class _charts extends Resource{ // Klassen ärver egenskaper från den generella klassen Resource som finns i resource.class.php
    # Här deklareras de variabler/members som objektet ska ha
    public $chart, $id, $ordernumber, $report, $charttype, $cssclass, $x, $y, $slotpositions, $request;
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
        $result = mysqli_query($connection, "SELECT id, ordernumber, report, charttype, cssclass FROM charts");
        $chart = [];
        while($row = mysqli_fetch_assoc($result)) {
            $chart[] = $row;
            /*  $slot_array = explode(" | ", $row['slotpositions']);
            $slot = [];
            foreach ($slot_array as $item) {
            list($xPos,$yPos) = explode(", ", $item);
            $slot[] = ['xPos' => (int)$xPos, 'yPos' => (int)$yPos];
            }
            
            $chart[] = [
            'id' => $row['id'],
            'ordernumber' => $row['ordernumber'],
            'report' => $row['report'],
            'charttype' => $row['charttype'],
            'cssclass' => $row['cssclass'],
            'x' => $row['x'],
            'y' =>  $row['y'],
            'slotpositions' => $slot
            ]; */
        }
        
        $this->chart = $chart;
    }
    # Denna funktion körs om vi anropat resursen genom HTTP-metoden POST
    function POST($input, $connection){
        $ordernumber = escape($input['ordernumber']);
        $report = escape($input['report']);
        $charttype = escape($input['charttype']);
        $cssclass = escape($input['cssclass']);
        /*   $x = escape($input['x']);
        $y = escape($input['y']);
        
        $slotpositions = implode_array($input['slotpositions']);
        $slotpositions = escape($slotpositions); */
        
        $query = "INSERT INTO charts (ordernumber, report, charttype, cssclass)
        VALUES ('$ordernumber', '$report', '$charttype', '$cssclass')";
        
        if(mysqli_query($connection, $query)) {
            $this->id = mysqli_insert_id($connection);
            $this->ordernumber = $ordernumber;
            $this->report = $report;
            $this->charttype = $charttype;
            $this->cssclass = $cssclass;
            /*   $this->x = $x;
            $this->y = $y;
            $this->slotpositions = $slotpositions; */
        }
        
    }
    # Denna funktion körs om vi anropat resursen genom HTTP-metoden PUT
    function PUT($input, $connection){
        $id = escape($input['id']);
        $ordernumber = escape($input['ordernumber']);
        $report = escape($input['report']);
        $charttype = escape($input['charttype']);
        $cssclass = escape($input['cssclass']);
        /*   $x = escape($input['x']);
        $y = escape($input['y']);
        
        $slotpositions = implode_array($input['slotpositions']);
        $slotpositions = escape($slotpositions); */
        
        $query = "UPDATE charts
        SET ordernumber = '$ordernumber',
        report = '$report',
        charttype = '$charttype',
        cssclass = '$cssclass'
        WHERE id = $id";
        
        if(mysqli_query($connection, $query)) {
            $this->id = $id;
            $this->ordernumber = $ordernumber;
            $this->report = $report;
            $this->charttype = $charttype;
            $this->cssclass = $cssclass;
            /*      $this->x = $x;
            $this->y = $y;
            $this->slotpositions = $slotpositions; */
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
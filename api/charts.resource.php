<?php
#
# Den här klassen ska köras om vi anropat resursen user i vårt API genom /?/user
#
class _charts extends Resource{ // Klassen ärver egenskaper från den generella klassen Resource som finns i resource.class.php
    # Här deklareras de variabler/members som objektet ska ha
    public $chart, $id, $report, $charttype, $cssclass, $x, $y, $slotpositions, $request;
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
        $rest_of_result = mysqli_query($connection, "SELECT id, report, charttype, cssclass, x, y, slotpositions FROM charts");
        $chart = [];
        while($row = mysqli_fetch_assoc($rest_of_result)) {
            
            $slot_array = explode(" | ", $row['slotpositions']);
            $slot = [];
            foreach ($slot_array as $item) {
                list($xPos,$yPos) = explode(", ", $item);
                $slot[] = ['xPos' => (int)$xPos, 'yPos' => (int)$yPos];
            }
            
            $chart[] = [
            'id' => $row['id'],
            'report' => $row['report'],
            'charttype' => $row['charttype'],
            'cssclass' => $row['cssclass'],
            'x' => $row['x'],
            'y' =>  $row['y'],
            'slotpositions' => $slot
            ];
        }
        
        $this->chart = $chart;
    }
    # Denna funktion körs om vi anropat resursen genom HTTP-metoden POST
    function POST($input, $connection){
        
        $report = escape($input['report']);
        $charttype = escape($input['charttype']);
        $cssclass = escape($input['cssclass']);
        $x = escape($input['x']);
        $y = escape($input['y']);
        
        $slots = $input['slotpositions'];
        $implodedSlots = array_map(function($a){
            return implode(", ", $a);
        }, $slots);
        $slotpositions = implode(" | ", $implodedSlots);
        $slotpositions = escape($slotpositions);
        
        $query = "INSERT INTO charts (report, charttype, cssclass, x, y, slotpositions)
        VALUES ('$report', '$charttype', '$cssclass', '$x', '$y', '$slotpositions')";
        
        if(mysqli_query($connection, $query)) {
            $this->id = mysqli_insert_id($connection);
            $this->report = $report;
            $this->charttype = $charttype;
            $this->cssclass = $cssclass;
            $this->x = $x;
            $this->y = $y;
            $this->slotpositions = $slotpositions;
        }
        
    }
    # Denna funktion körs om vi anropat resursen genom HTTP-metoden PUT
    function PUT($input, $connection){
        # I denna funktion uppdateras en specifik user med den input vi fått
        # Observera att allt uppdateras varje gång och att denna borde byggas om så att bara det vi skickar med uppdateras
        $id = escape($input['id']);
        $x = escape($input['x']);
        $y = escape($input['y']);
        $slotpositions = escape($input['slotpositions']);
        
        var_dump(json_encode($input['id']));
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
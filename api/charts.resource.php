<?php

class _charts extends Resource{
    public $chart, $id, $ordernumber, $report, $charttype, $cssclass, $x, $y, $slotpositions, $request;
    
    function __construct($resource_id, $request){
        if(is_numeric($resource_id))
        $this->id = $resource_id;
        $this->request = $request;
    }
    
    function GET($input, $connection){
        $result = mysqli_query($connection, "SELECT id, ordernumber, report, charttype, cssclass FROM charts");
        $chart = [];
        while($row = mysqli_fetch_assoc($result)) {
            $chart[] = $row;
        }
        $this->chart = $chart;
    }
    
    function POST($input, $connection){
        
        $chartdata = $input['chartdata'];
        $chart = [];
        foreach ($chartdata as $key) {
            $ordernumber = escape($key['ordernumber']);
            $report = escape($key['report']);
            $charttype = escape($key['charttype']);
            $cssclass = escape($key['cssclass']);
            
            $query = "INSERT INTO charts (ordernumber, report, charttype, cssclass)
            VALUES ('$ordernumber', '$report', '$charttype', '$cssclass')";
            
            if(mysqli_query($connection, $query)) {
                $chart[] = [
                'id' => mysqli_insert_id($connection),
                'ordernumber' => $ordernumber,
                'report' => $report,
                'charttype' => $charttype,
                'cssclass' => $cssclass
                ];
            }
        }
        $this->chart = $chart;
    }
    function PUT($input, $connection){
        $id = escape($input['id']);
        $ordernumber = escape($input['ordernumber']);
        $report = escape($input['report']);
        $charttype = escape($input['charttype']);
        $cssclass = escape($input['cssclass']);
        
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
        }
    }
    function DELETE($input, $connection){
        if($this->id){
            $query = "DELETE FROM charts
            WHERE id = $this->id";
            mysqli_query($connection, $query);
        }else{
            echo "Det gick fel... gör något!";
        }
    }
}
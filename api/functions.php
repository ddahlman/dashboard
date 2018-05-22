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

function chart_options($result) {
    
    return $options = (object) [
    "regular" => (object)
    [
    "title" => $result["title"],
    "backgroundColor" => $result["backgroundColor"],
    "titleTextStyle" =>(object)[
    "color" => $result["title_color"],
    "fontName" => $result["title_fontName"],
    "fontSize" => $result["title_fontSize"]
    ],
    "hAxis" =>(object)[
    "textStyle" => (object)[
    "color" => $result["hAxis_textStyle_color"]
    ],
    "gridlines" => (object)[
    "color" => $result["hAxis_gridlines_color"]
    ]
    ],
    "vAxis" => (object)[
    "textStyle" => (object)[
    "color" => $result["vAxis_textStyle_color"]
    ],
    "titleTextStyle" => (object)[
    "color" => $result["vAxis_titleTextStyle_color"]
    ],
    "baseLineColor" => $result["vAxis_baseLineColor"]
    ],
    "legend" => (object)[
    "textStyle" => (object)[
    "color" => $result["legend_textStyle_color"]
    ]
    ],
    "colors" => array($result["colors1"], $result["colors2"], $result["colors3"]),
    "chartArea" => (object)[
    "left"=> $result["chartArea_left"],
    "top"=> $result["chartArea_top"],
    "height"=> $result["chartArea_height"],
    "width"=> $result["chartArea_width"]
    ],
    "aniamtion" => (object)[
    "startup" => (bool) $result["animation_startup"],
    "duration" => (int) $result["animation_duration"],
    "easing" => $result["animation_easing"]
    ]
    ],
    "pie" => (object)[
    "title" => $result["pie_title"],
    "backgroundColor" => $result["pie_backgroundColor"],
    "titleTextStyle" =>(object)[
    "color" => $result["pie_title_color"],
    "fontName" => $result["pie_title_fontName"],
    "fontSize" => $result["pie_title_fontSize"]
    ],
    "legend" => (object)[
    "textStyle" => (object)[
    "color" => $result["pie_legend_textStyle_color"]
    ]
    ],
    "colors" => array($result["pie_color1"], $result["pie_color2"], $result["pie_color3"]),
    "chartArea" => (object)[
    "left"=> $result["pie_chartArea_left"],
    "top"=> $result["pie_chartArea_top"],
    "height"=> $result["pie_chartArea_height"],
    "width"=> $result["pie_chartArea_width"]
    ],
    "aniamtion" => (object)[
    "startup" => (bool) $result["pie_animation_startup"],
    "duration" => (int) $result["pie_animation_duration"],
    "easing" => $result["pie_animation_easing"]
    ],
    "pieHole" => $result["pie_pieHole"]
    ]
    ];
}

?>
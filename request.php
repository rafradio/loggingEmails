<?php
    $body2 = file_get_contents('php://input');
    $data = json_decode($body2);
    $urlString = '';
    $input = fopen("config.txt", "r");
    while(!feof($input)) { 
        $dataDB[] = trim(fgets($input));
    }
    switch ($data->project) {
        case "Мегафон":
            $urlString = $dataDB[0];
            break;
        case "Магнит":
            $urlString = $dataDB[1];
            break;
        case "Роснефть":
            $urlString = $dataDB[2];
            break;
    }
    
    $urlString .= strval( $data->date ) . ".txt";
//    $response = file_get_contents($url);

    if (($response = @file_get_contents($urlString)) === false) {
        $error = error_get_last();
        $response = "no data";
    } 

    $out['data'] = $response;
    $out['test'] = $body2;
    echo json_encode($out);
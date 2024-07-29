<?php
    $body2 = file_get_contents('php://input');
    $data = json_decode($body2);
    $url= "https://rn.imystery.ru/mlog/send_log_" . strval( $data->date ) . ".txt";
//    $response = file_get_contents($url);

    
    if (($response = @file_get_contents($url)) === false) {
        $error = error_get_last();
        $response = "no data";
    } 

    $out['data'] = $response;
    $out['test'] = $body2;
    echo json_encode($out);
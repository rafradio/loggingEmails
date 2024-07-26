<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <style>
            table {
                margin-left: 7px;
            }
            table, td, th {
                border-collapse: collapse;
                border: 0.2px solid black;
             }
             td {
                 width: 100%;
             }
            .new-dates {
                width: 110px;
                margin-left: 7px;
                margin-right: 7px;
                font-size: 12px;
                padding: 2px;
            }
            .new-closed-dates {
                width: 160px;
            }
            #idAnketa {
                margin-left: 7px;
                margin-right: 7px;
                width: 120px;
            }
            #emailUser {
                width: 170px;
            }
            .multiple {
                font-size: 12px;
                padding: 5px;
                height: 77%;
                width: 250px;
                border: 1px solid rgb(90, 90, 90);
                outline: none;
                border-radius: 2px;
                color: rgb(102, 102, 102);
                margin-top: 10px;
                margin-left: 7px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <input class="new-dates" type="date" required pattern="\d{2}-\d{2}-\d{2}" >
        <button id="request" style="margin-right: 20px; cursor: pointer">Получить данные</button><br>
        <select id="idAnketa"></select><select id="emailUser"></select>
        <button id="filterData" style="margin-right: 20px; cursor: pointer">Добавить</button><br>
        <div id="info"></div>
        <select id="filterList" class="multiple" size="8"></select>
        <?php
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');
            header("Access-Control-Allow-Methods: GET, PUT, POST");
        ?>
        <script src="main.js" ></script>
    </body>
</html>

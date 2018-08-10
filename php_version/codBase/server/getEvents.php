<?php
require('connection.php');
$con = new ConnectionDB('localhost', 'root', '');

$response['msg'] = $con->init('nextu_c7');
$events = array();

if ($response['msg'] == 'OK') {
    $username = $_POST['username'];
    $user = $con->select('user', 'WHERE email="'.$username.'"');
    $userId;

    if (!is_bool($user) && $user->num_rows > 0) {
        while($row = $user->fetch_assoc()) {
            $userId = $row['id'];
        }

        $rows = $con->select('event', 'WHERE user_id='.$userId);

        if (!is_bool($rows) && $rows->num_rows > 0) {
            while($row = $rows->fetch_assoc()) {
                $event['id'] = $row['id'];
                $event['title'] = $row['title'];
                $event['start'] = $row['start'];
                $event['start_hour'] = $row['start_hour'];
                $event['end'] = $row['end'];
                $event['end_hour'] = $row['end_hour'];
                $event['all_day'] = $row['all_day'];
                array_push($events, $event);
            }
        }
    } else {
        $response['msg'] = 'Usuario no existe.';
    }
}

$response['events'] = $events;

echo json_encode($response);

$con->close();
 ?>

<?php
require('connection.php');
$con = new ConnectionDB('localhost', 'root', '');

$response['msg'] = $con->init('nextu_c7');

if ($response['msg'] == 'OK') {
    $username = $_POST['username'];
    $user = $con->select('user', 'WHERE email="'.$username.'"');
    $userId;

    if (!is_bool($user) && $user->num_rows > 0) {
        while($row = $user->fetch_assoc()) {
            $userId = $row['id'];
        }

        $eventId = $_POST['id'];
        $data['start'] = '"'.$_POST['start_date'].'"';
        $data['start_hour'] = '"'.$_POST['start_hour'].'"';
        $data['end'] = '"'.$_POST['end_date'].'"';
        $data['end_hour'] = '"'.$_POST['end_hour'].'"';

        if ($con->update('event', $data, 'user_id="'.$username.'" AND id='.$eventId)) {
            $response['msg'] = 'OK';
        } else {
            $response['msg'] = 'Ha ocurrido un error al actualizar el evento. Por favor, intente más tarde.';
        }
    }
}

echo json_encode($response);

$con->close();
 ?>

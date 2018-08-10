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

        $data['title'] = '"'.$_POST['titulo'].'"';
        $data['start'] = '"'.$_POST['start_date'].'"';
        $data['start_hour'] = '"'.$_POST['start_hour'].'"';
        $data['end'] = '"'.$_POST['end_date'].'"';
        $data['end_hour'] = '"'.$_POST['end_hour'].'"';
        $data['all_day'] = $_POST['allDay'];
        $data['user_id'] = $userId;

        if ($con->insert('event', $data)) {
            $response['msg'] = 'OK';
        } else {
            $response['msg'] = 'Ha ocurrido un error al crear el evento. Por favor, intente más tarde.';
        }
    } else {
        $response['msg'] = 'Usuario no existe.';
    }
}

echo json_encode($response);

$con->close();
?>

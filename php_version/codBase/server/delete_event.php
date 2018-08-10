<?php
require('connection.php');
$con = new ConnectionDB('localhost', 'root', '');

$response['msg'] = $con->init('nextu_c7');

if ($response['msg'] == 'OK') {
    $eventId = $_POST['id'];

    if ($con->delete('event', 'id='.$eventId)) {
        $response['msg'] = 'OK';
    } else {
        $response['msg'] = 'No se pudo eliminar el evento. Por favor, intente más tarde.';
    }
}

echo json_encode($response);

$con->close();
?>

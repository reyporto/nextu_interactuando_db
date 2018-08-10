<?php
require('connection.php');
$con = new ConnectionDB('localhost', 'root', '');

$response['msg'] = $con->init('nextu_c7');

if ($response['msg'] == 'OK') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $result = $con->select('user', 'WHERE email="'.$username.'"');

    if (!is_bool($result) && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            if (password_verify($password, $row["password"])) {
                $response['msg'] = 'OK';
            } else {
                $response['msg'] = 'Usuario o contrasenia incorrectos.';
            }
        }
    } else {
        $response['msg'] = 'Usuario o contrasenia incorrectos.';
    }
}

echo json_encode($response);

$con->close();
 ?>

<?php
require('connection.php');
$con = new ConnectionDB('localhost', 'root', '');

$response['msg'] = $con->init('');
$array = array();

array_push($array, $response['msg']);

if ($response['msg'] == 'OK') {
    if ($con->createdb('nextu_c7')) {
        $con->close();
        $response['msg'] = $con->init('nextu_c7');
        array_push($array, $response['msg']);

        if ($response['msg'] == 'OK') {
            $userData['id'] = 'int(11) NOT NULL';
            $userData['email'] = 'varchar(50) NOT NULL';
            $userData['name'] = 'varchar(50) NOT NULL';
            $userData['password'] = 'varchar(100) NOT NULL';
            $userData['birthdate'] = 'varchar(50) NOT NULL';

            if ($con->createtable('user', $userData)) {
                array_push($array, 'Tabla user creada.');

                if ($con->restriction('user', 'ADD PRIMARY KEY (id);')) {
                    array_push($array, 'Restriccion creada.');
                } else {
                    array_push($array, 'Error al crear restriccion.');
                }

                if ($con->restriction('user', 'MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;')) {
                    array_push($array, 'Restriccion creada.');
                } else {
                    array_push($array, 'Error al crear restriccion.');
                }

                $data['email'] = '"reinaldo@nextu.com"';
                $data['name'] = '"Reinaldo Porto"';
                $data['birthdate'] = '"1987-01-15"';
                $data['password'] = '"'.password_hash('123456', PASSWORD_DEFAULT).'"';

                if ($con->insert('user', $data)) {
                    array_push($array, 'Usuario registrado: '.$data['email']);
                } else {
                    array_push($array, 'Hubo un error al insertar usuario '.$data['name']);
                }

                $data['email'] = '"usuario1@nextu.com"';
                $data['name'] = '"Usuario Uno"';
                $data['birthdate'] = '"1990-01-01"';
                $data['password'] = '"'.password_hash('123456', PASSWORD_DEFAULT).'"';

                if ($con->insert('user', $data)) {
                    array_push($array, 'Usuario registrado: '.$data['email']);
                } else {
                    array_push($array, 'Hubo un error al insertar usuario '.$data['name']);
                }

                $data['email'] = '"usuario2@nextu.com"';
                $data['name'] = '"Usuario Dos"';
                $data['birthdate'] = '"1990-01-01"';
                $data['password'] = '"'.password_hash('123456', PASSWORD_DEFAULT).'"';

                if ($con->insert('user', $data)) {
                    array_push($array, 'Usuario registrado: '.$data['email']);
                } else {
                    array_push($array, 'Hubo un error al insertar usuario '.$data['name']);
                }
            } else {
                array_push($array, 'Error al crear tabla user.');
            }

            $eventData['id'] = 'int(11) NOT NULL';
            $eventData['title'] = 'varchar(50) NOT NULL';
            $eventData['start'] = 'varchar(50) NOT NULL';
            $eventData['start_hour'] = 'varchar(100) NOT NULL';
            $eventData['end'] = 'varchar(50) NOT NULL';
            $eventData['end_hour'] = 'varchar(50) NOT NULL';
            $eventData['all_day'] = 'tinyint(1) NOT NULL';
            $eventData['user_id'] = 'int(11) NOT NULL';

            if ($con->createtable('event', $eventData)) {
                array_push($array, 'Tabla event creada.');

                if ($con->restriction('event', 'ADD PRIMARY KEY (id);')) {
                    array_push($array, 'Restriccion creada.');
                } else {
                    array_push($array, 'Error al crear restriccion.');
                }

                if ($con->restriction('event', 'ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);')) {
                    array_push($array, 'Restriccion creada.');
                } else {
                    array_push($array, 'Error al crear restriccion.');
                }

                if ($con->restriction('event', 'MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;')) {
                    array_push($array, 'Restriccion creada.');
                } else {
                    array_push($array, 'Error al crear restriccion.');
                }
            } else {
                array_push($array, 'Error al crear tabla event.');
            }
        }
    } else {
        array_push($array, 'Erro al crear la base de datos.');
    }
}

echo json_encode($array);

$con->close();
 ?>

<?php 
class ConnectionDB {
    private $host;
    private $user;
    private $password;
    private $conexion;

    function __construct($host, $user, $password) {
      $this->host = $host;
      $this->user = $user;
      $this->password = $password;
    }

    function init($db) {
        if ($db == '') {
            $this->connection = new mysqli($this->host, $this->user, $this->password);
        } else {
            $this->connection = new mysqli($this->host, $this->user, $this->password, $db);
        }
        
        if ($this->connection->connect_error) {
            return "Error:" . $this->connection->connect_error;
        } else {
            return "OK";
        }
    }

    function close() {
        $this->connection->close();
    }

    function exec($query) {
        return $this->connection->query($query);
    }

    function select($table, $condition = "") {
        $sql = "SELECT * FROM ".$table." ".$condition.";";
        return $this->exec($sql);
    }

    function insert($table, $data) {
        $sql = 'INSERT INTO '.$table.' (';
        $i = 1;

        foreach ($data as $key => $value) {
            $sql .= $key;

            if ($i < count($data)) {
                $sql .= ', ';
            } else {
                $sql .= ')';
            }

            $i++;
        }

        $sql .= ' VALUES (';
        $i = 1;

        foreach ($data as $key => $value) {
            $sql .= $value;

            if ($i < count($data)) {
                $sql .= ', ';
            }else {
                $sql .= ');';
            }

            $i++;
        }

        return $this->exec($sql);
    }

    function update($table, $data, $condition) {
        $sql = 'UPDATE '.$table.' SET ';
        $i=1;

        foreach ($data as $key => $value) {
            $sql .= $key.'='.$value;

            if ($i < sizeof($data)) {
                $sql .= ', ';
            } else {
                $sql .= ' WHERE '.$condition.';';
            }

            $i++;
        }

        return $this->exec($sql);
    }

    function delete($table, $condition) {
        $sql = "DELETE FROM ".$table." WHERE ".$condition.";";
        return $this->exec($sql);
    }

    function createdb($db) {
        $sql = "CREATE DATABASE ".$db;
        return $this->exec($sql);
    }

    function createtable($table, $files) {
        $sql = 'CREATE TABLE '.$table.' (';
        $length_array = count($files);
        $i = 1;

        foreach ($files as $key => $value) {
          $sql .= $key.' '.$value;

          if ($i != $length_array) {
            $sql .= ', ';
          }else {
            $sql .= ');';
          }

          $i++;
        }

        return $this->exec($sql);
    }

    function restriction($table, $restriction) {
        $sql = 'ALTER TABLE '.$table.' '.$restriction;
        return $this->exec($sql);
    }
    
    function getConnection() {
        return $this->connection;
    }
}
?>
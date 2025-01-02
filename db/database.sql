

-- Crear la base de datos "gymclient"
CREATE DATABASE IF NOT EXISTS EFC;

-- Conectarse a la base de datos "gymclient"
USE EFC;

-- Crear la tabla "client"
CREATE TABLE EFC_client (
    id INT (11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50),
    phone VARCHAR(50),
    password VARCHAR(50),
    category VARCHAR(50),
    membership_status VARCHAR(20)
);

-- Insertar valores en la tabla "client"
INSERT INTO EFC_client VALUES  
(1, 'John', 'Doe', 'johndoe@example.com', '1234567890', 'password123', 'INT', 'Active'),
(2, 'Jane', 'Smith', 'janesmith@example.com', '0987654321', 'password456', 'EXT', 'Inactive'),
(3, 'Chuck', 'Norris', 'chucknorris@example.com', '9876543210', 'password789', 'EXT', 'Active');

DESCRIBE EFC_client;

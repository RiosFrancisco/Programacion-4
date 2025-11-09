CREATE DATABASE IF NOT EXISTS vulnerable_app;
USE vulnerable_app;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10, 2),
    description TEXT,
    stock INT DEFAULT 0
);

-- Tabla de transferencias
CREATE TABLE IF NOT EXISTS transfers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_account VARCHAR(20),
    to_account VARCHAR(20),
    amount DECIMAL(10, 2),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insertar datos de prueba
-- Password: admin123 -> $2a$10$OPJ7MpjW4oVxXmZHlnRLhuxCDnw3cnWElm2Yl4qM3Mz5aAXDBVERu
-- Password: user123 -> $2a$10$/3DWeOWabbh0jxqwIgtS6ewmlkuEe.KOc4WiAAOrgqFy2rnQSzjqS
INSERT INTO users (username, password, email) VALUES
('admin', '$2a$10$OPJ7MpjW4oVxXmZHlnRLhuxCDnw3cnWElm2Yl4qM3Mz5aAXDBVERu', 'admin@example.com'),
('user1', '$2a$10$/3DWeOWabbh0jxqwIgtS6ewmlkuEe.KOc4WiAAOrgqFy2rnQSzjqS', 'user1@example.com');

INSERT INTO products (name, category, price, description, stock) VALUES
('Laptop HP', 'Electronics', 899.99, 'Laptop HP 15.6 pulgadas', 10),
('Mouse Logitech', 'Electronics', 29.99, 'Mouse inalámbrico', 50),
('Teclado Mecánico', 'Electronics', 79.99, 'Teclado gaming RGB', 25),
('Monitor Samsung', 'Electronics', 299.99, 'Monitor 24 pulgadas Full HD', 15),
('Escritorio', 'Furniture', 199.99, 'Escritorio de madera', 5),
('Silla Gamer', 'Furniture', 349.99, 'Silla ergonómica para gaming', 8),
('Webcam HD', 'Electronics', 49.99, 'Cámara web 1080p', 30),
('Lámpara LED', 'Furniture', 39.99, 'Lámpara de escritorio LED', 20),
('Hub USB', 'Electronics', 19.99, 'Hub USB 3.0 de 4 puertos', 40),
('Mousepad XL', 'Electronics', 24.99, 'Mousepad gaming extra grande', 35);

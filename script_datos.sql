USE buen_sabor;
-- Datos Pais
INSERT INTO PAIS (ELIMINADO, NOMBRE) VALUES (0, 'Argentina');
-- Provincia
SET @argentina_id = (SELECT ID FROM PAIS WHERE NOMBRE = 'Argentina' LIMIT 1);
INSERT INTO PROVINCIA (ELIMINADO, NOMBRE, PAIS_ID) VALUES
                                                       (0, 'Buenos Aires', @argentina_id),
                                                       (0, 'Catamarca', @argentina_id),
                                                       (0, 'Chaco', @argentina_id),
                                                       (0, 'Chubut', @argentina_id),
                                                       (0, 'Córdoba', @argentina_id),
                                                       (0, 'Corrientes', @argentina_id),
                                                       (0, 'Entre Ríos', @argentina_id),
                                                       (0, 'Formosa', @argentina_id),
                                                       (0, 'Jujuy', @argentina_id),
                                                       (0, 'La Pampa', @argentina_id),
                                                       (0, 'La Rioja', @argentina_id),
                                                       (0, 'Mendoza', @argentina_id),
                                                       (0, 'Misiones', @argentina_id),
                                                       (0, 'Neuquén', @argentina_id),
                                                       (0, 'Río Negro', @argentina_id),
                                                       (0, 'Salta', @argentina_id),
                                                       (0, 'San Juan', @argentina_id),
                                                       (0, 'San Luis', @argentina_id),
                                                       (0, 'Santa Cruz', @argentina_id),
                                                       (0, 'Santa Fe', @argentina_id),
                                                       (0, 'Santiago del Estero', @argentina_id),
                                                       (0, 'Tierra del Fuego', @argentina_id),
                                                       (0, 'Tucumán', @argentina_id),
                                                       (0, 'CABA', @argentina_id);
-- Localidad
SET @mendoza_provincia_id = (SELECT ID FROM PROVINCIA WHERE NOMBRE = 'Mendoza' LIMIT 1);
INSERT INTO LOCALIDAD (ELIMINADO, NOMBRE, PROVINCIA_ID) VALUES
                                                            (0, 'Mendoza', @mendoza_provincia_id),
                                                            (0, 'Godoy Cruz', @mendoza_provincia_id),
                                                            (0, 'Guaymallén', @mendoza_provincia_id),
                                                            (0, 'Maipú', @mendoza_provincia_id),
                                                            (0, 'Las Heras', @mendoza_provincia_id),
                                                            (0, 'Luján de Cuyo', @mendoza_provincia_id),
                                                            (0, 'San Rafael', @mendoza_provincia_id),
                                                            (0, 'General Alvear', @mendoza_provincia_id),
                                                            (0, 'Malargüe', @mendoza_provincia_id),
                                                            (0, 'Rivadavia', @mendoza_provincia_id),
                                                            (0, 'San Martín', @mendoza_provincia_id),
                                                            (0, 'Tunuyán', @mendoza_provincia_id),
                                                            (0, 'Tupungato', @mendoza_provincia_id),
                                                            (0, 'San Carlos', @mendoza_provincia_id),
                                                            (0, 'Lavalle', @mendoza_provincia_id),
                                                            (0, 'Santa Rosa', @mendoza_provincia_id),
                                                            (0, 'Junín', @mendoza_provincia_id),
                                                            (0, 'La Paz', @mendoza_provincia_id);
-- USUARIO
INSERT INTO USUARIO VALUES
                                   (1, FALSE, '123123', 'admin@buensa.com', '0wT1WSonPZfdiXIoceu2imy7GJ53', 'https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg',  'password', 'ADMINISTRADOR'),
                                   (2, FALSE, '123', 'cajero@buensa.com', 'IvLNrda6CkPiT7uqp3DfpguF6rZ2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221580/hirlalizap8uluw3sa1u.jpg',  'password', 'CAJERO'),
                                   (3, FALSE, '1234', 'cocinero@buensa.com', 'FBOrztuIpidGMVcJRRmsWDfbNf83','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221678/pkfdcanbungp7lpx75xo.jpg',  'password', 'COCINERO'),
                                   (4, FALSE, '12345', 'delivery@buensa.com', 'aqi54XpX0wgvG3jhIkSSukDg7Yx2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221617/l42s8t31mivewaalmmuq.jpg',  'password', 'DELIVERY'),
                                   (5, FALSE, '4334343', 'juan@hotmail.com', 'v1E2gY1G90MlcrqT3jefJBSMVhf1','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749220817/yekjwtrrthcqf3thhu3c.jpg',  'password', 'CLIENTE'),
                                    (6,FALSE,'12121242','mln204manutup@gmail.com','70oXKoe8CyePy3dFYy7P9SRjGwJ3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg', 'password','ADMINISTRADOR');



-- DOMICILIO (al menos 4)
INSERT INTO DOMICILIO VALUES
                                     (1, FALSE, 'Baez', 5500, 'detalles', '23', 209, '1', 3),
                                     (2, FALSE, 'Lar', 5503, 'depto', '', 122, '', 2),
                                     (3, FALSE, 'San Martín', 5515, 'casa', NULL, 154, NULL, 5),
                                     (4, FALSE, 'Belgrano', 5501, NULL, 'B', 301, '3', 7),
                                    (5, FALSE,'Peru',5500,'Casa',NULL,123,'',1);

-- EMPLEADO
INSERT INTO EMPLEADO VALUES
                                    (1, FALSE, 'Gómez', '1990-05-12', 'Ana', '2611111111', 1, 1),
                                    (2, FALSE, 'Pérez', '1985-03-20', 'Luis', '2612222222', 2, 2),
                                    (3, FALSE, 'Rodríguez', '1992-08-30', 'Marta', '2613333333', 3, 3),
                                    (4, FALSE, 'Fernández', '1995-11-11', 'Carlos', '2614444444', 4, 4),
                                    (5, FALSE,  'Diaz','2009-02-11','Franco','124115',5, 6);

-- CLIENTE
INSERT INTO CLIENTE VALUES
    (1, FALSE, 'Ramírez', '2000-01-01', 'Juan', '2615555555', 5);

-- CLIENTE_DOMICILIO (cliente con múltiples domicilios)
INSERT INTO CLIENTE_DOMICILIO VALUES
                                             (1, 1),
                                             (1, 2);


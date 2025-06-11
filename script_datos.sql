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
insert  into `usuario`(`id`,`eliminado`,`dni`,`email`,`firebase_uid`,`photo_url`,`provider_id`,`rol`) values (1,'\0','123123','admin@buensa.com','0wT1WSonPZfdiXIoceu2imy7GJ53','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg','password','ADMINISTRADOR'),(2,'\0','123','cajero@buensa.com','IvLNrda6CkPiT7uqp3DfpguF6rZ2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221580/hirlalizap8uluw3sa1u.jpg','password','CAJERO'),(3,'\0','1234','cocinero@buensa.com','FBOrztuIpidGMVcJRRmsWDfbNf83','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221678/pkfdcanbungp7lpx75xo.jpg','password','COCINERO'),(4,'\0','12345','delivery@buensa.com','aqi54XpX0wgvG3jhIkSSukDg7Yx2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221617/l42s8t31mivewaalmmuq.jpg','password','DELIVERY'),(5,'\0','4334343','juan@hotmail.com','v1E2gY1G90MlcrqT3jefJBSMVhf1','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749220817/yekjwtrrthcqf3thhu3c.jpg','password','CLIENTE'),(6,'\0','12121242','mln204manutup@gmail.com','70oXKoe8CyePy3dFYy7P9SRjGwJ3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg','password','ADMINISTRADOR'),(7,'\0','4223232','luis@hotmail.com','h8stw8x2WJYlcPTj7MuC56YmeNE3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528593/owc3hsdwd921vcsi7omj.jpg','password','CLIENTE'),(8,'\0','24124122','max@hotmail.com','0AqJQjapRXYZ2LmX95XeXFib9ev2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528768/si6msmbtkcefciwl67nc.jpg','password','CLIENTE');

-- DOMICILIO (al menos 4)
insert  into `domicilio`(`id`,`eliminado`,`calle`,`codigo_postal`,`detalles`,`nro_departamento`,`numero`,`piso`,`localidad_id`) values (1,'\0','Baez',5500,'detalles','23',209,'1',3),(2,'\0','Lar',5503,'depto','',122,'',2),(3,'\0','San Martín',5515,'casa',NULL,154,NULL,5),(4,'\0','Belgrano',5501,NULL,'B',301,'3',7),(5,'\0','Peru',5500,'Casa',NULL,123,'',1),(6,'\0','Chile',5500,'Casa',NULL,209,'',1),(7,'\0','Mitre',5500,'Depto','26',300,'1',1),(8,'\0','Massa',5508,'Casa vieja',NULL,232,'',4),(9,'\0','Rivadavia',5502,'Casa Central',NULL,208,'1',2);
-- Insertar el domicilio para la sucursal (usando id 10 como se especificó)
-- Asegúrate de que la `localidad_id` exista en tu tabla `localidad`
INSERT INTO `domicilio` (`id`, `eliminado`, `calle`, `codigo_postal`, `detalles`, `nro_departamento`, `numero`, `piso`, `localidad_id`) VALUES
    (10, b'0', 'Av. Libertador', 5500, 'Frente a la plaza', NULL, 1234, NULL, 1); -- Reemplaza 1 con un ID de localidad válido
-- Insertar nuevo domicilio con id 11
INSERT INTO `domicilio` (
    `id`, `eliminado`, `calle`, `codigo_postal`, `detalles`,
    `nro_departamento`, `numero`, `piso`, `localidad_id`
) VALUES (
             11, b'0', 'Espejo', 5501, 'Entrada lateral', NULL, 456, NULL, 2
         );

-- Insertar la empresa 'El Buen Sabor'
INSERT INTO `empresa` (`id`, `eliminado`, `cuil`, `nombre`, `razon_social`) VALUES
    (1, b'0', 20304050607, 'El Buen Sabor', 'El Buen Sabor S.A.');

-- Insertar la sucursal para 'El Buen Sabor'
INSERT INTO `sucursal` (`id`, `eliminado`, `casa_matriz`, `horario_apertura`, `horario_cierre`, `nombre`, `domicilio_id`, `empresa_id`) VALUES
    (1, b'0', b'1', '20:00:00', '00:00:00', 'Casa Central', 9, 1);
-- Insertar nueva sucursal que usa el domicilio 11
INSERT INTO `sucursal` (
    `id`, `eliminado`, `casa_matriz`, `horario_apertura`,
    `horario_cierre`, `nombre`, `domicilio_id`, `empresa_id`
) VALUES (
             2, b'0', b'0', '10:00:00', '18:00:00', 'Sucursal Este', 11, 1
         );
-- EMPLEADO
INSERT INTO EMPLEADO VALUES
                         (1, FALSE, 'Gómez', '1990-05-12', 'Ana', '2611111111', 1, 1, 1),
                         (2, FALSE, 'Pérez', '1985-03-20', 'Luis', '2612222222', 2, 1, 2),
                         (3, FALSE, 'Rodríguez', '1992-08-30', 'Marta', '2613333333', 3, 1,3),
                         (4, FALSE, 'Fernández', '1995-11-11', 'Carlos', '2614444444', 4, 1, 4),
                         (5, FALSE,  'Diaz','2009-02-11','Franco','124115',5, 1, 6);

-- CLIENTE
insert  into `cliente`(`id`,`eliminado`,`apellido`,`fecha_nacimiento`,`nombre`,`telefono`,`usuario_id`) values (1,'\0','Ramírez','2000-01-01','Juan','2615555555',5),(2,'\0','Diz','1999-06-09','Luis','121233223213',7),(3,'\0','Power','2000-02-03','Max','214214224',8);

-- CLIENTE_DOMICILIO (cliente con múltiples domicilios)
insert  into `cliente_domicilio`(`cliente_id`,`domicilio_id`) values (1,6),(1,7),(2,8),(3,9);

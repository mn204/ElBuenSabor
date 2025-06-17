USE buen_sabor2;
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
insert  into `usuario`(`id`,`eliminado`,`dni`,`email`,`firebase_uid`,`photo_url`,`provider_id`,`rol`) values (1,'\0','123123','admin@buensa.com','0wT1WSonPZfdiXIoceu2imy7GJ53','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg','password','ADMINISTRADOR'),(2,'\0','123','cajero@buensa.com','IvLNrda6CkPiT7uqp3DfpguF6rZ2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221580/hirlalizap8uluw3sa1u.jpg','password','CAJERO'),(3,'\0','1234','cocinero@buensa.com','FBOrztuIpidGMVcJRRmsWDfbNf83','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221678/pkfdcanbungp7lpx75xo.jpg','password','COCINERO'),(4,'\0','12345','delivery@buensa.com','aqi54XpX0wgvG3jhIkSSukDg7Yx2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221617/l42s8t31mivewaalmmuq.jpg','password','DELIVERY'),(5,'\0','4334343','clientebuensabor@gmail.com','iGbZZStqjWUk90E76IT5moscPY83','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749220817/yekjwtrrthcqf3thhu3c.jpg','password','CLIENTE'),(6,'\0','12121242','mln204manutup@gmail.com','70oXKoe8CyePy3dFYy7P9SRjGwJ3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg','password','ADMINISTRADOR'),(7,'\0','4223232','luis@hotmail.com','h8stw8x2WJYlcPTj7MuC56YmeNE3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528593/owc3hsdwd921vcsi7omj.jpg','password','CLIENTE'),(8,'\0','24124122','max@hotmail.com','0AqJQjapRXYZ2LmX95XeXFib9ev2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528768/si6msmbtkcefciwl67nc.jpg','password','CLIENTE'),(9,'\0','352352352','cajero2@buensa.com','clRULtoXc2Y0k7ktwxMv3fl4GwB3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684037/twa80xmen526tw6m0x1v.jpg','password','CAJERO'),(10,'\0','35235212','cocinero2@buensa.com','yLZ4RNYOhkclKOxSpIyu0k73NHh2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684164/mouigwtcixvoxwvg5qik.jpg','password','COCINERO'),(11,'\0','5353333','delivery2@buensa.com','CKmR6qiscncNxSQ8VzsY5HnzZTb2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684294/im76ozgpqzauqrvkfono.jpg','password','DELIVERY');
-- DOMICILIO

insert  into `domicilio`(`id`,`eliminado`,`calle`,`codigo_postal`,`detalles`,`nro_departamento`,`numero`,`piso`,`localidad_id`) values (1,'\0','Baez',5500,'detalles','23',209,'1',3),(2,'\0','Lar',5503,'depto','',122,'',2),(3,'\0','San Martín',5515,'casa',NULL,154,NULL,5),(4,'\0','Belgrano',5501,NULL,'B',301,'3',7),(5,'\0','Peru',5500,'Casa',NULL,123,'',1),(6,'\0','Chile',5500,'Casa',NULL,883,'',1),(7,'\0','Rivadavia',5500,'Depto','2',777,'1',1),(8,'\0','Paraguay',5501,'Casa vieja',NULL,1281,'',2),(9,'\0','Rivadavia',5502,'Casa Central',NULL,208,'1',2),(10,'\0','Av. Libertador',5500,'Frente a la plaza',NULL,1234,NULL,1),(11,'\0','Espejo',5501,'Casa Este',NULL,456,NULL,2),(12,'\0','Dorrego',5235,'casa',NULL,212,'',3),(13,'\0','Moron',3523,'Depto',NULL,322,'1',2),(14,'\0','Victoria',5503,'casa',NULL,700,'',3),(15,'\0','Colombia',5500,'depto','1',1151,'2',2);

-- Insertar la empresa 'El Buen Sabor'
INSERT INTO `empresa` (`id`, `eliminado`, `cuil`, `nombre`, `razon_social`) VALUES
    (1, b'0', 20304050607, 'El Buen Sabor', 'El Buen Sabor S.A.');

-- Insertar la sucursal para 'El Buen Sabor'
insert  into `sucursal`(`id`,`eliminado`,`casa_matriz`,`horario_apertura`,`horario_cierre`,`nombre`,`domicilio_id`,`empresa_id`) values (1,'\0','','20:00:00.000000','00:00:00.000000','Casa Central',9,1),(2,'\0','\0','10:00:00.000000','18:00:00.000000','Sucursal Este',11,1);

-- EMPLEADO
insert  into `empleado`(`id`,`eliminado`,`apellido`,`fecha_nacimiento`,`nombre`,`telefono`,`domicilio_id`,`sucursal_id`,`usuario_id`) values (1,'\0','Gómez','1990-05-12','Ana','2611111111',1,null,1),(2,'\0','Pérez','1985-03-20','Luis','2612222222',2,1,2),(3,'\0','Rodríguez','1992-08-30','Marta','2613333333',3,1,3),(4,'\0','Fernández','1995-11-11','Carlos','2614444444',4,1,4),(5,'\0','Diaz','2009-02-11','Franco','124115',5,null,6),(6,'\0','Baez','2025-06-01','Carlos','52352352',12,2,9),(7,'\0','Martin','2025-06-03','Lucas','2621633323',13,2,10),(8,'\0','Diaz','2025-06-01','Matias','23523331',14,2,11);

-- CLIENTE
insert  into `cliente`(`id`,`eliminado`,`apellido`,`fecha_nacimiento`,`nombre`,`telefono`,`usuario_id`) values (1,'\0','Ramírez','2000-01-01','Juan','2615555555',5),(2,'\0','Diz','1999-06-09','Luis','121233223213',7),(3,'\0','Power','2000-02-03','Max','214214224',8);

-- CLIENTE_DOMICILIO (cliente con múltiples domicilios)
insert  into `cliente_domicilio`(`cliente_id`,`domicilio_id`) values (1,6),(1,7),(2,8),(3,15);


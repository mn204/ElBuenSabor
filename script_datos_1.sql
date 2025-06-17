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
insert  into `usuario`(`id`,`eliminado`,`dni`,`email`,`firebase_uid`,`photo_url`,`provider_id`,`rol`) values (1,'\0','123123','admin@buensa.com','0wT1WSonPZfdiXIoceu2imy7GJ53','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg','password','ADMINISTRADOR'),(2,'\0','123','cajero@buensa.com','IvLNrda6CkPiT7uqp3DfpguF6rZ2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221580/hirlalizap8uluw3sa1u.jpg','password','CAJERO'),(3,'\0','1234','cocinero@buensa.com','FBOrztuIpidGMVcJRRmsWDfbNf83','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750183674/cliente5_g8duef.jpg','password','COCINERO'),(4,'\0','12345','delivery@buensa.com','aqi54XpX0wgvG3jhIkSSukDg7Yx2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221617/l42s8t31mivewaalmmuq.jpg','password','DELIVERY'),(5,'\0','4334343','clientebuensabor@gmail.com','iGbZZStqjWUk90E76IT5moscPY83','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749220817/yekjwtrrthcqf3thhu3c.jpg','password','CLIENTE'),(6,'\0','12121242','mln204manutup@gmail.com','70oXKoe8CyePy3dFYy7P9SRjGwJ3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg','password','ADMINISTRADOR'),(7,'\0','4223232','luis@hotmail.com','h8stw8x2WJYlcPTj7MuC56YmeNE3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528593/owc3hsdwd921vcsi7omj.jpg','password','CLIENTE'),(8,'\0','24124122','max@hotmail.com','0AqJQjapRXYZ2LmX95XeXFib9ev2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750183674/cliente5_g8duef.jpg','password','CLIENTE'),(9,'\0','352352352','cajero2@buensa.com','clRULtoXc2Y0k7ktwxMv3fl4GwB3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684037/twa80xmen526tw6m0x1v.jpg','password','CAJERO'),(10,'\0','35235212','cocinero2@buensa.com','yLZ4RNYOhkclKOxSpIyu0k73NHh2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684164/mouigwtcixvoxwvg5qik.jpg','password','COCINERO'),(11,'\0','5353333','delivery2@buensa.com','CKmR6qiscncNxSQ8VzsY5HnzZTb2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684294/im76ozgpqzauqrvkfono.jpg','password','DELIVERY'),(12,'\0','35241789','carlos@hotmail.com','uxqVu9wzYmRPOsDmBBWmRVkIAby1','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749220817/yekjwtrrthcqf3thhu3c.jpg','password','CLIENTE'),(13,'\0','28456123','maria@gmail.com','zmk9xKBkBvMOO0NI8NRj17wRilY2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749485887/d3og9cncjprk9p6fvbfv.png','password','CLIENTE'),(14,'\0','31789456','jose@hotmail.com','Qe26cnhukIPDTbYeVNelgWl8udI2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528768/si6msmbtkcefciwl67nc.jpg','password','CLIENTE'),(15,'\0','29876543','ana@yahoo.com','0RfrxMIOdNavH9C27DrURQZZ7ix2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750183674/cliente5_g8duef.jpg','password','CLIENTE'),(16,'\0','33654789','pedro@gmail.com','RjCoqa8E30T93vq4DmnEFlklf793','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528593/owc3hsdwd921vcsi7omj.jpg','password','CLIENTE'),(17,'\0','27543216','lucia@hotmail.com','RvlK3I6kWWQ2LYJESOJFThCrSYu2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750183674/cliente5_g8duef.jpg','password','CLIENTE'),(18,'\0','30987654','diego@gmail.com','fWqmuOVrNxb2F4css1hQ7nkkke63','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749485887/d3og9cncjprk9p6fvbfv.png','password','CLIENTE'),(19,'\0','32147896','sofia@yahoo.com','bZcPf2jHJbMIF0H9hy1pK6AhzN43','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750183402/cliente4_yshvel.jpg','password','CLIENTE'),(20,'\0','28741963','martin@hotmail.com','wiGBUpxohkTTVwEUwlonHJR854E2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528768/si6msmbtkcefciwl67nc.jpg','password','CLIENTE'),(21,'\0','31456789','laura@gmail.com','onqCENvCorcUiXCQLDtCjX7nGsy2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528593/owc3hsdwd921vcsi7omj.jpg','password','CLIENTE'),(22,'\0','29632147','pablo@hotmail.com','DvAxKEAjlLTgMtYQlPHn5wuHEV92','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750183402/cliente4_yshvel.jpg','password','CLIENTE'),(23,'\0','33258741','carla@yahoo.com','X5c1nqTSduZoRmOV2ZzOqprbX172','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750183402/cliente4_yshvel.jpg','password','CLIENTE');
-- DOMICILIO

insert  into `domicilio`(`id`,`eliminado`,`calle`,`codigo_postal`,`detalles`,`nro_departamento`,`numero`,`piso`,`localidad_id`) values (1,'\0','Baez',5500,'detalles','23',209,'1',3),(2,'\0','Lar',5503,'depto','',122,'',2),(3,'\0','San Martín',5515,'casa',NULL,154,NULL,5),(4,'\0','Belgrano',5501,NULL,'B',301,'3',7),(5,'\0','Peru',5500,'Casa',NULL,123,'',1),(6,'\0','Chile',5500,'Casa',NULL,883,'',1),(7,'\0','Rivadavia',5500,'Depto','2',777,'1',1),(8,'\0','Paraguay',5501,'Casa vieja',NULL,1281,'',2),(9,'\0','Rivadavia',5502,'Casa Central',NULL,208,'1',2),(10,'\0','Av. Libertador',5500,'Frente a la plaza',NULL,1234,NULL,1),(11,'\0','Espejo',5501,'Casa Este',NULL,456,NULL,2),(12,'\0','Dorrego',5235,'casa',NULL,212,'',3),(13,'\0','Moron',3523,'Depto',NULL,322,'1',2),(14,'\0','Victoria',5503,'casa',NULL,700,'',3),(15,'\0','Colombia',5500,'depto','1',1151,'2',2),(16,'\0','Las Heras',5500,NULL,NULL,1250,NULL,1),(17,'\0','Garibaldi',5519,NULL,NULL,850,NULL,3),(18,'\0','Urquiza',5501,NULL,'A',520,'2',2),(19,'\0','Emilio Civit',5500,NULL,NULL,980,NULL,1),(20,'\0','Carril Nacional',5507,NULL,NULL,2100,NULL,4),(21,'\0','Aristides Villanueva',5500,NULL,NULL,345,NULL,1),(22,'\0','Mitre',5515,NULL,NULL,670,NULL,5),(23,'\0','Azcuenaga',5519,NULL,'B',890,'1',3),(24,'\0','Pedro Molina',5501,NULL,NULL,1456,NULL,2),(25,'\0','Acceso Este',5507,NULL,NULL,3200,NULL,4),(26,'\0','Godoy Cruz',5500,NULL,NULL,756,NULL,1),(27,'\0','Bandera de Los Andes',5515,NULL,NULL,1890,NULL,5);

-- Insertar la empresa 'El Buen Sabor'
INSERT INTO `empresa` (`id`, `eliminado`, `cuil`, `nombre`, `razon_social`) VALUES
    (1, b'0', 20304050607, 'El Buen Sabor', 'El Buen Sabor S.A.');

-- Insertar la sucursal para 'El Buen Sabor'
insert  into `sucursal`(`id`,`eliminado`,`casa_matriz`,`horario_apertura`,`horario_cierre`,`nombre`,`domicilio_id`,`empresa_id`) values (1,'\0','','00:01:00.000000','00:00:00.000000','Casa Central',9,1),(2,'\0','\0','10:00:00.000000','18:00:00.000000','Sucursal Este',11,1);

-- EMPLEADO
insert  into `empleado`(`id`,`eliminado`,`apellido`,`fecha_nacimiento`,`nombre`,`telefono`,`domicilio_id`,`sucursal_id`,`usuario_id`) values (1,'\0','Gómez','1990-05-12','Ana','2611111111',1,null,1),(2,'\0','Pérez','1985-03-20','Luis','2612222222',2,1,2),(3,'\0','Rodríguez','1992-08-30','Marta','2613333333',3,1,3),(4,'\0','Fernández','1995-11-11','Carlos','2614444444',4,1,4),(5,'\0','Diaz','2009-02-11','Franco','124115',5,null,6),(6,'\0','Baez','2025-06-01','Carlos','52352352',12,2,9),(7,'\0','Martin','2025-06-03','Lucas','2621633323',13,2,10),(8,'\0','Diaz','2025-06-01','Matias','23523331',14,2,11);

-- CLIENTE
insert  into `cliente`(`id`,`eliminado`,`apellido`,`fecha_nacimiento`,`nombre`,`telefono`,`usuario_id`) values (1,'\0','Ramírez','2000-01-01','Juan','2615555555',5),(2,'\0','Diz','1999-06-09','Luis','121233223213',7),(3,'\0','Power','2000-02-03','Max','214214224',8),(4,'\0','González','1985-03-15','Carlos','2614567890',12),(5,'\0','Fernández','1992-07-22','María','2615678901',13),(6,'\0','Martínez','1988-11-08','José','2614789012',14),(7,'\0','López','1995-01-30','Ana','2615890123',15),(8,'\0','García','1983-09-14','Pedro','2614901234',16),(9,'\0','Rodríguez','1990-05-12','Lucía','2615012345',17),(10,'\0','Sánchez','1987-12-03','Diego','2614123456',18),(11,'\0','Pérez','1993-04-27','Sofía','2615234567',19),(12,'\0','Torres','1986-08-19','Martín','2614345678',20),(13,'\0','Flores','1991-10-16','Laura','2615456789',21),(14,'\0','Morales','1989-02-05','Pablo','2614567890',22),(15,'\0','Vargas','1994-06-11','Carla','2615678901',23);

-- CLIENTE_DOMICILIO (cliente con múltiples domicilios)
insert  into `cliente_domicilio`(`cliente_id`,`domicilio_id`) values (1,6),(1,7),(2,8),(3,15),(4,16),(5,17),(6,18),(7,19),(8,20),(9,21),(10,22),(11,23),(12,24),(13,25),(14,26),(15,27);

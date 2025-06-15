/*
SQLyog Community v12.4.0 (64 bit)
MySQL - 10.4.32-MariaDB : Database - buen_sabor
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;
/*!40101 SET SQL_MODE=''*/;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

USE `buen_sabor2`;

-- 1. TABLAS BASE (sin dependencias)

-- Datos para la tabla `pais`
INSERT INTO `pais`(`id`,`eliminado`,`nombre`) VALUES
    (1,'\0','Argentina');

-- Datos para la tabla `provincia`
INSERT INTO `provincia`(`id`,`eliminado`,`nombre`,`pais_id`) VALUES
                                                                 (1,'\0','Buenos Aires',1),
                                                                 (2,'\0','Catamarca',1),
                                                                 (3,'\0','Chaco',1),
                                                                 (4,'\0','Chubut',1),
                                                                 (5,'\0','Córdoba',1),
                                                                 (6,'\0','Corrientes',1),
                                                                 (7,'\0','Entre Ríos',1),
                                                                 (8,'\0','Formosa',1),
                                                                 (9,'\0','Jujuy',1),
                                                                 (10,'\0','La Pampa',1),
                                                                 (11,'\0','La Rioja',1),
                                                                 (12,'\0','Mendoza',1),
                                                                 (13,'\0','Misiones',1),
                                                                 (14,'\0','Neuquén',1),
                                                                 (15,'\0','Río Negro',1),
                                                                 (16,'\0','Salta',1),
                                                                 (17,'\0','San Juan',1),
                                                                 (18,'\0','San Luis',1),
                                                                 (19,'\0','Santa Cruz',1),
                                                                 (20,'\0','Santa Fe',1),
                                                                 (21,'\0','Santiago del Estero',1),
                                                                 (22,'\0','Tierra del Fuego',1),
                                                                 (23,'\0','Tucumán',1),
                                                                 (24,'\0','CABA',1);

-- Datos para la tabla `localidad`
INSERT INTO `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) VALUES
                                                                      (1,'\0','Mendoza',12),
                                                                      (2,'\0','Godoy Cruz',12),
                                                                      (3,'\0','Guaymallén',12),
                                                                      (4,'\0','Maipú',12),
                                                                      (5,'\0','Las Heras',12),
                                                                      (6,'\0','Luján de Cuyo',12),
                                                                      (7,'\0','San Rafael',12),
                                                                      (8,'\0','General Alvear',12),
                                                                      (9,'\0','Malargüe',12),
                                                                      (10,'\0','Rivadavia',12),
                                                                      (11,'\0','San Martín',12),
                                                                      (12,'\0','Tunuyán',12),
                                                                      (13,'\0','Tupungato',12),
                                                                      (14,'\0','San Carlos',12),
                                                                      (15,'\0','Lavalle',12),
                                                                      (16,'\0','Santa Rosa',12),
                                                                      (17,'\0','Junín',12),
                                                                      (18,'\0','La Paz',12);

-- Datos para la tabla `domicilio`
INSERT INTO `domicilio`(`id`,`eliminado`,`calle`,`codigo_postal`,`detalles`,`nro_departamento`,`numero`,`piso`,`localidad_id`) VALUES
                                                                                                                                   (1,'\0','Baez',5500,'detalles','23',209,'1',3),
                                                                                                                                   (2,'\0','Lar',5503,'depto','',122,'',2),
                                                                                                                                   (3,'\0','San Martín',5515,'casa',NULL,154,NULL,5),
                                                                                                                                   (4,'\0','Belgrano',5501,NULL,'B',301,'3',7),
                                                                                                                                   (5,'\0','Peru',5500,'Casa',NULL,123,'',1),
                                                                                                                                   (6,'\0','Chile',5500,'Casa',NULL,209,'',1),
                                                                                                                                   (7,'\0','Mitre',5500,'Depto','26',300,'1',1),
                                                                                                                                   (8,'\0','Massa',5508,'Casa vieja',NULL,232,'',4),
                                                                                                                                   (9,'\0','Rivadavia',5502,'Casa Central',NULL,208,'1',2),
                                                                                                                                   (10,'\0','Av. Libertador',5500,'Frente a la plaza',NULL,1234,NULL,1),
                                                                                                                                   (11,'\0','Espejo',5501,'Entrada lateral',NULL,456,NULL,2),
                                                                                                                                   (12,'\0','Dorrego',5235,'casa',NULL,212,'',3),
                                                                                                                                   (13,'\0','Moron',3523,'Depto',NULL,322,'1',2),
                                                                                                                                   (14,'\0','Victoria',5503,'casa',NULL,700,'',3);

-- Datos para la tabla `empresa`
INSERT INTO `empresa`(`id`,`eliminado`,`cuil`,`nombre`,`razon_social`) VALUES
    (1,'\0',20304050607,'El Buen Sabor','El Buen Sabor S.A.');

-- Datos para la tabla `sucursal`
INSERT INTO `sucursal`(`id`,`eliminado`,`casa_matriz`,`horario_apertura`,`horario_cierre`,`nombre`,`domicilio_id`,`empresa_id`) VALUES
                                                                                                                                    (1,'\0','','20:00:00.000000','00:00:00.000000','Casa Central',9,1),
                                                                                                                                    (2,'\0','\0','10:00:00.000000','18:00:00.000000','Sucursal Este',11,1);

-- Datos para la tabla `usuario`
INSERT INTO `usuario`(`id`,`eliminado`,`dni`,`email`,`firebase_uid`,`photo_url`,`provider_id`,`rol`) VALUES
                                                                                                         (1,'\0','123123','admin@buensa.com','0wT1WSonPZfdiXIoceu2imy7GJ53','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg','password','ADMINISTRADOR'),
                                                                                                         (2,'\0','123','cajero@buensa.com','IvLNrda6CkPiT7uqp3DfpguF6rZ2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221580/hirlalizap8uluw3sa1u.jpg','password','CAJERO'),
                                                                                                         (3,'\0','1234','cocinero@buensa.com','FBOrztuIpidGMVcJRRmsWDfbNf83','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221678/pkfdcanbungp7lpx75xo.jpg','password','COCINERO'),
                                                                                                         (4,'\0','12345','delivery@buensa.com','aqi54XpX0wgvG3jhIkSSukDg7Yx2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221617/l42s8t31mivewaalmmuq.jpg','password','DELIVERY'),
                                                                                                         (5,'\0','4334343','juan@hotmail.com','v1E2gY1G90MlcrqT3jefJBSMVhf1','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749220817/yekjwtrrthcqf3thhu3c.jpg','password','CLIENTE'),
                                                                                                         (6,'\0','12121242','mln204manutup@gmail.com','70oXKoe8CyePy3dFYy7P9SRjGwJ3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg','password','ADMINISTRADOR'),
                                                                                                         (7,'\0','4223232','luis@hotmail.com','h8stw8x2WJYlcPTj7MuC56YmeNE3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528593/owc3hsdwd921vcsi7omj.jpg','password','CLIENTE'),
                                                                                                         (8,'\0','24124122','max@hotmail.com','0AqJQjapRXYZ2LmX95XeXFib9ev2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528768/si6msmbtkcefciwl67nc.jpg','password','CLIENTE'),
                                                                                                         (9,'\0','352352352','cajero2@buensa.com','clRULtoXc2Y0k7ktwxMv3fl4GwB3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684037/twa80xmen526tw6m0x1v.jpg','password','CAJERO'),
                                                                                                         (10,'\0','35235212','cocinero2@buensa.com','yLZ4RNYOhkclKOxSpIyu0k73NHh2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684164/mouigwtcixvoxwvg5qik.jpg','password','COCINERO'),
                                                                                                         (11,'\0','5353333','delivery2@buensa.com','CKmR6qiscncNxSQ8VzsY5HnzZTb2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684294/im76ozgpqzauqrvkfono.jpg','password','DELIVERY');

-- 2. TABLAS DEPENDIENTES DE USUARIO

-- Datos para la tabla `empleado`
INSERT INTO `empleado`(`id`,`eliminado`,`apellido`,`fecha_nacimiento`,`nombre`,`telefono`,`domicilio_id`,`sucursal_id`,`usuario_id`) VALUES
                                                                                                                                         (1,'\0','Gómez','1990-05-12','Ana','2611111111',1,NULL,1),
                                                                                                                                         (2,'\0','Pérez','1985-03-20','Luis','2612222222',2,1,2),
                                                                                                                                         (3,'\0','Rodríguez','1992-08-30','Marta','2613333333',3,1,3),
                                                                                                                                         (4,'\0','Fernández','1995-11-11','Carlos','2614444444',4,1,4),
                                                                                                                                         (5,'\0','Diaz','2009-02-11','Franco','124115',5,NULL,6),
                                                                                                                                         (6,'\0','Baez','2025-06-01','Carlos','52352352',12,2,9),
                                                                                                                                         (7,'\0','Martin','2025-06-03','Lucas','2621633323',13,2,10),
                                                                                                                                         (8,'\0','Diaz','2025-06-01','Matias','23523331',14,2,11);

-- Datos para la tabla `cliente`
INSERT INTO `cliente`(`id`,`eliminado`,`apellido`,`fecha_nacimiento`,`nombre`,`telefono`,`usuario_id`) VALUES
                                                                                                           (1,'\0','Ramírez','2000-01-01','Juan','2615555555',5),
                                                                                                           (2,'\0','Diz','1999-06-09','Luis','121233223213',7),
                                                                                                           (3,'\0','Power','2000-02-03','Max','214214224',8);

-- Datos para la tabla `cliente_domicilio`
INSERT INTO `cliente_domicilio`(`cliente_id`,`domicilio_id`) VALUES
                                                                 (1,6),
                                                                 (1,7),
                                                                 (2,8),
                                                                 (3,9);

-- 3. TABLAS DE CATEGORÍAS Y UNIDADES

-- Datos para la tabla `categoria`
INSERT INTO `categoria`(`id`,`eliminado`,`denominacion`,`categoria_padre_id`) VALUES
                                                                                  (1,'\0','Hamburguesa',NULL),
                                                                                  (2,'\0','Panificado',NULL),
                                                                                  (3,'\0','Vegetal',NULL),
                                                                                  (4,'\0','Carne',NULL),
                                                                                  (5,'\0','Molida',4);

-- Datos para la tabla `unidad_medida`
INSERT INTO `unidad_medida`(`id`,`eliminado`,`denominacion`) VALUES
                                                                 (1,'\0','Unidad'),
                                                                 (2,'\0','Litro'),
                                                                 (3,'\0','Kilogramo'),
                                                                 (4,'\0','Gramo');

-- 4. TABLAS DE STOCK

-- Datos para la tabla `sucursal_insumo`
INSERT INTO `sucursal_insumo`(`id`,`eliminado`,`stock_actual`,`stock_maximo`,`stock_minimo`,`sucursal_id`) VALUES
                                                                                                               (1,'\0',54,100,1,1),
                                                                                                               (2,'\0',63,100,1,1),
                                                                                                               (3,'\0',56,100,1,1);

-- 5. TABLAS DE ARTÍCULOS

-- Datos para la tabla `articulo`
INSERT INTO `articulo`(`tipo_articulo`,`id`,`eliminado`,`denominacion`,`precio_venta`,`categoria_id`,`unidad_medida_id`) VALUES
                                                                                                                             ('Insumo',2,'\0','Pan',120,2,1),
                                                                                                                             ('Insumo',3,'\0','Tomate',80,3,1),
                                                                                                                             ('ArticuloManufacturado',7,'\0','Hamburguesa Completa',12432,1,1),
                                                                                                                             ('Insumo',8,'\0','Coca Cola',1,1,1),
                                                                                                                             ('ArticuloManufacturado',9,'\0','Hamburguesa Simple',985.6,1,1);

-- Datos para la tabla `articulo_insumo`
INSERT INTO `articulo_insumo`(`es_para_elaborar`,`precio_compra`,`id`,`sucursal_insumo_id`) VALUES
                                                                                                ('',70,2,1),
                                                                                                ('',120,3,3),
                                                                                                ('\0',0,8,2);

-- Datos para la tabla `articulo_manufacturado`
INSERT INTO `articulo_manufacturado`(`descripcion`,`preparacion`,`tiempo_estimado_minutos`,`id`) VALUES
                                                                                                     ('Hamburguesa Completa','Hamburguesa Completa',12,7),
                                                                                                     ('Hamburguesa Simple','Hamburguesa Simple',12,9);

-- Datos para la tabla `detalle_articulo_manufacturado`
INSERT INTO `detalle_articulo_manufacturado`(`id`,`eliminado`,`cantidad`,`articulo_insumo_id`,`articulo_manufacturado_id`) VALUES
                                                                                                                               (6,'\0',11,3,9),
                                                                                                                               (8,'\0',21,3,7),
                                                                                                                               (13,'\0',23,2,7);

-- Datos para la tabla `imagen_articulo`
INSERT INTO `imagen_articulo`(`id`,`eliminado`,`denominacion`,`articulo_id`) VALUES
                                                                                 (5,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749751215/vnrtgk9bsg4ns5v305wu.jpg',7),
                                                                                 (6,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749761487/jxdtsjva4figlzppvlgw.jpg',9),
                                                                                 (9,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749777002/uded2xbje29krd01incp.webp',8);

-- 6. TABLAS DE PEDIDOS


-- Restaurar configuraciones
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
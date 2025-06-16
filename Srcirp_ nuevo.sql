-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: buen_sabor2
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `articulo`
--

DROP TABLE IF EXISTS `articulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articulo` (
  `tipo_articulo` varchar(31) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `denominacion` varchar(255) DEFAULT NULL,
  `precio_venta` double DEFAULT NULL,
  `categoria_id` bigint(20) DEFAULT NULL,
  `unidad_medida_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK35xlp590328eybh2pf5ublsne` (`categoria_id`),
  KEY `FKlf2hbqm1r4qx36lkr0b4mix6b` (`unidad_medida_id`),
  CONSTRAINT `FK35xlp590328eybh2pf5ublsne` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`),
  CONSTRAINT `FKlf2hbqm1r4qx36lkr0b4mix6b` FOREIGN KEY (`unidad_medida_id`) REFERENCES `unidad_medida` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articulo`
--

LOCK TABLES `articulo` WRITE;
/*!40000 ALTER TABLE `articulo` DISABLE KEYS */;
INSERT INTO `articulo` VALUES ('Insumo',2,_binary '\0','Pan',120,2,1),('Insumo',3,_binary '\0','Tomate',80,3,1),('ArticuloManufacturado',7,_binary '\0','Hamburguesa Completa',12432,1,1),('Insumo',8,_binary '\0','Coca Cola',1,1,1),('ArticuloManufacturado',9,_binary '\0','Hamburguesa Simple',985.6,1,1),('ArticuloManufacturado',10,_binary '\0','Pizza Muzzarella',1600,1,1),('ArticuloManufacturado',11,_binary '\0','Lomito Completo',2100,1,1),('Insumo',12,_binary '\0','Queso',200,3,4),('Insumo',13,_binary '\0','Orégano',50,3,4),('Insumo',14,_binary '\0','Carne',800,4,3),('Insumo',15,_binary '\0','Pan de Lomito',100,2,1),('Insumo',16,_binary '\0','Cebolla',60,3,4);
/*!40000 ALTER TABLE `articulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articulo_insumo`
--

DROP TABLE IF EXISTS `articulo_insumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articulo_insumo` (
  `es_para_elaborar` bit(1) DEFAULT NULL,
  `precio_compra` double DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK5yoloai8ewly5lkbi3wl5904y` FOREIGN KEY (`id`) REFERENCES `articulo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articulo_insumo`
--

LOCK TABLES `articulo_insumo` WRITE;
/*!40000 ALTER TABLE `articulo_insumo` DISABLE KEYS */;
INSERT INTO `articulo_insumo` VALUES (_binary '',180,12),(_binary '\0',40,13),(_binary '',750,14),(_binary '\0',90,15),(_binary '\0',50,16);
/*!40000 ALTER TABLE `articulo_insumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articulo_manufacturado`
--

DROP TABLE IF EXISTS `articulo_manufacturado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articulo_manufacturado` (
  `descripcion` varchar(255) DEFAULT NULL,
  `preparacion` varchar(255) DEFAULT NULL,
  `tiempo_estimado_minutos` int(11) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK9t82oibyduo62wci8y6gfpllx` FOREIGN KEY (`id`) REFERENCES `articulo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articulo_manufacturado`
--

LOCK TABLES `articulo_manufacturado` WRITE;
/*!40000 ALTER TABLE `articulo_manufacturado` DISABLE KEYS */;
INSERT INTO `articulo_manufacturado` VALUES ('Hamburguesa Completa','Hamburguesa Completa',12,7),('Hamburguesa Simple','Hamburguesa Simple',12,9),('Pizza con salsa, muzzarella y orégano','Hornear a 250° durante 10 minutos',15,10),('Lomito con pan, carne, lechuga y tomate','Cocinar carne y armar lomito',12,11);
/*!40000 ALTER TABLE `articulo_manufacturado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `denominacion` varchar(255) DEFAULT NULL,
  `url_imagen` varchar(255) DEFAULT NULL,
  `categoria_padre_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKif4f273okqr2edqkm0xqxjlyk` (`categoria_padre_id`),
  CONSTRAINT `FKif4f273okqr2edqkm0xqxjlyk` FOREIGN KEY (`categoria_padre_id`) REFERENCES `categoria` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,_binary '\0','Hamburguesa',NULL,NULL),(2,_binary '\0','Panificado',NULL,NULL),(3,_binary '\0','Vegetal',NULL,NULL),(4,_binary '\0','Carne',NULL,NULL),(5,_binary '\0','Molida',NULL,4);
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `usuario_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKid7jmosqg8hkqiqw4vf50xipm` (`usuario_id`),
  CONSTRAINT `FKc3u631ocxdrtm3ccpme0kjlmu` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,_binary '\0','Ramírez','2000-01-01','Juan','2615555555',5),(2,_binary '\0','Diz','1999-06-09','Luis','121233223213',7),(3,_binary '\0','Power','2000-02-03','Max','214214224',8);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente_domicilio`
--

DROP TABLE IF EXISTS `cliente_domicilio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_domicilio` (
  `cliente_id` bigint(20) NOT NULL,
  `domicilio_id` bigint(20) NOT NULL,
  PRIMARY KEY (`cliente_id`,`domicilio_id`),
  KEY `FK7jkekc8ff2g28bthd4dd9d7r2` (`domicilio_id`),
  CONSTRAINT `FK7jkekc8ff2g28bthd4dd9d7r2` FOREIGN KEY (`domicilio_id`) REFERENCES `domicilio` (`id`),
  CONSTRAINT `FKr5fndm18tmwywoov7o2d0ofdl` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_domicilio`
--

LOCK TABLES `cliente_domicilio` WRITE;
/*!40000 ALTER TABLE `cliente_domicilio` DISABLE KEYS */;
INSERT INTO `cliente_domicilio` VALUES (1,6),(1,7),(2,8),(3,9);
/*!40000 ALTER TABLE `cliente_domicilio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_articulo_manufacturado`
--

DROP TABLE IF EXISTS `detalle_articulo_manufacturado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_articulo_manufacturado` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `cantidad` double DEFAULT NULL,
  `articulo_insumo_id` bigint(20) DEFAULT NULL,
  `articulo_manufacturado_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKl436b0100ar699y1x32u81p56` (`articulo_insumo_id`),
  KEY `FKfau4de9b09bbiwyw2710bs51w` (`articulo_manufacturado_id`),
  CONSTRAINT `FKfau4de9b09bbiwyw2710bs51w` FOREIGN KEY (`articulo_manufacturado_id`) REFERENCES `articulo_manufacturado` (`id`),
  CONSTRAINT `FKl436b0100ar699y1x32u81p56` FOREIGN KEY (`articulo_insumo_id`) REFERENCES `articulo_insumo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_articulo_manufacturado`
--

LOCK TABLES `detalle_articulo_manufacturado` WRITE;
/*!40000 ALTER TABLE `detalle_articulo_manufacturado` DISABLE KEYS */;
INSERT INTO `detalle_articulo_manufacturado` VALUES (6,_binary '\0',11,3,9),(8,_binary '\0',21,3,7),(13,_binary '\0',23,2,7),(18,_binary '\0',2,12,10),(19,_binary '\0',1,13,10),(20,_binary '\0',1,14,11),(21,_binary '\0',1,15,11),(22,_binary '\0',0.5,16,11);
/*!40000 ALTER TABLE `detalle_articulo_manufacturado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_pedido`
--

DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `sub_total` double DEFAULT NULL,
  `articulo_id` bigint(20) DEFAULT NULL,
  `pedido_id` bigint(20) DEFAULT NULL,
  `promocion_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKblwfjfeyou4u7hae0gcngweeu` (`articulo_id`),
  KEY `FKgqvba9e7dildyw45u0usdj1k2` (`pedido_id`),
  KEY `FKp7ro0fsxlx81qsh52y3oxyonk` (`promocion_id`),
  CONSTRAINT `FKblwfjfeyou4u7hae0gcngweeu` FOREIGN KEY (`articulo_id`) REFERENCES `articulo` (`id`),
  CONSTRAINT `FKgqvba9e7dildyw45u0usdj1k2` FOREIGN KEY (`pedido_id`) REFERENCES `pedido` (`id`),
  CONSTRAINT `FKp7ro0fsxlx81qsh52y3oxyonk` FOREIGN KEY (`promocion_id`) REFERENCES `promocion` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedido`
--

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
INSERT INTO `detalle_pedido` VALUES (1,_binary '\0',1,1600,10,1,NULL),(2,_binary '\0',2,3200,11,2,NULL),(3,_binary '\0',1,12432,7,3,NULL),(4,_binary '\0',1,985.6,9,4,NULL),(5,_binary '\0',2,3200,10,5,NULL),(6,_binary '\0',1,1600,11,6,NULL),(7,_binary '\0',2,3200,7,7,NULL),(8,_binary '\0',1,2100,10,8,NULL),(9,_binary '\0',1,1600,10,9,NULL),(10,_binary '\0',1,2100,11,10,NULL),(11,_binary '\0',1,985.6,9,11,NULL),(12,_binary '\0',1,12432,7,12,NULL),(13,_binary '\0',1,2100,11,13,NULL),(14,_binary '\0',1,1600,10,14,NULL),(15,_binary '\0',1,12432,7,15,NULL),(16,_binary '\0',1,2100,11,16,NULL),(17,_binary '\0',1,1700,NULL,17,1),(18,_binary '\0',1,1950,NULL,18,2),(19,_binary '\0',2,3200,10,19,NULL);
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_promocion`
--

DROP TABLE IF EXISTS `detalle_promocion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_promocion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `articulo_id` bigint(20) DEFAULT NULL,
  `promocion_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtll90irfap2qbro83wunsx9xc` (`articulo_id`),
  KEY `FKc7mv7i24hoyl49rof6yq8dhsj` (`promocion_id`),
  CONSTRAINT `FKc7mv7i24hoyl49rof6yq8dhsj` FOREIGN KEY (`promocion_id`) REFERENCES `promocion` (`id`),
  CONSTRAINT `FKtll90irfap2qbro83wunsx9xc` FOREIGN KEY (`articulo_id`) REFERENCES `articulo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_promocion`
--

LOCK TABLES `detalle_promocion` WRITE;
/*!40000 ALTER TABLE `detalle_promocion` DISABLE KEYS */;
INSERT INTO `detalle_promocion` VALUES (1,_binary '\0',1,10,1),(2,_binary '\0',1,8,1),(3,_binary '\0',1,11,2),(4,_binary '\0',1,8,2);
/*!40000 ALTER TABLE `detalle_promocion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domicilio`
--

DROP TABLE IF EXISTS `domicilio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domicilio` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `calle` varchar(255) DEFAULT NULL,
  `codigo_postal` int(11) DEFAULT NULL,
  `detalles` varchar(255) DEFAULT NULL,
  `nro_departamento` varchar(255) DEFAULT NULL,
  `numero` int(11) DEFAULT NULL,
  `piso` varchar(255) DEFAULT NULL,
  `localidad_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8t63gx4v022qapv45vdwld71j` (`localidad_id`),
  CONSTRAINT `FK8t63gx4v022qapv45vdwld71j` FOREIGN KEY (`localidad_id`) REFERENCES `localidad` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domicilio`
--

LOCK TABLES `domicilio` WRITE;
/*!40000 ALTER TABLE `domicilio` DISABLE KEYS */;
INSERT INTO `domicilio` VALUES (1,_binary '\0','Baez',5500,'detalles','23',209,'1',3),(2,_binary '\0','Lar',5503,'depto','',122,'',2),(3,_binary '\0','San Martín',5515,'casa',NULL,154,NULL,5),(4,_binary '\0','Belgrano',5501,NULL,'B',301,'3',7),(5,_binary '\0','Peru',5500,'Casa',NULL,123,'',1),(6,_binary '\0','Chile',5500,'Casa',NULL,209,'',1),(7,_binary '\0','Mitre',5500,'Depto','26',300,'1',1),(8,_binary '\0','Massa',5508,'Casa vieja',NULL,232,'',4),(9,_binary '\0','Rivadavia',5502,'Casa Central',NULL,208,'1',2),(10,_binary '\0','Av. Libertador',5500,'Frente a la plaza',NULL,1234,NULL,1),(11,_binary '\0','Espejo',5501,'Entrada lateral',NULL,456,NULL,2),(12,_binary '\0','Dorrego',5235,'casa',NULL,212,'',3),(13,_binary '\0','Moron',3523,'Depto',NULL,322,'1',2),(14,_binary '\0','Victoria',5503,'casa',NULL,700,'',3);
/*!40000 ALTER TABLE `domicilio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `domicilio_id` bigint(20) DEFAULT NULL,
  `sucursal_id` bigint(20) DEFAULT NULL,
  `usuario_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6ff36el6hfqwrtnvk0y9jd6sh` (`usuario_id`),
  KEY `FKaun16clkadg0ywuyq2ojb5rts` (`domicilio_id`),
  KEY `FKkv68lx8xpbpv6jprh7taieaej` (`sucursal_id`),
  CONSTRAINT `FKaun16clkadg0ywuyq2ojb5rts` FOREIGN KEY (`domicilio_id`) REFERENCES `domicilio` (`id`),
  CONSTRAINT `FKcvqmeghkabb4tt6472pabt2a4` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `FKkv68lx8xpbpv6jprh7taieaej` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (1,_binary '\0','Gómez','1990-05-12','Ana','2611111111',1,NULL,1),(2,_binary '\0','Pérez','1985-03-20','Luis','2612222222',2,1,2),(3,_binary '\0','Rodríguez','1992-08-30','Marta','2613333333',3,1,3),(4,_binary '\0','Fernández','1995-11-11','Carlos','2614444444',4,1,4),(5,_binary '\0','Diaz','2009-02-11','Franco','124115',5,NULL,6),(6,_binary '\0','Baez','2025-06-01','Carlos','52352352',12,2,9),(7,_binary '\0','Martin','2025-06-03','Lucas','2621633323',13,2,10),(8,_binary '\0','Diaz','2025-06-01','Matias','23523331',14,2,11);
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa`
--

DROP TABLE IF EXISTS `empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `cuil` bigint(20) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `razon_social` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa`
--

LOCK TABLES `empresa` WRITE;
/*!40000 ALTER TABLE `empresa` DISABLE KEYS */;
INSERT INTO `empresa` VALUES (1,_binary '\0',20304050607,'El Buen Sabor','El Buen Sabor S.A.');
/*!40000 ALTER TABLE `empresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagen_articulo`
--

DROP TABLE IF EXISTS `imagen_articulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagen_articulo` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `denominacion` varchar(255) DEFAULT NULL,
  `articulo_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKi4c9w006je0v5win1hk34jwks` (`articulo_id`),
  CONSTRAINT `FKi4c9w006je0v5win1hk34jwks` FOREIGN KEY (`articulo_id`) REFERENCES `articulo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagen_articulo`
--

LOCK TABLES `imagen_articulo` WRITE;
/*!40000 ALTER TABLE `imagen_articulo` DISABLE KEYS */;
INSERT INTO `imagen_articulo` VALUES (5,_binary '\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749751215/vnrtgk9bsg4ns5v305wu.jpg',7),(6,_binary '\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749761487/jxdtsjva4figlzppvlgw.jpg',9),(9,_binary '\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749777002/uded2xbje29krd01incp.webp',8);
/*!40000 ALTER TABLE `imagen_articulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagen_promocion`
--

DROP TABLE IF EXISTS `imagen_promocion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagen_promocion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `denominacion` varchar(255) DEFAULT NULL,
  `promocion_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfigh8y0s5beb3p1f7jaab8brr` (`promocion_id`),
  CONSTRAINT `FKfigh8y0s5beb3p1f7jaab8brr` FOREIGN KEY (`promocion_id`) REFERENCES `promocion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagen_promocion`
--

LOCK TABLES `imagen_promocion` WRITE;
/*!40000 ALTER TABLE `imagen_promocion` DISABLE KEYS */;
/*!40000 ALTER TABLE `imagen_promocion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `localidad`
--

DROP TABLE IF EXISTS `localidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `localidad` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `provincia_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK37mbpxuicwnbo878s9djjgr39` (`provincia_id`),
  CONSTRAINT `FK37mbpxuicwnbo878s9djjgr39` FOREIGN KEY (`provincia_id`) REFERENCES `provincia` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localidad`
--

LOCK TABLES `localidad` WRITE;
/*!40000 ALTER TABLE `localidad` DISABLE KEYS */;
INSERT INTO `localidad` VALUES (1,_binary '\0','Mendoza',12),(2,_binary '\0','Godoy Cruz',12),(3,_binary '\0','Guaymallén',12),(4,_binary '\0','Maipú',12),(5,_binary '\0','Las Heras',12),(6,_binary '\0','Luján de Cuyo',12),(7,_binary '\0','San Rafael',12),(8,_binary '\0','General Alvear',12),(9,_binary '\0','Malargüe',12),(10,_binary '\0','Rivadavia',12),(11,_binary '\0','San Martín',12),(12,_binary '\0','Tunuyán',12),(13,_binary '\0','Tupungato',12),(14,_binary '\0','San Carlos',12),(15,_binary '\0','Lavalle',12),(16,_binary '\0','Santa Rosa',12),(17,_binary '\0','Junín',12),(18,_binary '\0','La Paz',12);
/*!40000 ALTER TABLE `localidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pais`
--

DROP TABLE IF EXISTS `pais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pais` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pais`
--

LOCK TABLES `pais` WRITE;
/*!40000 ALTER TABLE `pais` DISABLE KEYS */;
INSERT INTO `pais` VALUES (1,_binary '\0','Argentina');
/*!40000 ALTER TABLE `pais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `estado` enum('CANCELADO','ENTREGADO','EN_DELIVERY','LISTO','PENDIENTE','PREPARACION') DEFAULT NULL,
  `fecha_pedido` datetime(6) DEFAULT NULL,
  `forma_pago` enum('EFECTIVO','MERCADOPAGO') DEFAULT NULL,
  `hora_estimada_finalizacion` time(6) DEFAULT NULL,
  `pagado` bit(1) NOT NULL,
  `tipo_envio` enum('DELIVERY','TAKEAWAY') DEFAULT NULL,
  `total` double DEFAULT NULL,
  `total_costo` double DEFAULT NULL,
  `cliente_id` bigint(20) DEFAULT NULL,
  `domicilio_id` bigint(20) DEFAULT NULL,
  `empleado_delivery_id` bigint(20) DEFAULT NULL,
  `sucursal_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK30s8j2ktpay6of18lbyqn3632` (`cliente_id`),
  KEY `FKauqt5ljerhslue4scdu1qexb` (`domicilio_id`),
  KEY `FK3lx6no37l3oetlnj78xxmyrpk` (`empleado_delivery_id`),
  KEY `FK3ks2hug06ddfndlg1rqw1xmr9` (`sucursal_id`),
  CONSTRAINT `FK30s8j2ktpay6of18lbyqn3632` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`),
  CONSTRAINT `FK3ks2hug06ddfndlg1rqw1xmr9` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id`),
  CONSTRAINT `FK3lx6no37l3oetlnj78xxmyrpk` FOREIGN KEY (`empleado_delivery_id`) REFERENCES `empleado` (`id`),
  CONSTRAINT `FKauqt5ljerhslue4scdu1qexb` FOREIGN KEY (`domicilio_id`) REFERENCES `domicilio` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,_binary '\0','CANCELADO','2025-06-10 13:00:00.000000','EFECTIVO','13:45:00.000000',_binary '','DELIVERY',3200,1000,1,6,4,1),(2,_binary '\0','ENTREGADO','2025-06-11 14:00:00.000000','MERCADOPAGO','14:30:00.000000',_binary '','TAKEAWAY',1600,600,2,7,2,1),(3,_binary '\0','EN_DELIVERY','2025-06-12 15:00:00.000000','EFECTIVO','15:45:00.000000',_binary '','DELIVERY',2100,800,3,9,3,1),(4,_binary '\0','PREPARACION','2025-06-13 12:30:00.000000','MERCADOPAGO','13:10:00.000000',_binary '','TAKEAWAY',12432,900,2,7,4,1),(5,_binary '\0','ENTREGADO','2025-06-14 13:00:00.000000','EFECTIVO','13:45:00.000000',_binary '','DELIVERY',985.6,600,1,6,2,1),(6,_binary '\0','CANCELADO','2025-06-15 14:00:00.000000','EFECTIVO','14:45:00.000000',_binary '\0','TAKEAWAY',1600,500,3,9,3,1),(7,_binary '\0','ENTREGADO','2025-06-15 15:00:00.000000','EFECTIVO','15:30:00.000000',_binary '','DELIVERY',2100,900,1,6,4,1),(8,_binary '\0','ENTREGADO','2025-06-15 16:00:00.000000','MERCADOPAGO','16:30:00.000000',_binary '','DELIVERY',3200,1000,2,7,3,1),(9,_binary '\0','ENTREGADO','2025-06-10 13:00:00.000000','EFECTIVO','13:45:00.000000',_binary '','DELIVERY',3200,1000,1,6,6,2),(10,_binary '\0','LISTO','2025-06-11 14:00:00.000000','MERCADOPAGO','14:30:00.000000',_binary '\0','TAKEAWAY',1600,600,2,7,7,2),(11,_binary '\0','PENDIENTE','2025-06-12 15:00:00.000000','EFECTIVO','15:45:00.000000',_binary '','DELIVERY',2100,800,3,9,8,2),(12,_binary '\0','PREPARACION','2025-06-13 12:30:00.000000','MERCADOPAGO','13:10:00.000000',_binary '','TAKEAWAY',12432,900,2,7,7,2),(13,_binary '\0','ENTREGADO','2025-06-14 13:00:00.000000','EFECTIVO','13:45:00.000000',_binary '','DELIVERY',985.6,600,1,6,6,2),(14,_binary '\0','CANCELADO','2025-06-15 14:00:00.000000','EFECTIVO','14:45:00.000000',_binary '\0','TAKEAWAY',1600,500,3,9,8,2),(15,_binary '\0','LISTO','2025-06-15 15:00:00.000000','EFECTIVO','15:30:00.000000',_binary '','DELIVERY',2100,900,1,6,6,2),(16,_binary '\0','ENTREGADO','2025-06-15 16:00:00.000000','MERCADOPAGO','16:30:00.000000',_binary '','DELIVERY',3200,1000,2,7,7,2),(17,_binary '\0','ENTREGADO','2025-06-15 12:00:00.000000','MERCADOPAGO','12:40:00.000000',_binary '','DELIVERY',1700,900,1,6,2,1),(18,_binary '\0','ENTREGADO','2025-06-15 13:00:00.000000','EFECTIVO','13:45:00.000000',_binary '','TAKEAWAY',1950,950,2,7,7,2),(19,_binary '\0','PENDIENTE','2025-06-15 18:21:35.000000','MERCADOPAGO','15:51:35.000000',_binary '\0','TAKEAWAY',3200,800,1,6,NULL,1);
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promocion`
--

DROP TABLE IF EXISTS `promocion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promocion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `activa` bit(1) DEFAULT NULL,
  `denominacion` varchar(255) DEFAULT NULL,
  `descripcion_descuento` varchar(255) DEFAULT NULL,
  `fecha_desde` date DEFAULT NULL,
  `fecha_hasta` date DEFAULT NULL,
  `hora_desde` time(6) DEFAULT NULL,
  `hora_hasta` time(6) DEFAULT NULL,
  `precio_promocional` double DEFAULT NULL,
  `tipo_promocion` enum('HAPPYHOUR','PROMOCION') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promocion`
--

LOCK TABLES `promocion` WRITE;
/*!40000 ALTER TABLE `promocion` DISABLE KEYS */;
INSERT INTO `promocion` VALUES (1,_binary '\0',_binary '','Promo Pizza + Bebida','Pizza Muzzarella con 1 bebida','2025-06-15','2025-06-30','11:00:00.000000','15:00:00.000000',1700,'PROMOCION'),(2,_binary '\0',_binary '','Happy Lomito','Lomito + Coca','2025-06-15','2025-06-30','11:00:00.000000','15:00:00.000000',1950,'HAPPYHOUR');
/*!40000 ALTER TABLE `promocion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promocion_sucursal`
--

DROP TABLE IF EXISTS `promocion_sucursal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promocion_sucursal` (
  `promocion_id` bigint(20) NOT NULL,
  `sucursal_id` bigint(20) NOT NULL,
  PRIMARY KEY (`promocion_id`,`sucursal_id`),
  KEY `FKk1lawi8ulgtnsxchuu0c0co24` (`sucursal_id`),
  CONSTRAINT `FKge6x8uw3pfyfoqv60f1aymgmd` FOREIGN KEY (`promocion_id`) REFERENCES `promocion` (`id`),
  CONSTRAINT `FKk1lawi8ulgtnsxchuu0c0co24` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promocion_sucursal`
--

LOCK TABLES `promocion_sucursal` WRITE;
/*!40000 ALTER TABLE `promocion_sucursal` DISABLE KEYS */;
INSERT INTO `promocion_sucursal` VALUES (1,1),(1,2),(2,1),(2,2);
/*!40000 ALTER TABLE `promocion_sucursal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provincia`
--

DROP TABLE IF EXISTS `provincia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provincia` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `pais_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm4s599988w0v1q1nw6dyo5t2m` (`pais_id`),
  CONSTRAINT `FKm4s599988w0v1q1nw6dyo5t2m` FOREIGN KEY (`pais_id`) REFERENCES `pais` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provincia`
--

LOCK TABLES `provincia` WRITE;
/*!40000 ALTER TABLE `provincia` DISABLE KEYS */;
INSERT INTO `provincia` VALUES (1,_binary '\0','Buenos Aires',1),(2,_binary '\0','Catamarca',1),(3,_binary '\0','Chaco',1),(4,_binary '\0','Chubut',1),(5,_binary '\0','Córdoba',1),(6,_binary '\0','Corrientes',1),(7,_binary '\0','Entre Ríos',1),(8,_binary '\0','Formosa',1),(9,_binary '\0','Jujuy',1),(10,_binary '\0','La Pampa',1),(11,_binary '\0','La Rioja',1),(12,_binary '\0','Mendoza',1),(13,_binary '\0','Misiones',1),(14,_binary '\0','Neuquén',1),(15,_binary '\0','Río Negro',1),(16,_binary '\0','Salta',1),(17,_binary '\0','San Juan',1),(18,_binary '\0','San Luis',1),(19,_binary '\0','Santa Cruz',1),(20,_binary '\0','Santa Fe',1),(21,_binary '\0','Santiago del Estero',1),(22,_binary '\0','Tierra del Fuego',1),(23,_binary '\0','Tucumán',1),(24,_binary '\0','CABA',1);
/*!40000 ALTER TABLE `provincia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sucursal`
--

DROP TABLE IF EXISTS `sucursal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sucursal` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `casa_matriz` bit(1) DEFAULT NULL,
  `horario_apertura` time(6) DEFAULT NULL,
  `horario_cierre` time(6) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `domicilio_id` bigint(20) DEFAULT NULL,
  `empresa_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK34hifwa9nn1cgdbjgkosx0wy2` (`domicilio_id`),
  KEY `FK3w56rbjykxbp2e79cdq0xsghd` (`empresa_id`),
  CONSTRAINT `FK3w56rbjykxbp2e79cdq0xsghd` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id`),
  CONSTRAINT `FKpxac8l3j9mwcwolj5dyctwpxo` FOREIGN KEY (`domicilio_id`) REFERENCES `domicilio` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sucursal`
--

LOCK TABLES `sucursal` WRITE;
/*!40000 ALTER TABLE `sucursal` DISABLE KEYS */;
INSERT INTO `sucursal` VALUES (1,_binary '\0',_binary '\0','20:00:00.000000','00:00:00.000000','Casa Central',9,1),(2,_binary '\0',_binary '\0','10:00:00.000000','18:00:00.000000','Sucursal Este',11,1);
/*!40000 ALTER TABLE `sucursal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sucursal_insumo`
--

DROP TABLE IF EXISTS `sucursal_insumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sucursal_insumo` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `stock_actual` double DEFAULT NULL,
  `stock_maximo` double DEFAULT NULL,
  `stock_minimo` double DEFAULT NULL,
  `insumo_id` bigint(20) DEFAULT NULL,
  `sucursal_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdcfhj5e3i5f6qgt0570nt5ay2` (`insumo_id`),
  KEY `FKeeyic4mehfylwb0ufioouiqam` (`sucursal_id`),
  CONSTRAINT `FKdcfhj5e3i5f6qgt0570nt5ay2` FOREIGN KEY (`insumo_id`) REFERENCES `articulo_insumo` (`id`),
  CONSTRAINT `FKeeyic4mehfylwb0ufioouiqam` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sucursal_insumo`
--

LOCK TABLES `sucursal_insumo` WRITE;
/*!40000 ALTER TABLE `sucursal_insumo` DISABLE KEYS */;
INSERT INTO `sucursal_insumo` VALUES (1,_binary '\0',54,100,1,NULL,1),(2,_binary '\0',63,100,1,NULL,1),(3,_binary '\0',56,100,1,NULL,1),(4,_binary '\0',46,100,30,12,1),(5,_binary '\0',18,100,25,13,1),(6,_binary '\0',80,100,40,14,1),(7,_binary '\0',10,100,15,15,1),(8,_binary '\0',35,100,30,16,1),(9,_binary '\0',30,100,20,12,2),(10,_binary '\0',10,100,25,13,2),(11,_binary '\0',90,100,40,14,2),(12,_binary '\0',5,100,15,15,2),(13,_binary '\0',25,100,30,16,2);
/*!40000 ALTER TABLE `sucursal_insumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidad_medida`
--

DROP TABLE IF EXISTS `unidad_medida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidad_medida` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `denominacion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidad_medida`
--

LOCK TABLES `unidad_medida` WRITE;
/*!40000 ALTER TABLE `unidad_medida` DISABLE KEYS */;
INSERT INTO `unidad_medida` VALUES (1,_binary '\0','Unidad'),(2,_binary '\0','Litro'),(3,_binary '\0','Kilogramo'),(4,_binary '\0','Gramo');
/*!40000 ALTER TABLE `unidad_medida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eliminado` bit(1) NOT NULL,
  `dni` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `firebase_uid` varchar(255) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `rol` enum('ADMINISTRADOR','CAJERO','CLIENTE','COCINERO','DELIVERY') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK5171l57faosmj8myawaucatdw` (`email`),
  UNIQUE KEY `UK7vk4on2etv262l4p3jtjilcm3` (`firebase_uid`),
  UNIQUE KEY `UKma71x4n4tydibsd9qt0m71le7` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,_binary '\0','123123','admin@buensa.com','0wT1WSonPZfdiXIoceu2imy7GJ53','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg','password','ADMINISTRADOR'),(2,_binary '\0','123','cajero@buensa.com','IvLNrda6CkPiT7uqp3DfpguF6rZ2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221580/hirlalizap8uluw3sa1u.jpg','password','CAJERO'),(3,_binary '\0','1234','cocinero@buensa.com','FBOrztuIpidGMVcJRRmsWDfbNf83','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221678/pkfdcanbungp7lpx75xo.jpg','password','COCINERO'),(4,_binary '\0','12345','delivery@buensa.com','aqi54XpX0wgvG3jhIkSSukDg7Yx2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221617/l42s8t31mivewaalmmuq.jpg','password','DELIVERY'),(5,_binary '\0','4334343','juan@hotmail.com','v1E2gY1G90MlcrqT3jefJBSMVhf1','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749220817/yekjwtrrthcqf3thhu3c.jpg','password','CLIENTE'),(6,_binary '\0','12121242','mln204manutup@gmail.com','70oXKoe8CyePy3dFYy7P9SRjGwJ3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749221525/jhzs2z2iod6vznfirkv3.jpg','password','ADMINISTRADOR'),(7,_binary '\0','4223232','luis@hotmail.com','h8stw8x2WJYlcPTj7MuC56YmeNE3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528593/owc3hsdwd921vcsi7omj.jpg','password','CLIENTE'),(8,_binary '\0','24124122','max@hotmail.com','0AqJQjapRXYZ2LmX95XeXFib9ev2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749528768/si6msmbtkcefciwl67nc.jpg','password','CLIENTE'),(9,_binary '\0','352352352','cajero2@buensa.com','clRULtoXc2Y0k7ktwxMv3fl4GwB3','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684037/twa80xmen526tw6m0x1v.jpg','password','CAJERO'),(10,_binary '\0','35235212','cocinero2@buensa.com','yLZ4RNYOhkclKOxSpIyu0k73NHh2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684164/mouigwtcixvoxwvg5qik.jpg','password','COCINERO'),(11,_binary '\0','5353333','delivery2@buensa.com','CKmR6qiscncNxSQ8VzsY5HnzZTb2','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749684294/im76ozgpqzauqrvkfono.jpg','password','DELIVERY');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-16 10:44:18

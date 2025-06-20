USE `buen_sabor2`;

/*Data for the table `promocion` */

insert  into `promocion`(`id`,`eliminado`,`activa`,`denominacion`,`descripcion_descuento`,`fecha_desde`,`fecha_hasta`,`hora_desde`,`hora_hasta`,`precio_promocional`,`tipo_promocion`) values (1,'\0','','Combo Hamburguesa Clásica','2 hamburguesas con Papas y Coca Cola','2025-06-17','2025-06-24','11:00:00.000000','23:00:00.000000',20100,'PROMOCION'),(2,'\0','','Happy Hour Cerveza Quilmes','30% de descuento en Cerveza Quilmes 1L','2025-06-17','2025-06-24','18:00:00.000000','20:00:00.000000',2100,'HAPPYHOUR'),(3,'\0','','Docena de Empanadas + Gaseosa','15% de descuento en docena + gaseosa gratis','2025-06-17','2025-06-25','12:00:00.000000','16:00:00.000000',20000,'PROMOCION'),(4,'\0','','Combo Pizza Mozzarella','15% de descuento pizza + gaseosa','2025-06-17','2025-06-23','19:00:00.000000','23:30:00.000000',9000,'PROMOCION'),(5,'\0','','Happy Hour Papas','25% de descuento en papas fritas','2025-06-17','2025-06-26','15:00:00.000000','18:00:00.000000',3300,'HAPPYHOUR'),(6,'\0','','Combo Lomo Completo','18% de descuento en combo premium','2025-06-17','2025-06-27','20:00:00.000000','23:59:00.000000',19000,'PROMOCION');

/*Data for the table `imagen_promocion` */

insert  into `imagen_promocion`(`id`,`eliminado`,`denominacion`,`promocion_id`) values (1,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750118525/coca_cola_bvrczz.jpg',1),(2,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750200039/promo_quilmes_or3kdt.jpg',2),(3,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750200039/promo_empanadas_uorjbh.jpg',3),(4,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750200039/promo_pizza_jyc97f.jpg',4),(5,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750200039/promo_papas_sfkvt4.jpg',5),(6,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750200039/promo_lomo_cn90bq.jpg',6),(7,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750193511/lomo_completo_s0d5ez.jpg',6),(8,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750118902/hamburguesa_clasica_fnrxol.jpg',1),(9,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1750200039/promo_hamburguesa_kz8dhq.jpg',1);

/*Data for the table `detalle_promocion` */

insert  into `detalle_promocion`(`id`,`eliminado`,`cantidad`,`articulo_id`,`promocion_id`) values (1,'\0',2,23,1),(2,'\0',1,30,1),(3,'\0',1,19,1),(4,'\0',1,21,2),(5,'\0',12,28,3),(6,'\0',1,19,3),(7,'\0',1,25,4),(8,'\0',1,20,4),(9,'\0',1,31,5),(10,'\0',1,68,6),(11,'\0',1,31,6),(12,'\0',1,22,6);

/*Data for the table `promocion_sucursal` */

insert  into `promocion_sucursal`(`promocion_id`,`sucursal_id`) values (1,1),(1,2),(2,1),(3,1),(3,2),(4,2),(5,1),(5,2),(6,1);



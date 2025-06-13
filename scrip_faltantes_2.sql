USE buen_sabor;
-- Insertar en detalle_pedido (pedido_id, articulo_id ya deben existir)
INSERT INTO detalle_pedido (id, eliminado, cantidad, sub_total, articulo_id, pedido_id)
VALUES
    (1, b'0', 2, 19000, 5, 1),
    (2, b'0', 1, 2200, 6, 1);

-- Insertar en factura (pedido_id debe existir)
INSERT INTO factura (id, eliminado, fecha_facturacion, mp_merchant_order_id, mp_payment_id, mp_payment_type, mp_preference_id, total_venta, pedido_id)
VALUES
    (1, b'0', '2025-06-13', 123456, 78910, 'credit_card', 'pref_001', 21200, 1);

-- Insertar en imagen_articulo (articulo_id debe existir)
INSERT INTO imagen_articulo (id, eliminado, denominacion, articulo_id)
VALUES
    (1, b'0', 'pizza-napolitana.jpg', 5),
    (2, b'0', 'coca-cola.jpg', 6);

-- Insertar en imagen_promocion (promocion_id debe existir)
INSERT INTO promocion (id, eliminado, activa, denominacion, descripcion_descuento, fecha_desde, fecha_hasta, hora_desde, hora_hasta, precio_promocional, tipo_promocion)
VALUES
    (1, b'0', b'1', 'Promo Pizza + Bebida', '25% de descuento', '2025-06-01', '2025-06-30', '20:00:00', '23:00:00', 10000, 'HAPPYHOUR');

INSERT INTO imagen_promocion (id, eliminado, denominacion, promocion_id)
VALUES
    (1, b'0', 'promo-pizza-bebida.jpg', 1);

-- Insertar en detalle_promocion
INSERT INTO detalle_promocion (id, eliminado, cantidad, articulo_id, promocion_id)
VALUES
    (1, b'0', 1, 5, 1),
    (2, b'0', 1, 6, 1);

-- Insertar en promocion_sucursal
INSERT INTO promocion_sucursal (promocion_id, sucursal_id)
VALUES
    (1, 1),
    (1, 2);

-- Insertar en pedido (cliente_id, domicilio_id, sucursal_id, empleado_delivery_id deben existir)
INSERT INTO pedido (id, eliminado, estado, fecha_pedido, forma_pago, hora_estimada_finalizacion, tipo_envio, total, total_costo, cliente_id, empleado_delivery_id, sucursal_id, domicilio_id)
VALUES
    (1, b'0', 'PENDIENTE', NOW(), 'EFECTIVO', '21:30:00', 'DELIVERY', 21200, 18000, 1, 4, 1, 6);

-- Borrar datos para evitar conflictos de claves duplicadas
DELETE FROM factura;
DELETE FROM detalle_pedido;
DELETE FROM pedido;

-- Reiniciar AUTO_INCREMENT si lo necesitás
ALTER TABLE factura AUTO_INCREMENT = 1;
ALTER TABLE detalle_pedido AUTO_INCREMENT = 1;
ALTER TABLE pedido AUTO_INCREMENT = 1;

INSERT INTO pedido (id, eliminado, estado, fecha_pedido, forma_pago, hora_estimada_finalizacion, tipo_envio, total, total_costo, cliente_id, empleado_delivery_id, sucursal_id, domicilio_id) VALUES
                                                                                                                                                                                                  (2, b'0', 'ENTREGADO', '2025-06-07 12:12:28', 'EFECTIVO', '21:00:00', 'DELIVERY', 9500, 8075.0, 3, 6, 2, 14),
                                                                                                                                                                                                  (3, b'0', 'ENTREGADO', '2025-05-19 12:12:28', 'EFECTIVO', '21:00:00', 'DELIVERY', 14500, 12325.0, 3, 7, 1, 9),
                                                                                                                                                                                                  (4, b'0', 'ENTREGADO', '2025-05-21 12:12:28', 'EFECTIVO', '21:00:00', 'DELIVERY', 9500, 8075.0, 3, 7, 1, 7),
                                                                                                                                                                                                  (5, b'0', 'ENTREGADO', '2025-05-16 12:12:28', 'EFECTIVO', '21:00:00', 'DELIVERY', 9500, 8075.0, 3, 4, 1, 12),
                                                                                                                                                                                                  (6, b'0', 'ENTREGADO', '2025-05-25 12:12:28', 'EFECTIVO', '21:00:00', 'DELIVERY', 11400, 9690.0, 2, 4, 2, 6),
                                                                                                                                                                                                  (7, b'0', 'ENTREGADO', '2025-05-20 12:12:28', 'EFECTIVO', '21:00:00', 'DELIVERY', 9500, 8075.0, 3, 4, 2, 7),
                                                                                                                                                                                                  (8, b'0', 'ENTREGADO', '2025-05-23 12:12:28', 'EFECTIVO', '21:00:00', 'DELIVERY', 9500, 8075.0, 2, 4, 2, 6),
                                                                                                                                                                                                  (9, b'0', 'ENTREGADO', '2025-05-14 12:12:28', 'EFECTIVO', '21:00:00', 'DELIVERY', 14500, 12325.0, 2, 4, 1, 8),
                                                                                                                                                                                                  (10, b'0', 'ENTREGADO', '2025-05-30 12:12:28', 'EFECTIVO', '21:00:00', 'DELIVERY', 9500, 8075.0, 3, 6, 1, 13),
                                                                                                                                                                                                  (11, b'0', 'ENTREGADO', '2025-06-04 12:12:28', 'EFECTIVO', '21:00:00', 'DELIVERY', 14500, 12325.0, 1, 8, 1, 6);
INSERT INTO detalle_pedido (id, eliminado, cantidad, sub_total, articulo_id, pedido_id) VALUES
                                                                                            (4, b'0', 2, 9500, 6, 2),
                                                                                            (6, b'0', 2, 14500, 5, 3),
                                                                                            (8, b'0', 1, 9500, 5, 4),
                                                                                            (10, b'0', 3, 9500, 5, 5),
                                                                                            (12, b'0', 3, 11400, 6, 6),
                                                                                            (14, b'0', 1, 9500, 6, 7),
                                                                                            (16, b'0', 1, 9500, 5, 8),
                                                                                            (18, b'0', 2, 14500, 6, 9),
                                                                                            (20, b'0', 2, 9500, 6, 10),
                                                                                            (22, b'0', 3, 14500, 5, 11);

INSERT INTO factura (id, eliminado, fecha_facturacion, mp_merchant_order_id, mp_payment_id, mp_payment_type, mp_preference_id, total_venta, pedido_id) VALUES
                                                                                                                                                           (2, b'0', '2025-06-07', 1002, 2002, 'credit_card', 'pref_002', 9500, 2),
                                                                                                                                                           (3, b'0', '2025-05-19', 1003, 2003, 'credit_card', 'pref_003', 14500, 3),
                                                                                                                                                           (4, b'0', '2025-05-21', 1004, 2004, 'credit_card', 'pref_004', 9500, 4),
                                                                                                                                                           (5, b'0', '2025-05-16', 1005, 2005, 'credit_card', 'pref_005', 9500, 5),
                                                                                                                                                           (6, b'0', '2025-05-25', 1006, 2006, 'credit_card', 'pref_006', 11400, 6),
                                                                                                                                                           (7, b'0', '2025-05-20', 1007, 2007, 'credit_card', 'pref_007', 9500, 7),
                                                                                                                                                           (8, b'0', '2025-05-23', 1008, 2008, 'credit_card', 'pref_008', 9500, 8),
                                                                                                                                                           (9, b'0', '2025-05-14', 1009, 2009, 'credit_card', 'pref_009', 14500, 9),
                                                                                                                                                           (10, b'0', '2025-05-30', 1010, 2010, 'credit_card', 'pref_010', 9500, 10),
                                                                                                                                                           (11, b'0', '2025-06-04', 1011, 2011, 'credit_card', 'pref_011', 14500, 11);

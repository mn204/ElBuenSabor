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
                                                            (0, 'La Paz', @mendoza_provincia_id);
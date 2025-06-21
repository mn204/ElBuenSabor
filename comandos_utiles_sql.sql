-- Consulta para actualizar precios de venta de artículos manufacturados
-- Fórmula: Precio de venta = Precio de costo * (1 + Ganancia/100)
-- Donde Precio de costo = Sumatoria de (precio_compra_insumo * cantidad_insumo)

UPDATE articulo a
    INNER JOIN articulo_manufacturado am ON a.id = am.id
    SET a.precio_venta = (
    -- Calcular precio de costo
    SELECT SUM(ai.precio_compra * dam.cantidad)
    FROM detalle_articulo_manufacturado dam
    INNER JOIN articulo_insumo ai ON dam.articulo_insumo_id = ai.id
    WHERE dam.articulo_manufacturado_id = am.id
    AND dam.eliminado = 0
    ) * (1 + am.ganancia/100)
WHERE a.tipo_articulo = 'ArticuloManufacturado'
  AND a.eliminado = 0;

-- Consulta para verificar los cálculos antes de actualizar
SELECT
    a.id,
    a.denominacion,
    a.precio_venta AS precio_actual,
    ROUND(
            (SELECT SUM(ai.precio_compra * dam.cantidad)
             FROM detalle_articulo_manufacturado dam
                      INNER JOIN articulo_insumo ai ON dam.articulo_insumo_id = ai.id
             WHERE dam.articulo_manufacturado_id = am.id
               AND dam.eliminado = 0
            ), 2
    ) AS precio_costo,
    am.ganancia,
    ROUND(
            (SELECT SUM(ai.precio_compra * dam.cantidad)
             FROM detalle_articulo_manufacturado dam
                      INNER JOIN articulo_insumo ai ON dam.articulo_insumo_id = ai.id
             WHERE dam.articulo_manufacturado_id = am.id
               AND dam.eliminado = 0
            ) * (1 + am.ganancia/100), 2
    ) AS precio_nuevo
FROM articulo a
         INNER JOIN articulo_manufacturado am ON a.id = am.id
WHERE a.tipo_articulo = 'ArticuloManufacturado'
  AND a.eliminado = 0
ORDER BY a.id;

-- Consulta detallada para ver el desglose de costos por artículo manufacturado
SELECT
    a.denominacion AS producto,
    ai_art.denominacion AS insumo,
    ai.precio_compra,
    dam.cantidad,
    (ai.precio_compra * dam.cantidad) AS costo_parcial,
    am.ganancia
FROM articulo a
         INNER JOIN articulo_manufacturado am ON a.id = am.id
         INNER JOIN detalle_articulo_manufacturado dam ON am.id = dam.articulo_manufacturado_id
         INNER JOIN articulo_insumo ai ON dam.articulo_insumo_id = ai.id
         INNER JOIN articulo ai_art ON ai.id = ai_art.id
WHERE a.tipo_articulo = 'ArticuloManufacturado'
  AND a.eliminado = 0
  AND dam.eliminado = 0
ORDER BY a.denominacion, ai_art.denominacion;

-- Recalcular precios promocionales basados en los descuentos establecidos
UPDATE promocion p
SET precio_promocional = ROUND(
        (
            SELECT SUM(a.precio_venta * dp.cantidad)
            FROM detalle_promocion dp
                     INNER JOIN articulo a ON dp.articulo_id = a.id
            WHERE dp.promocion_id = p.id AND dp.eliminado = 0
        ) * (1 - p.descuento/100), 2
                         )
WHERE p.eliminado = 0 AND p.descuento IS NOT NULL;

-- Consulta final para verificar los resultados
SELECT
    p.id,
    p.denominacion,
    p.tipo_promocion,
    ROUND(SUM(a.precio_venta * dp.cantidad), 2) AS precio_sin_descuento,
    p.descuento,
    p.precio_promocional,
    ROUND(SUM(a.precio_venta * dp.cantidad) * (1 - p.descuento/100), 2) AS precio_calculado,
    -- Detalles de artículos
    GROUP_CONCAT(
            CONCAT(a.denominacion, ' x', dp.cantidad, ' ($', a.precio_venta, ')')
                SEPARATOR ', '
    ) AS detalle_articulos
FROM promocion p
         INNER JOIN detalle_promocion dp ON p.id = dp.promocion_id
         INNER JOIN articulo a ON dp.articulo_id = a.id
WHERE p.eliminado = 0 AND dp.eliminado = 0
GROUP BY p.id, p.denominacion, p.tipo_promocion, p.descuento, p.precio_promocional
ORDER BY p.id;
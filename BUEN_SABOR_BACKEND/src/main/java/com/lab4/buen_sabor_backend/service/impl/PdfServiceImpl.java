// Clase que implementa la generación de Facturas y Notas de Crédito en PDF
package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.*;
import com.lab4.buen_sabor_backend.service.PdfService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;
import com.lowagie.text.Rectangle;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class PdfServiceImpl implements PdfService {

    // Colores corporativos
    private static final Color COLOR_PRIMARIO = new Color(45, 55, 72);
    private static final Color COLOR_SECUNDARIO = new Color(74, 85, 104);
    private static final Color COLOR_ACENTO = new Color(56, 178, 172);
    private static final Color COLOR_FONDO_SUAVE = new Color(247, 250, 252);
    private static final Color COLOR_TEXTO_SECUNDARIO = new Color(113, 128, 150);
    private static final Color COLOR_BLANCO = Color.WHITE;
    private static final Color COLOR_BORDE = new Color(226, 232, 240);
    private static final Color COLOR_PROMOCION = new Color(255, 243, 205); // Color suave para promociones

    // Generación de Factura
    @Override
    public byte[] generarFacturaPedido(Pedido pedido) {
        return generarDocumentoComercial(pedido, null,  false);
    }

    // Generación de Nota de Crédito (misma lógica que factura, pero con título y leyendas diferentes)
    public byte[] generarNotaCreditoPedido(Pedido pedido) {
        return generarDocumentoComercial(pedido, null, true);
    }

    // Métodos unificado para generar Factura o Nota de Crédito
    private byte[] generarDocumentoComercial(Pedido pedido, String motivo, boolean esNotaCredito) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Fuentes reutilizables
            Font fuenteTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, COLOR_PRIMARIO);
            Font fuenteSubtitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, COLOR_SECUNDARIO);
            Font fuenteNormal = FontFactory.getFont(FontFactory.HELVETICA, 10, COLOR_PRIMARIO);
            Font fuenteNegrita = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, COLOR_PRIMARIO);
            Font fuentePequena = FontFactory.getFont(FontFactory.HELVETICA, 9, COLOR_TEXTO_SECUNDARIO);
            Font fuenteAcento = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, COLOR_ACENTO);
            Font fuenteTotal = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, COLOR_PRIMARIO);

            String cae = "X" + String.format("%012d", pedido.getId());

            // Header con título dinámico
            crearHeader(document, pedido, esNotaCredito);

            // Agrega motivo si es nota de crédito
            if (esNotaCredito) {
                Paragraph motivoParrafo = new Paragraph();
                motivoParrafo.add(new Chunk("Tu pedido ha sido cancelado.", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, COLOR_PRIMARIO)));
                motivoParrafo.add(new Chunk("\nSi no realizaste esta cancelación, por favor comunicate con nosotros.", fuentePequena));
                motivoParrafo.setSpacingAfter(10);
                document.add(motivoParrafo);
            }

            // Datos del cliente
            crearSeccionCliente(document, pedido, fuenteNormal, fuenteNegrita, esNotaCredito);

            // Detalle de productos
            crearTablaProductos(document, pedido, fuenteNormal);

            // Totales
            crearSeccionTotales(document, pedido, fuenteTotal, fuenteNormal, fuenteAcento);

            // Footer con leyenda dinámica
            crearFooter(document, cae, fuentePequena, writer, esNotaCredito);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar el documento PDF: " + e.getMessage(), e);
        }
    }

    // Header adaptado con título dinámico (Factura o Nota de Crédito)
    private void crearHeader(Document document, Pedido pedido, boolean esNotaCredito) throws DocumentException {
        PdfPTable tablaHeader = new PdfPTable(3);
        tablaHeader.setWidthPercentage(100);
        tablaHeader.setWidths(new float[]{35, 30, 35});
        tablaHeader.setSpacingAfter(5);

        // Columna izquierda - Empresa
        PdfPCell celdaEmpresa = new PdfPCell();
        celdaEmpresa.setBorder(Rectangle.NO_BORDER);
        celdaEmpresa.setPadding(10);

        Font fuenteEmpresa = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, COLOR_PRIMARIO);
        Font fuenteDireccion = FontFactory.getFont(FontFactory.HELVETICA, 9, COLOR_SECUNDARIO);

        Paragraph empresaInfo = new Paragraph();
        empresaInfo.add(new Chunk("EL BUEN SABOR S.A.\n", fuenteEmpresa));
        if (pedido.getSucursal() != null && pedido.getSucursal().getDomicilio() != null) {
            empresaInfo.add(new Chunk(pedido.getSucursal().getDomicilio().getCalle() + " " +
                    pedido.getSucursal().getDomicilio().getNumero() + ", " +
                    pedido.getSucursal().getDomicilio().getLocalidad().getNombre() + "\n", fuenteDireccion));
        }
        empresaInfo.add(new Chunk("CUIT: 20-30405060-7\n", fuenteDireccion));
        empresaInfo.add(new Chunk("Responsable Inscripto", fuenteDireccion));

        celdaEmpresa.addElement(empresaInfo);
        tablaHeader.addCell(celdaEmpresa);

        // Columna central - Letra del comprobante
        PdfPCell celdaCentral = new PdfPCell(new Phrase("B", new Font(Font.HELVETICA, 36, Font.BOLD, COLOR_ACENTO)));
        celdaCentral.setBorder(Rectangle.BOX);
        celdaCentral.setBorderWidth(2);
        celdaCentral.setBorderColor(COLOR_ACENTO);
        celdaCentral.setFixedHeight(60);
        celdaCentral.setHorizontalAlignment(Element.ALIGN_CENTER);
        celdaCentral.setVerticalAlignment(Element.ALIGN_MIDDLE);
        celdaCentral.setPadding(0);
        tablaHeader.addCell(celdaCentral);

        // Columna derecha - Datos fiscales
        PdfPCell celdaFiscal = new PdfPCell();
        celdaFiscal.setBorder(Rectangle.NO_BORDER);
        celdaFiscal.setPadding(10);
        celdaFiscal.setHorizontalAlignment(Element.ALIGN_RIGHT);

        String codSucursal = String.format("%04d", pedido.getSucursal().getId());
        String codPedido = String.format("%08d", pedido.getId());

        Font fuenteFiscal = FontFactory.getFont(FontFactory.HELVETICA, 9, COLOR_SECUNDARIO);
        Font fuenteTituloDoc = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, COLOR_PRIMARIO);

        Paragraph datosFiscal = new Paragraph();
        datosFiscal.setAlignment(Element.ALIGN_RIGHT);
        datosFiscal.add(new Chunk((esNotaCredito ? "NOTA DE CR\u00c9DITO B" : "FACTURA B") + "\n", fuenteTituloDoc));
        datosFiscal.add(new Chunk("N\u00b0: " + codSucursal + "-" + codPedido + "\n", fuenteTituloDoc));
        datosFiscal.add(new Chunk("Fecha: " + formatearFecha(pedido.getFechaPedido()) + "\n", fuenteFiscal));

        datosFiscal.add(new Chunk("CAE: X" + String.format("%012d", pedido.getId()) + "\n", fuenteFiscal));
        datosFiscal.add(new Chunk("Vto. CAE: " + formatearFecha(pedido.getFechaPedido().plusDays(10)), fuenteFiscal));

        celdaFiscal.addElement(datosFiscal);
        tablaHeader.addCell(celdaFiscal);

        document.add(tablaHeader);

        // Línea separadora inferior
        PdfPTable lineaHeader = new PdfPTable(1);
        lineaHeader.setWidthPercentage(100);
        lineaHeader.setSpacingAfter(10);

        PdfPCell celdaLinea = new PdfPCell();
        celdaLinea.setBorder(Rectangle.NO_BORDER);
        celdaLinea.setBackgroundColor(COLOR_ACENTO);
        celdaLinea.setFixedHeight(2);

        lineaHeader.addCell(celdaLinea);
        document.add(lineaHeader);
    }

    // Footer modificado para mostrar leyenda dependiendo del tipo de documento
    private void crearFooter(Document document, String cae, Font fuentePequena, PdfWriter writer, boolean esNotaCredito) {
        PdfContentByte cb = writer.getDirectContent();
        float y = document.bottom() - 20;

        cb.setColorFill(COLOR_ACENTO);
        cb.rectangle(document.left(), y + 30, document.right() - document.left(), 2);
        cb.fill();

        String leyenda = esNotaCredito ? "Documento no valido como factura" : "Documento no válido como factura";

        ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                new Phrase(leyenda, new Font(Font.HELVETICA, 9, Font.BOLD, COLOR_TEXTO_SECUNDARIO)),
                (document.left() + document.right()) / 2, y + 20, 0);

        ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                new Phrase("Verificación ARCA: www.arca.gob.ar/qr/" + cae, fuentePequena),
                (document.left() + document.right()) / 2, y + 10, 0);

        ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                new Phrase("Gracias por elegirnos - El Buen Sabor", new Font(Font.HELVETICA, 8, Font.ITALIC, COLOR_ACENTO)),
                (document.left() + document.right()) / 2, y, 0);

        ColumnText.showTextAligned(cb, Element.ALIGN_RIGHT,
                new Phrase("Página " + writer.getPageNumber(), new Font(Font.HELVETICA, 8, Font.NORMAL, COLOR_TEXTO_SECUNDARIO)),
                document.right(), document.bottom() - 30, 0);
    }

    private void crearSeccionCliente(Document document, Pedido pedido, Font fuenteNormal, Font fuenteNegrita, boolean esNotaCredito) throws DocumentException {
        // Tabla de datos del cliente sin títulos
        PdfPTable tablaCliente = new PdfPTable(2);
        tablaCliente.setWidthPercentage(100);
        tablaCliente.setWidths(new float[]{50, 50});
        tablaCliente.setSpacingAfter(10);

        // Columna izquierda - Datos personales
        PdfPCell celdaDatos = new PdfPCell();
        celdaDatos.setBorder(Rectangle.NO_BORDER);
        celdaDatos.setPadding(5);

        Paragraph datosPersonales = new Paragraph();
        datosPersonales.add(new Chunk("Cliente: ", fuenteNegrita));
        datosPersonales.add(new Chunk(pedido.getCliente().getNombre() + " " + pedido.getCliente().getApellido() + "\n", fuenteNormal));
        datosPersonales.add(new Chunk("DNI: ", fuenteNegrita));
        datosPersonales.add(new Chunk((pedido.getCliente().getUsuario().getDni() != null ?
                pedido.getCliente().getUsuario().getDni() : "No especificado") + "\n", fuenteNormal));
        datosPersonales.add(new Chunk("Email: ", fuenteNegrita));
        datosPersonales.add(new Chunk(pedido.getCliente().getUsuario().getEmail() + "\n", fuenteNormal));
        datosPersonales.add(new Chunk("Teléfono: ", fuenteNegrita));
        datosPersonales.add(new Chunk(pedido.getCliente().getTelefono() + "\n", fuenteNormal));
        datosPersonales.add(new Chunk("Condición IVA: ", fuenteNegrita));
        datosPersonales.add(new Chunk("Consumidor Final", fuenteNormal));

        celdaDatos.addElement(datosPersonales);
        tablaCliente.addCell(celdaDatos);

        // Columna derecha - Datos de entrega
        PdfPCell celdaEntrega = new PdfPCell();
        celdaEntrega.setBorder(Rectangle.NO_BORDER);
        celdaEntrega.setPadding(5);

        Paragraph datosEntrega = new Paragraph();
        datosEntrega.add(new Chunk("Forma de entrega: ", fuenteNegrita));
        datosEntrega.add(new Chunk(pedido.getTipoEnvio() + "\n", fuenteNormal));
        datosEntrega.add(new Chunk("Forma de pago: ", fuenteNegrita));
        datosEntrega.add(new Chunk(pedido.getFormaPago() + "\n", fuenteNormal));

        if (pedido.getDomicilio() != null) {
            datosEntrega.add(new Chunk("Domicilio: ", fuenteNegrita));
            datosEntrega.add(new Chunk(
                    pedido.getDomicilio().getCalle() + " " +
                            pedido.getDomicilio().getNumero() +
                            (pedido.getDomicilio().getPiso() != null ? ", Piso " + pedido.getDomicilio().getPiso() : "") +
                            (pedido.getDomicilio().getNroDepartamento() != null ? ", Depto " + pedido.getDomicilio().getNroDepartamento() : "") +
                            "\n" + pedido.getDomicilio().getLocalidad().getNombre(), fuenteNormal));
        }

        celdaEntrega.addElement(datosEntrega);
        tablaCliente.addCell(celdaEntrega);

        document.add(tablaCliente);

        // Línea separadora sutil
        PdfPTable lineaSeparadora = new PdfPTable(1);
        lineaSeparadora.setWidthPercentage(100);
        lineaSeparadora.setSpacingAfter(5);

        PdfPCell celdaLinea = new PdfPCell();
        celdaLinea.setBorder(Rectangle.NO_BORDER);
        celdaLinea.setBackgroundColor(COLOR_BORDE);
        celdaLinea.setFixedHeight(1);

        lineaSeparadora.addCell(celdaLinea);
        document.add(lineaSeparadora);
    }

    private void crearTablaProductos(Document document, Pedido pedido, Font fuenteNormal) throws DocumentException {
        // Tabla de productos sin título
        PdfPTable tablaProductos = new PdfPTable(5);
        tablaProductos.setWidthPercentage(100);
        tablaProductos.setWidths(new float[]{8, 47, 15, 15, 15});
        tablaProductos.setSpacingAfter(5);

        // Headers con estilo
        String[] headers = {"#", "Descripción", "Cant.", "Precio Unit.", "Subtotal"};
        for (String header : headers) {
            PdfPCell celda = new PdfPCell(new Phrase(header, new Font(Font.HELVETICA, 10, Font.BOLD, COLOR_BLANCO)));
            celda.setBackgroundColor(COLOR_PRIMARIO);
            celda.setPadding(5);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setBorder(Rectangle.NO_BORDER);
            tablaProductos.addCell(celda);
        }

        // Productos con filas alternadas
        int contador = 1;
        boolean filaAlterna = false;

        if (pedido.getDetalles() != null) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                // Determinar si es promoción o artículo individual
                boolean esPromocion = detalle.getPromocion() != null;
                Color colorFondo = esPromocion ? COLOR_PROMOCION : (filaAlterna ? COLOR_FONDO_SUAVE : COLOR_BLANCO);

                if (esPromocion) {
                    // Agregar información de la promoción
                    agregarFilaPromocion(tablaProductos, detalle, contador++, colorFondo, fuenteNormal);
                } else {
                    // Agregar información del artículo individual
                    agregarFilaArticulo(tablaProductos, detalle, contador++, colorFondo, fuenteNormal);
                }

                filaAlterna = !filaAlterna;
            }
        }

        document.add(tablaProductos);
    }

    private void agregarFilaArticulo(PdfPTable tabla, DetallePedido detalle, int contador, Color colorFondo, Font fuenteNormal) {
        // Número
        PdfPCell celdaNum = crearCeldaProducto(String.valueOf(contador), fuenteNormal, colorFondo, Element.ALIGN_CENTER);
        tabla.addCell(celdaNum);

        // Descripción
        PdfPCell celdaDesc = crearCeldaProducto(detalle.getArticulo().getDenominacion(), fuenteNormal, colorFondo, Element.ALIGN_LEFT);
        tabla.addCell(celdaDesc);

        // Cantidad
        PdfPCell celdaCant = crearCeldaProducto(detalle.getCantidad().toString(), fuenteNormal, colorFondo, Element.ALIGN_CENTER);
        tabla.addCell(celdaCant);

        // Precio
        PdfPCell celdaPrecio = crearCeldaProducto(formatCurrency(detalle.getArticulo().getPrecioVenta()), fuenteNormal, colorFondo, Element.ALIGN_RIGHT);
        tabla.addCell(celdaPrecio);

        // Subtotal
        PdfPCell celdaSubtotal = crearCeldaProducto(formatCurrency(detalle.getSubTotal()), fuenteNormal, colorFondo, Element.ALIGN_RIGHT);
        tabla.addCell(celdaSubtotal);
    }

    private void agregarFilaPromocion(PdfPTable tabla, DetallePedido detalle, int contador, Color colorFondo, Font fuenteNormal) {
        Promocion promocion = detalle.getPromocion();

        // Número
        PdfPCell celdaNum = crearCeldaProducto(String.valueOf(contador), fuenteNormal, colorFondo, Element.ALIGN_CENTER);
        tabla.addCell(celdaNum);

        // Descripción de la promoción con detalles
        StringBuilder descripcionPromocion = new StringBuilder();
        descripcionPromocion.append("🎉 PROMOCIÓN: ").append(promocion.getDenominacion());

        if (promocion.getDescripcionDescuento() != null && !promocion.getDescripcionDescuento().isEmpty()) {
            descripcionPromocion.append("\n   ").append(promocion.getDescripcionDescuento());
        }

        // Agregar detalles de los artículos incluidos en la promoción
        if (promocion.getDetalles() != null && !promocion.getDetalles().isEmpty()) {
            descripcionPromocion.append("\n   Incluye:");
            for (DetallePromocion detallePromo : promocion.getDetalles()) {
                if (detallePromo.getArticulo() != null) {
                    descripcionPromocion.append("\n   • ")
                            .append(detallePromo.getCantidad())
                            .append("x ")
                            .append(detallePromo.getArticulo().getDenominacion());
                }
            }
        }

        Font fuentePromocion = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, COLOR_PRIMARIO);
        PdfPCell celdaDesc = crearCeldaProducto(descripcionPromocion.toString(), fuentePromocion, colorFondo, Element.ALIGN_LEFT);
        tabla.addCell(celdaDesc);

        // Cantidad de promociones
        PdfPCell celdaCant = crearCeldaProducto(detalle.getCantidad().toString(), fuenteNormal, colorFondo, Element.ALIGN_CENTER);
        tabla.addCell(celdaCant);

        // Precio promocional
        Double precioUnitario = promocion.getPrecioPromocional() != null ? promocion.getPrecioPromocional() : 0.0;
        PdfPCell celdaPrecio = crearCeldaProducto(formatCurrency(precioUnitario), fuenteNormal, colorFondo, Element.ALIGN_RIGHT);
        tabla.addCell(celdaPrecio);

        // Subtotal
        PdfPCell celdaSubtotal = crearCeldaProducto(formatCurrency(detalle.getSubTotal()), fuenteNormal, colorFondo, Element.ALIGN_RIGHT);
        tabla.addCell(celdaSubtotal);
    }

    private PdfPCell crearCeldaProducto(String contenido, Font fuente, Color colorFondo, int alineacion) {
        PdfPCell celda = new PdfPCell(new Phrase(contenido, fuente));
        celda.setBackgroundColor(colorFondo);
        celda.setPadding(5);
        celda.setHorizontalAlignment(alineacion);
        celda.setBorder(Rectangle.NO_BORDER);
        celda.setBorderColorBottom(COLOR_BORDE);
        celda.setBorderWidthBottom(0.5f);
        celda.setBorder(Rectangle.BOTTOM);
        return celda;
    }

    private void crearSeccionTotales(Document document, Pedido pedido, Font fuenteTotal, Font fuenteNormal, Font fuenteAcento) throws DocumentException {
        // Tabla de totales con diseño atractivo
        PdfPTable tablaTotales = new PdfPTable(2);
        tablaTotales.setWidthPercentage(40);
        tablaTotales.setHorizontalAlignment(Element.ALIGN_RIGHT);
        tablaTotales.setSpacingAfter(5);

        // Celda TOTAL
        PdfPCell celdaTextoTotal = new PdfPCell(new Phrase("TOTAL:", fuenteTotal));
        celdaTextoTotal.setBorder(Rectangle.NO_BORDER);
        celdaTextoTotal.setBackgroundColor(Color.WHITE);
        celdaTextoTotal.setPadding(8);
        celdaTextoTotal.setHorizontalAlignment(Element.ALIGN_CENTER);

        // Celda con el monto
        PdfPCell celdaMontoTotal = new PdfPCell(new Phrase(formatCurrency(pedido.getTotal()),
                new Font(Font.HELVETICA, 16, Font.BOLD, COLOR_BLANCO)));
        celdaMontoTotal.setBorder(Rectangle.NO_BORDER);
        celdaMontoTotal.setBackgroundColor(COLOR_ACENTO);
        celdaMontoTotal.setPadding(8);
        celdaMontoTotal.setHorizontalAlignment(Element.ALIGN_CENTER);

        tablaTotales.addCell(celdaTextoTotal);
        tablaTotales.addCell(celdaMontoTotal);
        document.add(tablaTotales);

        // Total en letras con estilo
        Paragraph totalLetras = new Paragraph("Son: " + convertirNumeroALetras(pedido.getTotal().intValue()) + " pesos",
                new Font(Font.HELVETICA, 9, Font.ITALIC, COLOR_TEXTO_SECUNDARIO));
        totalLetras.setAlignment(Element.ALIGN_RIGHT);
        totalLetras.setSpacingAfter(10);
        document.add(totalLetras);
    }

    // Métodos auxiliares
    private String formatearFecha(LocalDateTime fecha) {
        if (fecha == null) return "Fecha no disponible";
        return fecha.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    private String formatCurrency(Double value) {
        if (value == null) return "$0,00";
        NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("es", "AR"));
        return nf.format(value);
    }

    private String convertirNumeroALetras(int numero) {
        String[] unidades = {"", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"};
        String[] decenas = {"", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"};
        String[] especiales = {"diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"};
        String[] centenas = {"", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"};

        if (numero == 0) return "cero";
        if (numero < 0) return "menos " + convertirNumeroALetras(Math.abs(numero));

        if (numero < 10) return unidades[numero];
        if (numero == 100) return "cien";
        if (numero < 20) return especiales[numero - 10];
        if (numero < 100) {
            int unidad = numero % 10;
            int decena = numero / 10;
            return unidad == 0 ? decenas[decena] : decenas[decena] + " y " + unidades[unidad];
        }
        if (numero < 1000) {
            int centena = numero / 100;
            int resto = numero % 100;
            return resto == 0 ? centenas[centena] : centenas[centena] + " " + convertirNumeroALetras(resto);
        }
        if (numero < 1000000) {
            int miles = numero / 1000;
            int resto = numero % 1000;
            String milStr = miles == 1 ? "mil" : convertirNumeroALetras(miles) + " mil";
            return resto == 0 ? milStr : milStr + " " + convertirNumeroALetras(resto);
        }

        return String.valueOf(numero);
    }
}
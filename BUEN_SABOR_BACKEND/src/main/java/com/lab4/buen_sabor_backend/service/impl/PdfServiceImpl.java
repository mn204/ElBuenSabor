package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Articulo;
import com.lab4.buen_sabor_backend.model.DetallePedido;
import com.lab4.buen_sabor_backend.model.Pedido;
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

    private static final Color COLOR_PRIMARIO = new Color(45, 55, 72);
    private static final Color COLOR_SECUNDARIO = new Color(74, 85, 104);
    private static final Color COLOR_ACENTO = new Color(56, 178, 172);
    private static final Color COLOR_FONDO_SUAVE = new Color(247, 250, 252);
    private static final Color COLOR_TEXTO_SECUNDARIO = new Color(113, 128, 150);
    private static final Color COLOR_BLANCO = Color.WHITE;
    private static final Color COLOR_BORDE = new Color(226, 232, 240);

    @Override
    public byte[] generarFacturaPedido(Pedido pedido) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            Font fuenteTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, COLOR_PRIMARIO);
            Font fuenteSubtitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, COLOR_SECUNDARIO);
            Font fuenteNormal = FontFactory.getFont(FontFactory.HELVETICA, 10, COLOR_PRIMARIO);
            Font fuenteNegrita = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, COLOR_PRIMARIO);
            Font fuentePequena = FontFactory.getFont(FontFactory.HELVETICA, 9, COLOR_TEXTO_SECUNDARIO);
            Font fuenteAcento = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, COLOR_ACENTO);
            Font fuenteTotal = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, COLOR_PRIMARIO);

            String cae = "X" + String.format("%012d", pedido.getId());
            LocalDateTime fechaVtoCae = pedido.getFechaPedido().plusDays(10);


            // Header con B centrada y línea
            crearHeader(document, pedido);

            // Datos del cliente sin títulos
            crearSeccionCliente(document, pedido, fuenteNormal, fuenteNegrita);

            // Tabla de productos sin título
            crearTablaProductos(document, pedido, fuenteNormal);

            // Totales
            crearSeccionTotales(document, pedido, fuenteTotal, fuenteNormal, fuenteAcento);

            // Footer
            crearFooter(document, cae, fuentePequena, writer);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error al generar la factura PDF: " + e.getMessage(), e);
        }
    }


    private void crearHeader(Document document, Pedido pedido) throws DocumentException {
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

        // Columna central - B centrada con rectángulo hasta la mitad
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
        Font fuenteFactura = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, COLOR_PRIMARIO);

        Paragraph datosFiscal = new Paragraph();
        datosFiscal.setAlignment(Element.ALIGN_RIGHT);
        datosFiscal.add(new Chunk("FACTURA B\n", fuenteFactura));
        datosFiscal.add(new Chunk("N°: " + codSucursal + "-" + codPedido + "\n", fuenteFactura));
        datosFiscal.add(new Chunk("Fecha: " + formatearFecha(pedido.getFechaPedido()) + "\n", fuenteFiscal));
        datosFiscal.add(new Chunk("CAE: X" + String.format("%012d", pedido.getId()) + "\n", fuenteFiscal));
        datosFiscal.add(new Chunk("Vto. CAE: " + formatearFecha(pedido.getFechaPedido().plusDays(10)), fuenteFiscal));

        celdaFiscal.addElement(datosFiscal);
        tablaHeader.addCell(celdaFiscal);

        document.add(tablaHeader);

        // Línea horizontal debajo del header
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

    private void crearSeccionCliente(Document document, Pedido pedido, Font fuenteNormal, Font fuenteNegrita) throws DocumentException {
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
                Color colorFondo = filaAlterna ? COLOR_FONDO_SUAVE : COLOR_BLANCO;

                // Número
                PdfPCell celdaNum = crearCeldaProducto(String.valueOf(contador++), fuenteNormal, colorFondo, Element.ALIGN_CENTER);
                tablaProductos.addCell(celdaNum);

                // Descripción
                PdfPCell celdaDesc = crearCeldaProducto(detalle.getArticulo().getDenominacion(), fuenteNormal, colorFondo, Element.ALIGN_LEFT);
                tablaProductos.addCell(celdaDesc);

                // Cantidad
                PdfPCell celdaCant = crearCeldaProducto(detalle.getCantidad().toString(), fuenteNormal, colorFondo, Element.ALIGN_CENTER);
                tablaProductos.addCell(celdaCant);

                // Precio
                PdfPCell celdaPrecio = crearCeldaProducto(formatCurrency(detalle.getArticulo().getPrecioVenta()), fuenteNormal, colorFondo, Element.ALIGN_RIGHT);
                tablaProductos.addCell(celdaPrecio);

                // Subtotal
                PdfPCell celdaSubtotal = crearCeldaProducto(formatCurrency(detalle.getSubTotal()), fuenteNormal, colorFondo, Element.ALIGN_RIGHT);
                tablaProductos.addCell(celdaSubtotal);

                filaAlterna = !filaAlterna;
            }
        }

        document.add(tablaProductos);
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
        celdaTextoTotal.setBackgroundColor(COLOR_PRIMARIO);
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

    private void crearFooter(Document document, String cae, Font fuentePequena, PdfWriter writer) {
        PdfContentByte cb = writer.getDirectContent();
        float y = document.bottom() - 20;

        // Línea decorativa
        cb.setColorFill(COLOR_ACENTO);
        cb.rectangle(document.left(), y + 30, document.right() - document.left(), 2);
        cb.fill();

        ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                new Phrase("Documento no válido como factura", new Font(Font.HELVETICA, 9, Font.BOLD, COLOR_TEXTO_SECUNDARIO)),
                (document.left() + document.right()) / 2, y + 20, 0);

        ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                new Phrase("Verificación AFIP: www.afip.gob.ar/qr/" + cae, fuentePequena),
                (document.left() + document.right()) / 2, y + 10, 0);

        ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                new Phrase("Gracias por elegir El Buen Sabor", new Font(Font.HELVETICA, 8, Font.ITALIC, COLOR_ACENTO)),
                (document.left() + document.right()) / 2, y, 0);

        ColumnText.showTextAligned(cb, Element.ALIGN_RIGHT,
                new Phrase("Página " + writer.getPageNumber(), new Font(Font.HELVETICA, 8, Font.NORMAL, COLOR_TEXTO_SECUNDARIO)),
                document.right(), document.bottom() - 30, 0);
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

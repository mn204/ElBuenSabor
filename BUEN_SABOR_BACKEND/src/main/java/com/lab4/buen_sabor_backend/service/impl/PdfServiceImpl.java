package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Articulo;
import com.lab4.buen_sabor_backend.model.DetallePedido;
import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.service.PdfService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class PdfServiceImpl implements PdfService {

    private static final Color COLOR_AZUL_CLARO = new Color(51, 153, 255);
    private static final Color COLOR_GRIS_CLARO = new Color(240, 240, 240);
    private static final Color COLOR_GRIS_OSCURO = new Color(100, 100, 100);

    @Override
    public byte[] generarFacturaPedido(Pedido pedido) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // Configuración del documento
            Document document = new Document(PageSize.A4);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Fuentes
            Font fuenteTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, COLOR_AZUL_CLARO);
            Font fuenteSubtitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Font fuenteNormal = FontFactory.getFont(FontFactory.HELVETICA, 10);
            Font fuenteNegrita = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
            Font fuentePequena = FontFactory.getFont(FontFactory.HELVETICA, 8, COLOR_GRIS_OSCURO);
            Font fuenteGrande = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            // Generar CAE y fecha vencimiento
            String cae = "X" + String.format("%012d", pedido.getId());
            LocalDateTime fechaVtoCae = pedido.getFechaPedido().plusDays(10);

            // ENCABEZADO DE LA FACTURA
            PdfPTable tablaEncabezado = new PdfPTable(3);
            tablaEncabezado.setWidthPercentage(100);
            tablaEncabezado.setWidths(new float[]{30, 40, 30});
            tablaEncabezado.getDefaultCell().setBorder(Rectangle.NO_BORDER);

            // Columna 1: Logo y datos empresa
            PdfPCell celdaEmpresa = new PdfPCell();
            celdaEmpresa.setBorder(Rectangle.NO_BORDER);
            celdaEmpresa.setPaddingBottom(10);

            Paragraph parrafoEmpresa = new Paragraph();
            parrafoEmpresa.add(new Chunk("EL BUEN SABOR S.A.\n", fuenteNegrita));
            parrafoEmpresa.add(new Chunk("CUIT: 20-30405060-7\n", fuenteNormal));
            parrafoEmpresa.add(new Chunk("Responsable Inscripto\n", fuenteNormal));

            // Agregar domicilio de la sucursal si está disponible
            if (pedido.getSucursal() != null && pedido.getSucursal().getDomicilio() != null) {
                parrafoEmpresa.add(new Chunk(
                        pedido.getSucursal().getDomicilio().getCalle() + " " +
                                pedido.getSucursal().getDomicilio().getNumero() + ", " +
                                pedido.getSucursal().getDomicilio().getLocalidad().getNombre() + "\n",
                        fuenteNormal
                ));
            }

            parrafoEmpresa.add(new Chunk("www.elbuensabor.com.ar", fuentePequena));
            celdaEmpresa.addElement(parrafoEmpresa);
            tablaEncabezado.addCell(celdaEmpresa);

            // Columna 2: Tipo de factura
            PdfPCell celdaTipoFactura = new PdfPCell();
            celdaTipoFactura.setBorder(Rectangle.BOX);
            celdaTipoFactura.setBorderWidth(2);
            celdaTipoFactura.setBorderColor(COLOR_AZUL_CLARO);
            celdaTipoFactura.setHorizontalAlignment(Element.ALIGN_CENTER);
            celdaTipoFactura.setVerticalAlignment(Element.ALIGN_MIDDLE);

            Paragraph parrafoTipoFactura = new Paragraph();
            parrafoTipoFactura.setAlignment(Element.ALIGN_CENTER);
            parrafoTipoFactura.add(new Chunk("FACTURA\n", fuenteTitulo));
            parrafoTipoFactura.add(new Chunk("B\n", new Font(Font.HELVETICA, 30, Font.BOLD, COLOR_AZUL_CLARO)));
            parrafoTipoFactura.add(new Chunk("N°: 0001-" + String.format("%08d", pedido.getId()), fuenteNegrita));

            celdaTipoFactura.addElement(parrafoTipoFactura);
            tablaEncabezado.addCell(celdaTipoFactura);

            // Columna 3: Fecha y datos fiscales
            PdfPCell celdaDatosFiscales = new PdfPCell();
            celdaDatosFiscales.setBorder(Rectangle.NO_BORDER);
            celdaDatosFiscales.setHorizontalAlignment(Element.ALIGN_RIGHT);

            Paragraph parrafoDatosFiscales = new Paragraph();
            parrafoDatosFiscales.setAlignment(Element.ALIGN_RIGHT);
            parrafoDatosFiscales.add(new Chunk("Fecha: " + formatearFecha(pedido.getFechaPedido()) + "\n", fuenteNormal));
            parrafoDatosFiscales.add(new Chunk("CAE: " + cae + "\n", fuenteNormal));
            parrafoDatosFiscales.add(new Chunk("Vto. CAE: " + formatearFecha(fechaVtoCae) + "\n", fuenteNormal));
            parrafoDatosFiscales.add(new Chunk("Sucursal: " + pedido.getSucursal().getNombre(), fuenteNormal));

            celdaDatosFiscales.addElement(parrafoDatosFiscales);
            tablaEncabezado.addCell(celdaDatosFiscales);

            document.add(tablaEncabezado);

            // Línea separadora
            agregarLineaSeparadora(document);

            // DATOS DEL CLIENTE
            PdfPTable tablaCliente = new PdfPTable(2);
            tablaCliente.setWidthPercentage(100);
            tablaCliente.setWidths(new float[]{50, 50});
            tablaCliente.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            tablaCliente.setSpacingBefore(10);
            tablaCliente.setSpacingAfter(10);

            // Columna 1: Datos personales
            PdfPCell celdaDatosCliente = new PdfPCell();
            celdaDatosCliente.setBorder(Rectangle.NO_BORDER);

            Paragraph parrafoDatosCliente = new Paragraph();
            parrafoDatosCliente.add(new Chunk("DATOS DEL CLIENTE\n", fuenteSubtitulo));
            parrafoDatosCliente.add(new Chunk("Nombre: " + pedido.getCliente().getNombre() + " " + pedido.getCliente().getApellido() + "\n", fuenteNormal));
            parrafoDatosCliente.add(new Chunk("DNI: " + (pedido.getCliente().getUsuario().getDni() != null ?
                    pedido.getCliente().getUsuario().getDni() : "No especificado") + "\n", fuenteNormal));
            parrafoDatosCliente.add(new Chunk("Email: " + pedido.getCliente().getUsuario().getEmail() + "\n", fuenteNormal));
            parrafoDatosCliente.add(new Chunk("Teléfono: " + pedido.getCliente().getTelefono() + "\n", fuenteNormal));
            parrafoDatosCliente.add(new Chunk("Condición IVA: Consumidor Final", fuenteNormal));

            celdaDatosCliente.addElement(parrafoDatosCliente);
            tablaCliente.addCell(celdaDatosCliente);

            // Columna 2: Datos de entrega
            PdfPCell celdaDatosEntrega = new PdfPCell();
            celdaDatosEntrega.setBorder(Rectangle.NO_BORDER);

            Paragraph parrafoDatosEntrega = new Paragraph();
            parrafoDatosEntrega.add(new Chunk("DATOS DE ENTREGA\n", fuenteSubtitulo));
            parrafoDatosEntrega.add(new Chunk("Forma de entrega: " + pedido.getTipoEnvio() + "\n", fuenteNormal));
            parrafoDatosEntrega.add(new Chunk("Forma de pago: " + pedido.getFormaPago() + "\n", fuenteNormal));

            // Agregar domicilio de entrega si está disponible
            if (pedido.getDomicilio() != null) {
                parrafoDatosEntrega.add(new Chunk("Domicilio: " +
                        pedido.getDomicilio().getCalle() + " " +
                        pedido.getDomicilio().getNumero() +
                        (pedido.getDomicilio().getPiso() != null ? ", Piso " + pedido.getDomicilio().getPiso() : "") +
                        (pedido.getDomicilio().getNroDepartamento() != null ? ", Depto " + pedido.getDomicilio().getNroDepartamento() : "") +
                        ", " + pedido.getDomicilio().getLocalidad().getNombre(), fuenteNormal));
            }

            celdaDatosEntrega.addElement(parrafoDatosEntrega);
            tablaCliente.addCell(celdaDatosEntrega);

            document.add(tablaCliente);

            // DETALLE DE PRODUCTOS
            Paragraph tituloDetalle = new Paragraph("DETALLE DE PRODUCTOS", fuenteSubtitulo);
            tituloDetalle.setSpacingBefore(10);
            tituloDetalle.setSpacingAfter(5);
            document.add(tituloDetalle);

            PdfPTable tablaDetalle = new PdfPTable(5);
            tablaDetalle.setWidthPercentage(100);
            tablaDetalle.setWidths(new float[]{5, 45, 15, 15, 20});
            tablaDetalle.setSpacingAfter(10);

            // Encabezados de la tabla
            String[] encabezados = {"#", "Descripción", "Cantidad", "Precio Unit.", "Subtotal"};
            for (String encabezado : encabezados) {
                PdfPCell celda = new PdfPCell(new Phrase(encabezado, fuenteNegrita));
                celda.setBackgroundColor(COLOR_GRIS_CLARO);
                celda.setPadding(5);
                celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                tablaDetalle.addCell(celda);
            }

            // Detalle de productos
            int contador = 1;
            if (pedido.getDetalles() != null) {
                for (DetallePedido detalle : pedido.getDetalles()) {
                    Articulo articulo = detalle.getArticulo();

                    // Número de ítem
                    PdfPCell celdaNumero = new PdfPCell(new Phrase(String.valueOf(contador++), fuenteNormal));
                    celdaNumero.setHorizontalAlignment(Element.ALIGN_CENTER);
                    tablaDetalle.addCell(celdaNumero);

                    // Descripción
                    tablaDetalle.addCell(new Phrase(articulo.getDenominacion(), fuenteNormal));

                    // Cantidad
                    PdfPCell celdaCantidad = new PdfPCell(new Phrase(detalle.getCantidad().toString(), fuenteNormal));
                    celdaCantidad.setHorizontalAlignment(Element.ALIGN_CENTER);
                    tablaDetalle.addCell(celdaCantidad);

                    // Precio unitario
                    PdfPCell celdaPrecio = new PdfPCell(new Phrase(formatCurrency(articulo.getPrecioVenta()), fuenteNormal));
                    celdaPrecio.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    tablaDetalle.addCell(celdaPrecio);

                    // Subtotal
                    PdfPCell celdaSubtotal = new PdfPCell(new Phrase(formatCurrency(detalle.getSubTotal()), fuenteNormal));
                    celdaSubtotal.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    tablaDetalle.addCell(celdaSubtotal);
                }
            }

            document.add(tablaDetalle);

            // TOTALES
            PdfPTable tablaTotales = new PdfPTable(2);
            tablaTotales.setWidthPercentage(40);
            tablaTotales.setHorizontalAlignment(Element.ALIGN_RIGHT);
            tablaTotales.setSpacingAfter(10);

            // Como no tenemos información detallada de impuestos, mostramos solo el total
            tablaTotales.addCell(new PdfPCell(new Phrase("TOTAL:", fuenteGrande)));

            PdfPCell celdaTotal = new PdfPCell(new Phrase(formatCurrency(pedido.getTotal()), fuenteGrande));
            celdaTotal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            celdaTotal.setBackgroundColor(COLOR_GRIS_CLARO);
            tablaTotales.addCell(celdaTotal);

            document.add(tablaTotales);

            // Total en letras
            Paragraph totalLetras = new Paragraph("Son: " + convertirNumeroALetras(pedido.getTotal().intValue()) + " pesos", fuenteNormal);
            totalLetras.setAlignment(Element.ALIGN_RIGHT);
            document.add(totalLetras);

            // Línea separadora
            agregarLineaSeparadora(document);

            // PIE DE PÁGINA
            Paragraph piePagina = new Paragraph();
            piePagina.setAlignment(Element.ALIGN_CENTER);
            piePagina.add(new Chunk("Documento no válido como factura", fuentePequena));
            document.add(piePagina);

            // Código QR (simulado con texto)
            Paragraph codigoQR = new Paragraph("Verificación AFIP: www.afip.gob.ar/qr/" + cae, fuentePequena);
            codigoQR.setAlignment(Element.ALIGN_CENTER);
            document.add(codigoQR);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al generar la factura PDF: " + e.getMessage(), e);
        }
    }

    private void agregarLineaSeparadora(Document document) throws DocumentException {
        PdfPTable separator = new PdfPTable(1);
        separator.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderWidthBottom(1);
        cell.setBorderColor(COLOR_GRIS_CLARO);
        cell.setFixedHeight(5);
        cell.setPadding(0);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        separator.addCell(cell);
        document.add(separator);
    }

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
        // Método básico para convertir números a letras
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

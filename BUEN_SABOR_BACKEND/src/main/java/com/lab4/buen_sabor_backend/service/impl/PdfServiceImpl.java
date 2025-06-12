package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Articulo;
import com.lab4.buen_sabor_backend.model.DetallePedido;
import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.service.PdfService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;

@Service
public class PdfServiceImpl implements PdfService {

    @Override
    public byte[] generarFacturaPedido(Pedido pedido) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            // Título
            Paragraph title = new Paragraph("Factura - Pedido #" + pedido.getId(), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" ")); // espacio

            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            // Datos generales del pedido
            document.add(new Paragraph("Fecha: " + sdf.format(pedido.getFechaPedido()), normalFont));
            document.add(new Paragraph("Cliente: " + pedido.getCliente().getNombre() + " " + pedido.getCliente().getApellido(), normalFont));
            document.add(new Paragraph("Domicilio: " + pedido.getDomicilio().getLocalidad() + ", " + pedido.getDomicilio().getCalle() + ", " + pedido.getDomicilio().getNumero(), normalFont));
            document.add(new Paragraph("Sucursal: " + pedido.getSucursal().getNombre(), normalFont));
            document.add(new Paragraph("Forma de entrega: " + pedido.getTipoEnvio(), normalFont));
            document.add(new Paragraph("Forma de pago: " + pedido.getFormaPago(), normalFont));
            document.add(new Paragraph(" "));

            // Tabla de ítems
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{4, 1, 2, 2});

            addTableHeader(table, "Artículo", "Cantidad", "Precio", "Subtotal");

            for (DetallePedido detalle : pedido.getDetalles()) {
                Articulo articulo = detalle.getArticulo();
                String nombreArticulo = articulo.getDenominacion();
                Double precioUnitario = articulo.getPrecioVenta();
                Integer cantidad = detalle.getCantidad();
                Double subtotal = detalle.getSubTotal();

                table.addCell(nombreArticulo);
                table.addCell(cantidad.toString());
                table.addCell("$" + String.format("%.2f", precioUnitario));
                table.addCell("$" + String.format("%.2f", subtotal));
            }

            document.add(table);
            document.add(new Paragraph(" "));

            // Totales
            //document.add(new Paragraph("Subtotal: $" + calcularSubtotal(pedido), normalFont));
            //document.add(new Paragraph("Descuento: $" + calcularDescuento(pedido), normalFont));
            document.add(new Paragraph("Total: $" + pedido.getTotal(), normalFont));

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error al generar la factura PDF", e);
        }
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header));
            cell.setBackgroundColor(Color.LIGHT_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }
}

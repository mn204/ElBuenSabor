package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.service.ExcelService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.usermodel.Footer;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Service
public class ExcelServiceImpl implements ExcelService {

    @Override
    public byte[] exportarPedidosAExcel(List<Pedido> pedidos) {
        // Ordenar los pedidos por fecha descendente
        pedidos.sort(Comparator.comparing(Pedido::getFechaPedido).reversed());

        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Pedidos");

            // Estilos
            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            CellStyle dateStyle = workbook.createCellStyle();
            CreationHelper creationHelper = workbook.getCreationHelper();
            dateStyle.setDataFormat(creationHelper.createDataFormat().getFormat("dd/MM/yyyy HH:mm"));

            CellStyle currencyStyle = workbook.createCellStyle();
            currencyStyle.setDataFormat(creationHelper.createDataFormat().getFormat("$#,##0.00"));

            CellStyle zebraStyle1 = workbook.createCellStyle();
            zebraStyle1.cloneStyleFrom(workbook.createCellStyle());
            zebraStyle1.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
            zebraStyle1.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Título principal
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("Listado de Pedidos");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 7));

            // Encabezados
            String[] headers = {
                    "N°Pedido", "Sucursal", "Cliente", "Fecha del Pedido",
                    "Tipo de Envío", "Forma de Pago", "Total Costo", "Total"
            };

            Row headerRow = sheet.createRow(1);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Congelar encabezados
            sheet.createFreezePane(0, 2);

            // Datos
            int rowIdx = 2;
            double sumaTotal = 0;
            double sumaCosto = 0;

            for (Pedido pedido : pedidos) {
                Row row = sheet.createRow(rowIdx);
                CellStyle rowStyle = (rowIdx % 2 == 0) ? zebraStyle1 : null;

                Cell c0 = row.createCell(0);
                c0.setCellValue(pedido.getId());
                if (rowStyle != null) c0.setCellStyle(rowStyle);

                Cell c1 = row.createCell(1);
                c1.setCellValue(pedido.getSucursal().getNombre());
                if (rowStyle != null) c1.setCellStyle(rowStyle);

                Cell c2 = row.createCell(2);
                c2.setCellValue(pedido.getCliente().getNombre() + " " + pedido.getCliente().getApellido());
                if (rowStyle != null) c2.setCellStyle(rowStyle);

                Cell c3 = row.createCell(3);
                c3.setCellValue(pedido.getFechaPedido());
                c3.setCellStyle(dateStyle);

                Cell c4 = row.createCell(4);
                c4.setCellValue(pedido.getTipoEnvio().toString());
                if (rowStyle != null) c4.setCellStyle(rowStyle);

                Cell c5 = row.createCell(5);
                c5.setCellValue(pedido.getFormaPago().toString());
                if (rowStyle != null) c5.setCellStyle(rowStyle);

                Cell c6 = row.createCell(6);
                c6.setCellValue(pedido.getTotalCosto());
                c6.setCellStyle(currencyStyle);

                Cell c7 = row.createCell(7);
                c7.setCellValue(pedido.getTotal());
                c7.setCellStyle(currencyStyle);

                sumaCosto += pedido.getTotalCosto() != null ? pedido.getTotalCosto() : 0;
                sumaTotal += pedido.getTotal() != null ? pedido.getTotal() : 0;

                rowIdx++;
            }

            // Fila vacía
            rowIdx++;

            // Fila resumen
            Row resumenRow1 = sheet.createRow(rowIdx++);
            resumenRow1.createCell(6).setCellValue("Total Costo:");
            Cell costoCell = resumenRow1.createCell(7);
            costoCell.setCellValue(sumaCosto);
            costoCell.setCellStyle(currencyStyle);

            Row resumenRow2 = sheet.createRow(rowIdx++);
            resumenRow2.createCell(6).setCellValue("Total:");
            Cell totalCell = resumenRow2.createCell(7);
            totalCell.setCellValue(sumaTotal);
            totalCell.setCellStyle(currencyStyle);

            Row resumenRow3 = sheet.createRow(rowIdx);
            resumenRow3.createCell(6).setCellValue("Ganancia:");
            Cell gananciaCell = resumenRow3.createCell(7);
            gananciaCell.setCellValue(sumaTotal - sumaCosto);
            gananciaCell.setCellStyle(currencyStyle);

            // Autoajuste de columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Pie de página
            Footer footer = sheet.getFooter();
            footer.setCenter("Generado por el sistema Buen Sabor - " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));

            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Error al generar el Excel de pedidos", e);
        }
    }
}

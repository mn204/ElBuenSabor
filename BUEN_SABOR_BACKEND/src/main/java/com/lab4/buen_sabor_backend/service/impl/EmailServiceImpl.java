package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.service.EmailService;
import com.lab4.buen_sabor_backend.service.PdfService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final PdfService pdfService;

    @Override
    public void enviarNotaCredito(Pedido pedido) {
        byte[] pdf = pdfService.generarNotaCreditoPedido(pedido);
        enviarEmailConPdf(pedido, "Nota de Crédito", "Adjunto encontrará la nota de crédito.", pdf);
    }

    @Override
    public void enviarFactura(Pedido pedido) {
        byte[] pdf = pdfService.generarFacturaPedido(pedido);
        enviarEmailConPdf(pedido, "Factura", "Adjunto encontrará la factura.", pdf);
    }

    private void enviarEmailConPdf(Pedido pedido, String asunto, String mensaje, byte[] pdfAdjunto) {
        String email = pedido.getCliente().getUsuario().getEmail();
        if (email == null || !email.contains("@")) return;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject(asunto);
            helper.setText(mensaje);
            helper.addAttachment(asunto + ".pdf", new ByteArrayResource(pdfAdjunto));

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("No se pudo enviar el email a " + email + ": " + e.getMessage());
        }
    }
}

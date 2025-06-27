package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Promocion;
import com.lab4.buen_sabor_backend.repository.PromocionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromocionScheduler {

    private final PromocionRepository promocionRepository;

    @Scheduled(cron = "0 * * * * *", zone = "America/Argentina/Buenos_Aires")
    public void actualizarEstadoPromociones() {
        OffsetDateTime ahora = OffsetDateTime.now(ZoneId.of("America/Argentina/Buenos_Aires"));
        LocalDate hoy = ahora.toLocalDate();
        LocalTime horaActual = ahora.toLocalTime();

        List<Promocion> promociones = promocionRepository.findAll();

        for (Promocion promocion : promociones) {
            LocalDate fechaDesde = promocion.getFechaDesde();
            LocalDate fechaHasta = promocion.getFechaHasta();
            LocalTime horaDesde = promocion.getHoraDesde();
            LocalTime horaHasta = promocion.getHoraHasta();

            boolean activa = false;

            if ((hoy.isAfter(fechaDesde) && hoy.isBefore(fechaHasta))
                    || (hoy.isEqual(fechaDesde) && !horaActual.isBefore(horaDesde) && (fechaDesde.isEqual(fechaHasta) ? !horaActual.isAfter(horaHasta) : true))
                    || (hoy.isEqual(fechaHasta) && !horaActual.isAfter(horaHasta) && !hoy.isBefore(fechaDesde))) {
                activa = true;
            }

            if (!Boolean.valueOf(activa).equals(promocion.getActiva())) {
                promocion.setActiva(activa);
                promocionRepository.save(promocion);
                log.info("Promoción '{}' actualizada a estado: {}", promocion.getDenominacion(), activa);
            }
        }
    }
}


package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.SucursalInsumo;
import com.lab4.buen_sabor_backend.repository.SucursalInsumoRepository;
import com.lab4.buen_sabor_backend.service.SucursalInsumoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SucursalInsumoServiceImpl extends MasterServiceImpl<SucursalInsumo, Long> implements SucursalInsumoService {

    private final SucursalInsumoRepository sucursalInsumoRepository;

    @Autowired
    public SucursalInsumoServiceImpl(SucursalInsumoRepository sucursalInsumoRepository, SucursalInsumoRepository sucursalInsumoRepository1) {
        super(sucursalInsumoRepository);
        this.sucursalInsumoRepository = sucursalInsumoRepository1;
    }

    @Override
    public SucursalInsumo findBySucursalIdAndArticuloInsumoId(Long sucursalId, Long articuloInsumoId) {
        return sucursalInsumoRepository.findBySucursalIdAndArticuloInsumoId(sucursalId, articuloInsumoId);
    }

    @Override
    public List<SucursalInsumo> obtenerConStockBajo(Long idSucursal) {
        if (idSucursal == null) {
            return sucursalInsumoRepository.findAllWithLowStock();
        } else {
            return sucursalInsumoRepository.findAllWithLowStockBySucursal(idSucursal);
        }
    }
    @Transactional
    public SucursalInsumo agregarStock(SucursalInsumo sucursalInsumo) {
        // Validaciones opcionales
        if (sucursalInsumo.getStockActual() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        SucursalInsumo stockActualizado = sucursalInsumoRepository.save(sucursalInsumo);

        return stockActualizado;
    }
}
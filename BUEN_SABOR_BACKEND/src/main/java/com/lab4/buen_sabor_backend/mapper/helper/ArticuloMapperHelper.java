package com.lab4.buen_sabor_backend.mapper.helper;

import com.lab4.buen_sabor_backend.dto.ArticuloDTO;
import com.lab4.buen_sabor_backend.dto.ArticuloInsumoDTO;
import com.lab4.buen_sabor_backend.dto.ArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.mapper.ArticuloInsumoMapper;
import com.lab4.buen_sabor_backend.mapper.ArticuloManufacturadoMapper;
import com.lab4.buen_sabor_backend.model.Articulo;
import org.springframework.stereotype.Component;

@Component
public class ArticuloMapperHelper {
    private final ArticuloInsumoMapper articuloInsumoMapper;
    private final ArticuloManufacturadoMapper articuloManufacturadoMapper;

    public ArticuloMapperHelper(ArticuloInsumoMapper articuloInsumoMapper,
                                ArticuloManufacturadoMapper articuloManufacturadoMapper) {
        this.articuloInsumoMapper = articuloInsumoMapper;
        this.articuloManufacturadoMapper = articuloManufacturadoMapper;
    }

    public Articulo mapArticuloDTOToEntity(ArticuloDTO dto) {
        if (dto == null) return null;

        if (dto instanceof ArticuloInsumoDTO) {
            return articuloInsumoMapper.toEntity((ArticuloInsumoDTO) dto);
        } else if (dto instanceof ArticuloManufacturadoDTO) {
            return articuloManufacturadoMapper.toEntity((ArticuloManufacturadoDTO) dto);
        } else {
            throw new IllegalArgumentException("Tipo de ArticuloDTO desconocido: " + dto.getClass());
        }
    }
}

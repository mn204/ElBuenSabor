package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.MasterDTO;
import com.lab4.buen_sabor_backend.model.Master;

import java.util.List;

public interface MasterMapper<E extends Master,D extends MasterDTO>{
    D toDTO(E source);
    E toEntity(D source);
    List<D> toDTOsList(List<E> source);
    List<E> toEntitiesList(List<D> source);
}

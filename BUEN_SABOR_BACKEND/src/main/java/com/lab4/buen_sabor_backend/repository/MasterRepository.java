package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Master;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.*;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.io.Serializable;
import java.util.*;

@NoRepositoryBean
public interface MasterRepository<E extends Master, ID extends Serializable> extends JpaRepository<E, ID> {

    @Transactional
    @Modifying
    @Query("UPDATE #{#entityName} e SET e.eliminado = true WHERE e.id = :id")
    void bajaLogica(@Param("id") ID id);

    List<E> findAllByEliminadoFalse();

    Optional<E> findByIdAndEliminadoFalse(ID id);

    Page<E> findAllByEliminadoFalse(Pageable pageable);
}


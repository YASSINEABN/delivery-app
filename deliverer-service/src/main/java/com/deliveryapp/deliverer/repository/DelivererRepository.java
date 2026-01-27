package com.deliveryapp.deliverer.repository;

import com.deliveryapp.deliverer.entity.Deliverer;
import com.deliveryapp.deliverer.entity.DelivererStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DelivererRepository extends JpaRepository<Deliverer, Long> {

    Optional<Deliverer> findByEmail(String email);

    Optional<Deliverer> findByEmployeeNumber(String employeeNumber);

    List<Deliverer> findByStatus(DelivererStatus status);

    boolean existsByEmail(String email);

    boolean existsByEmployeeNumber(String employeeNumber);
}

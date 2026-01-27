package com.deliveryapp.deliverer.repository;

import com.deliveryapp.deliverer.entity.DelivererVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DelivererVehicleRepository extends JpaRepository<DelivererVehicle, Long> {

    List<DelivererVehicle> findByDeliverer_IdAndIsActiveTrue(Long delivererId);

    List<DelivererVehicle> findByDeliverer_Id(Long delivererId);
}

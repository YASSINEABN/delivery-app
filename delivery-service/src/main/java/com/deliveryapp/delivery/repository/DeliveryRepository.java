package com.deliveryapp.delivery.repository;

import com.deliveryapp.delivery.entity.Delivery;
import com.deliveryapp.delivery.entity.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    Optional<Delivery> findByDeliveryNumber(String deliveryNumber);

    List<Delivery> findByOrderId(Long orderId);

    List<Delivery> findByDelivererId(Long delivererId);

    List<Delivery> findByStatus(DeliveryStatus status);

    boolean existsByDeliveryNumber(String deliveryNumber);
}

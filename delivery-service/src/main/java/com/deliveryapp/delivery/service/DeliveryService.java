package com.deliveryapp.delivery.service;

import com.deliveryapp.delivery.client.OrderServiceClient;
import com.deliveryapp.delivery.dto.DeliveryDTO;
import com.deliveryapp.delivery.entity.Delivery;
import com.deliveryapp.delivery.entity.DeliveryStatus;
import com.deliveryapp.delivery.exception.ResourceNotFoundException;
import com.deliveryapp.delivery.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OrderServiceClient orderServiceClient;

    public DeliveryDTO createDelivery(DeliveryDTO dto) {
        log.info("Creating new delivery for order ID: {}", dto.getOrderId());

        String orderNumber = dto.getOrderNumber();
        if (orderNumber == null || orderNumber.isBlank()) {
            try {
                orderNumber = orderServiceClient.getOrderById(dto.getOrderId()).getOrderNumber();
            } catch (Exception e) {
                throw new ResourceNotFoundException("Order not found with ID: " + dto.getOrderId());
            }
        }

        Delivery delivery = new Delivery();
        delivery.setDeliveryNumber(generateDeliveryNumber());
        delivery.setOrderId(dto.getOrderId());
        delivery.setOrderNumber(orderNumber);
        delivery.setDelivererId(dto.getDelivererId());
        delivery.setStatus(dto.getStatus() != null ? dto.getStatus() : DeliveryStatus.PENDING_ASSIGNMENT);
        delivery.setPickupAddress(dto.getPickupAddress());
        delivery.setPickupCity(dto.getPickupCity());
        delivery.setPickupPostalCode(dto.getPickupPostalCode());
        delivery.setDeliveryAddress(dto.getDeliveryAddress());
        delivery.setDeliveryCity(dto.getDeliveryCity());
        delivery.setDeliveryPostalCode(dto.getDeliveryPostalCode());
        delivery.setEstimatedDistance(dto.getEstimatedDistance());
        delivery.setEstimatedDuration(dto.getEstimatedDuration());
        delivery.setPriority(dto.getPriority() != null ? dto.getPriority() : "NORMAL");
        delivery.setSpecialInstructions(dto.getSpecialInstructions());
        delivery.setNotes(dto.getNotes());

        Delivery saved = deliveryRepository.save(delivery);
        log.info("Delivery created successfully: {}", saved.getDeliveryNumber());

        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public DeliveryDTO getById(Long id) {
        Delivery d = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with ID: " + id));
        return toDto(d);
    }

    @Transactional(readOnly = true)
    public List<DeliveryDTO> getAll() {
        return deliveryRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeliveryDTO> getByDelivererId(Long delivererId) {
        return deliveryRepository.findByDelivererId(delivererId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public DeliveryDTO update(Long id, DeliveryDTO dto) {
        log.info("Updating delivery ID: {}", id);

        Delivery d = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with ID: " + id));

        if (dto.getDelivererId() != null) d.setDelivererId(dto.getDelivererId());
        if (dto.getStatus() != null) d.setStatus(dto.getStatus());
        if (dto.getPickupAddress() != null) d.setPickupAddress(dto.getPickupAddress());
        if (dto.getPickupCity() != null) d.setPickupCity(dto.getPickupCity());
        if (dto.getPickupPostalCode() != null) d.setPickupPostalCode(dto.getPickupPostalCode());
        if (dto.getDeliveryAddress() != null) d.setDeliveryAddress(dto.getDeliveryAddress());
        if (dto.getDeliveryCity() != null) d.setDeliveryCity(dto.getDeliveryCity());
        if (dto.getDeliveryPostalCode() != null) d.setDeliveryPostalCode(dto.getDeliveryPostalCode());
        if (dto.getPriority() != null) d.setPriority(dto.getPriority());
        if (dto.getSpecialInstructions() != null) d.setSpecialInstructions(dto.getSpecialInstructions());
        if (dto.getNotes() != null) d.setNotes(dto.getNotes());
        if (dto.getActualPickupTime() != null) d.setActualPickupTime(dto.getActualPickupTime());
        if (dto.getActualDeliveryTime() != null) d.setActualDeliveryTime(dto.getActualDeliveryTime());
        if (dto.getActualDistance() != null) d.setActualDistance(dto.getActualDistance());
        if (dto.getActualDuration() != null) d.setActualDuration(dto.getActualDuration());

        return toDto(deliveryRepository.save(d));
    }

    public void delete(Long id) {
        if (!deliveryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Delivery not found with ID: " + id);
        }
        deliveryRepository.deleteById(id);
        log.info("Delivery deleted: {}", id);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTracking(Long id) {
        if (!deliveryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Delivery not found with ID: " + id);
        }
        return Collections.emptyList();
    }

    private String generateDeliveryNumber() {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "DEL-" + ts;
    }

    private DeliveryDTO toDto(Delivery d) {
        DeliveryDTO o = new DeliveryDTO();
        o.setId(d.getId());
        o.setDeliveryNumber(d.getDeliveryNumber());
        o.setOrderId(d.getOrderId());
        o.setOrderNumber(d.getOrderNumber());
        o.setDelivererId(d.getDelivererId());
        o.setStatus(d.getStatus());
        o.setPickupAddress(d.getPickupAddress());
        o.setPickupCity(d.getPickupCity());
        o.setPickupPostalCode(d.getPickupPostalCode());
        o.setDeliveryAddress(d.getDeliveryAddress());
        o.setDeliveryCity(d.getDeliveryCity());
        o.setDeliveryPostalCode(d.getDeliveryPostalCode());
        o.setEstimatedDistance(d.getEstimatedDistance());
        o.setEstimatedDuration(d.getEstimatedDuration());
        o.setActualDistance(d.getActualDistance());
        o.setActualDuration(d.getActualDuration());
        o.setPriority(d.getPriority());
        o.setScheduledPickupTime(d.getScheduledPickupTime());
        o.setActualPickupTime(d.getActualPickupTime());
        o.setEstimatedDeliveryTime(d.getEstimatedDeliveryTime());
        o.setActualDeliveryTime(d.getActualDeliveryTime());
        o.setSpecialInstructions(d.getSpecialInstructions());
        o.setNotes(d.getNotes());
        o.setCreatedAt(d.getCreatedAt());
        o.setUpdatedAt(d.getUpdatedAt());
        return o;
    }
}

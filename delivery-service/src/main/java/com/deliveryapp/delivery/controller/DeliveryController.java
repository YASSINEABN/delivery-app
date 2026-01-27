package com.deliveryapp.delivery.controller;

import com.deliveryapp.delivery.dto.DeliveryDTO;
import com.deliveryapp.delivery.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
@Slf4j
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<DeliveryDTO> create(@Valid @RequestBody DeliveryDTO dto) {
        log.info("REST request to create delivery for order ID: {}", dto.getOrderId());
        DeliveryDTO created = deliveryService.createDelivery(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDTO> getById(@PathVariable Long id) {
        log.info("REST request to get delivery by ID: {}", id);
        return ResponseEntity.ok(deliveryService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<DeliveryDTO>> getAll(
            @RequestParam(required = false) Long delivererId) {
        log.info("REST request to get deliveries, delivererId: {}", delivererId);
        if (delivererId != null) {
            return ResponseEntity.ok(deliveryService.getByDelivererId(delivererId));
        }
        return ResponseEntity.ok(deliveryService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliveryDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody DeliveryDTO dto) {
        log.info("REST request to update delivery ID: {}", id);
        return ResponseEntity.ok(deliveryService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete delivery ID: {}", id);
        deliveryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/track")
    public ResponseEntity<List<java.util.Map<String, Object>>> getTracking(@PathVariable Long id) {
        log.info("REST request to get tracking for delivery ID: {}", id);
        return ResponseEntity.ok(deliveryService.getTracking(id));
    }
}

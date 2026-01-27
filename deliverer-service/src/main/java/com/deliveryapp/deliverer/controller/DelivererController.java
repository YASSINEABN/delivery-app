package com.deliveryapp.deliverer.controller;

import com.deliveryapp.deliverer.dto.DelivererDTO;
import com.deliveryapp.deliverer.service.DelivererService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliverers")
@RequiredArgsConstructor
@Slf4j
public class DelivererController {

    private final DelivererService delivererService;

    @PostMapping
    public ResponseEntity<DelivererDTO> create(@Valid @RequestBody DelivererDTO dto) {
        log.info("REST request to create deliverer");
        DelivererDTO created = delivererService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DelivererDTO> getById(@PathVariable Long id) {
        log.info("REST request to get deliverer by ID: {}", id);
        return ResponseEntity.ok(delivererService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<DelivererDTO>> getAll() {
        log.info("REST request to get all deliverers");
        return ResponseEntity.ok(delivererService.getAll());
    }

    @GetMapping("/available")
    public ResponseEntity<List<DelivererDTO>> getAvailable() {
        log.info("REST request to get available deliverers");
        return ResponseEntity.ok(delivererService.getAvailable());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DelivererDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody DelivererDTO dto) {
        log.info("REST request to update deliverer ID: {}", id);
        return ResponseEntity.ok(delivererService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete deliverer ID: {}", id);
        delivererService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/location")
    public ResponseEntity<java.util.Map<String, Object>> getLocation(@PathVariable Long id) {
        log.info("REST request to get location for deliverer ID: {}", id);
        return ResponseEntity.ok(delivererService.getLocation(id));
    }

    @GetMapping("/{id}/performance")
    public ResponseEntity<java.util.Map<String, Object>> getPerformance(@PathVariable Long id) {
        log.info("REST request to get performance for deliverer ID: {}", id);
        return ResponseEntity.ok(delivererService.getPerformance(id));
    }
}

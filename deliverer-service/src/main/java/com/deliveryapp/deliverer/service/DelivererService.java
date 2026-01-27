package com.deliveryapp.deliverer.service;

import com.deliveryapp.deliverer.dto.DelivererDTO;
import com.deliveryapp.deliverer.entity.Deliverer;
import com.deliveryapp.deliverer.entity.DelivererStatus;
import com.deliveryapp.deliverer.entity.DelivererVehicle;
import com.deliveryapp.deliverer.entity.VehicleType;
import com.deliveryapp.deliverer.exception.DuplicateResourceException;
import com.deliveryapp.deliverer.exception.ResourceNotFoundException;
import com.deliveryapp.deliverer.repository.DelivererRepository;
import com.deliveryapp.deliverer.repository.DelivererVehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DelivererService {

    private final DelivererRepository delivererRepository;
    private final DelivererVehicleRepository vehicleRepository;

    public DelivererDTO create(DelivererDTO dto) {
        log.info("Creating deliverer with email: {}", dto.getEmail());

        if (delivererRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Deliverer already exists with email: " + dto.getEmail());
        }

        Deliverer d = new Deliverer();
        d.setEmployeeNumber(generateEmployeeNumber());
        d.setFirstName(dto.getFirstName());
        d.setLastName(dto.getLastName());
        d.setEmail(dto.getEmail());
        d.setPhone(dto.getPhone());
        d.setAddress(dto.getAddress());
        d.setCity(dto.getCity());
        d.setPostalCode(dto.getPostalCode());
        d.setDateOfBirth(dto.getDateOfBirth());
        d.setNationalId(dto.getNationalId());
        d.setEmergencyContactName(dto.getEmergencyContactName());
        d.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        d.setStatus(dto.getStatus() != null ? dto.getStatus() : DelivererStatus.INACTIVE);
        d.setHireDate(dto.getHireDate() != null ? dto.getHireDate() : LocalDate.now());
        d.setTerminationDate(dto.getTerminationDate());
        d.setRating(dto.getRating() != null ? dto.getRating() : BigDecimal.ZERO);
        d.setTotalDeliveries(dto.getTotalDeliveries() != null ? dto.getTotalDeliveries() : 0);
        d.setSuccessfulDeliveries(dto.getSuccessfulDeliveries() != null ? dto.getSuccessfulDeliveries() : 0);
        d.setFailedDeliveries(dto.getFailedDeliveries() != null ? dto.getFailedDeliveries() : 0);
        d.setProfilePhotoUrl(dto.getProfilePhotoUrl());

        Deliverer saved = delivererRepository.save(d);

        if (dto.getVehicleType() != null) {
            DelivererVehicle v = new DelivererVehicle();
            v.setDeliverer(saved);
            v.setVehicleType(dto.getVehicleType());
            v.setLicensePlate("PENDING-" + saved.getId());
            v.setIsActive(true);
            vehicleRepository.save(v);
        }

        log.info("Deliverer created: {}", saved.getEmployeeNumber());
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public DelivererDTO getById(Long id) {
        Deliverer d = delivererRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deliverer not found with ID: " + id));
        return toDto(d);
    }

    @Transactional(readOnly = true)
    public List<DelivererDTO> getAll() {
        return delivererRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DelivererDTO> getAvailable() {
        return delivererRepository.findByStatus(DelivererStatus.ACTIVE).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public DelivererDTO update(Long id, DelivererDTO dto) {
        log.info("Updating deliverer ID: {}", id);

        Deliverer d = delivererRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deliverer not found with ID: " + id));

        if (dto.getEmail() != null && !d.getEmail().equals(dto.getEmail())
                && delivererRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Deliverer already exists with email: " + dto.getEmail());
        }

        if (dto.getFirstName() != null) d.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) d.setLastName(dto.getLastName());
        if (dto.getEmail() != null) d.setEmail(dto.getEmail());
        if (dto.getPhone() != null) d.setPhone(dto.getPhone());
        if (dto.getAddress() != null) d.setAddress(dto.getAddress());
        if (dto.getCity() != null) d.setCity(dto.getCity());
        if (dto.getPostalCode() != null) d.setPostalCode(dto.getPostalCode());
        if (dto.getStatus() != null) d.setStatus(dto.getStatus());
        if (dto.getHireDate() != null) d.setHireDate(dto.getHireDate());
        if (dto.getTerminationDate() != null) d.setTerminationDate(dto.getTerminationDate());

        return toDto(delivererRepository.save(d));
    }

    public void delete(Long id) {
        if (!delivererRepository.existsById(id)) {
            throw new ResourceNotFoundException("Deliverer not found with ID: " + id);
        }
        delivererRepository.deleteById(id);
        log.info("Deliverer deleted: {}", id);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getLocation(Long id) {
        Deliverer d = delivererRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deliverer not found with ID: " + id));
        Map<String, Object> map = new HashMap<>();
        map.put("delivererId", d.getId());
        map.put("latitude", null);
        map.put("longitude", null);
        map.put("updatedAt", null);
        return map;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPerformance(Long id) {
        Deliverer d = delivererRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deliverer not found with ID: " + id));
        Map<String, Object> map = new HashMap<>();
        map.put("totalDeliveries", d.getTotalDeliveries() != null ? d.getTotalDeliveries() : 0);
        map.put("successfulDeliveries", d.getSuccessfulDeliveries() != null ? d.getSuccessfulDeliveries() : 0);
        map.put("failedDeliveries", d.getFailedDeliveries() != null ? d.getFailedDeliveries() : 0);
        map.put("rating", d.getRating() != null ? d.getRating() : BigDecimal.ZERO);
        map.put("delivererId", d.getId());
        return map;
    }

    private String generateEmployeeNumber() {
        String ts = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long n = delivererRepository.count() + 1;
        return "DLV-" + ts + "-" + String.format("%04d", n);
    }

    private DelivererDTO toDto(Deliverer d) {
        DelivererDTO o = new DelivererDTO();
        o.setId(d.getId());
        o.setEmployeeNumber(d.getEmployeeNumber());
        o.setFirstName(d.getFirstName());
        o.setLastName(d.getLastName());
        o.setEmail(d.getEmail());
        o.setPhone(d.getPhone());
        o.setDateOfBirth(d.getDateOfBirth());
        o.setNationalId(d.getNationalId());
        o.setAddress(d.getAddress());
        o.setCity(d.getCity());
        o.setPostalCode(d.getPostalCode());
        o.setEmergencyContactName(d.getEmergencyContactName());
        o.setEmergencyContactPhone(d.getEmergencyContactPhone());
        o.setStatus(d.getStatus());
        o.setHireDate(d.getHireDate());
        o.setTerminationDate(d.getTerminationDate());
        o.setRating(d.getRating());
        o.setTotalDeliveries(d.getTotalDeliveries());
        o.setSuccessfulDeliveries(d.getSuccessfulDeliveries());
        o.setFailedDeliveries(d.getFailedDeliveries());
        o.setProfilePhotoUrl(d.getProfilePhotoUrl());
        o.setCreatedAt(d.getCreatedAt());
        o.setUpdatedAt(d.getUpdatedAt());

        vehicleRepository.findByDeliverer_Id(d.getId()).stream().findFirst()
                .ifPresent(v -> o.setVehicleType(v.getVehicleType()));

        return o;
    }
}

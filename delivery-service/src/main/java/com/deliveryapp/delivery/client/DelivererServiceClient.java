package com.deliveryapp.delivery.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign Client to communicate with Deliverer Service via Eureka
 * The name "deliverer-service" is resolved by Eureka Service Discovery
 */
@FeignClient(name = "deliverer-service")
public interface DelivererServiceClient {
    
    @GetMapping("/api/deliverers/{id}")
    DelivererDTO getDelivererById(@PathVariable("id") Long id);
    
    @GetMapping("/api/deliverers/available")
    java.util.List<DelivererDTO> getAvailableDeliverers();
}

// DTO for communication
class DelivererDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String status;
    private String vehicleType;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
}

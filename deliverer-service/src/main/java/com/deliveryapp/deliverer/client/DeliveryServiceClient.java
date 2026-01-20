package com.deliveryapp.deliverer.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Feign Client to communicate with Delivery Service via Eureka
 * The name "delivery-service" is resolved by Eureka Service Discovery
 */
@FeignClient(name = "delivery-service")
public interface DeliveryServiceClient {
    
    @GetMapping("/api/deliveries/{id}")
    DeliveryDTO getDeliveryById(@PathVariable("id") Long id);
    
    @GetMapping("/api/deliveries")
    List<DeliveryDTO> getDeliveriesByDelivererId(@RequestParam("delivererId") Long delivererId);
}

// DTO for communication
class DeliveryDTO {
    private Long id;
    private String deliveryNumber;
    private Long orderId;
    private Long delivererId;
    private String status;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDeliveryNumber() { return deliveryNumber; }
    public void setDeliveryNumber(String deliveryNumber) { this.deliveryNumber = deliveryNumber; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public Long getDelivererId() { return delivererId; }
    public void setDelivererId(Long delivererId) { this.delivererId = delivererId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

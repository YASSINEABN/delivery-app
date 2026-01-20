package com.deliveryapp.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Feign Client to communicate with Delivery Service via Eureka
 * The name "delivery-service" is resolved by Eureka Service Discovery
 */
@FeignClient(name = "delivery-service")
public interface DeliveryServiceClient {
    
    @PostMapping("/api/deliveries")
    DeliveryDTO createDelivery(@RequestBody CreateDeliveryRequest request);
    
    @GetMapping("/api/deliveries")
    List<DeliveryDTO> getDeliveriesByOrderId(@RequestParam("orderId") Long orderId);
}

// DTOs for communication
class DeliveryDTO {
    private Long id;
    private String deliveryNumber;
    private Long orderId;
    private String status;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDeliveryNumber() { return deliveryNumber; }
    public void setDeliveryNumber(String deliveryNumber) { this.deliveryNumber = deliveryNumber; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

class CreateDeliveryRequest {
    private Long orderId;
    private String pickupAddress;
    private String deliveryAddress;
    
    public CreateDeliveryRequest() {}
    public CreateDeliveryRequest(Long orderId, String pickupAddress, String deliveryAddress) {
        this.orderId = orderId;
        this.pickupAddress = pickupAddress;
        this.deliveryAddress = deliveryAddress;
    }
    
    // Getters and setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
}

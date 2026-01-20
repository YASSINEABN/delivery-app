package com.deliveryapp.delivery.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Feign Client to communicate with Order Service via Eureka
 * The name "order-service" is resolved by Eureka Service Discovery
 */
@FeignClient(name = "order-service")
public interface OrderServiceClient {
    
    @GetMapping("/api/orders/{id}")
    OrderDTO getOrderById(@PathVariable("id") Long id);
    
    @GetMapping("/api/orders/number/{orderNumber}")
    OrderDTO getOrderByOrderNumber(@PathVariable("orderNumber") String orderNumber);
    
    @PatchMapping("/api/orders/{id}/status")
    OrderDTO updateOrderStatus(@PathVariable("id") Long id, @RequestBody OrderStatusUpdateDTO statusUpdate);
}

// DTOs for communication
class OrderDTO {
    private Long id;
    private String orderNumber;
    private String status;
    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryPostalCode;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getDeliveryCity() { return deliveryCity; }
    public void setDeliveryCity(String deliveryCity) { this.deliveryCity = deliveryCity; }
    public String getDeliveryPostalCode() { return deliveryPostalCode; }
    public void setDeliveryPostalCode(String deliveryPostalCode) { this.deliveryPostalCode = deliveryPostalCode; }
}

class OrderStatusUpdateDTO {
    private String status;
    private String notes;
    private String changedBy;
    
    // Constructors
    public OrderStatusUpdateDTO() {}
    public OrderStatusUpdateDTO(String status, String notes, String changedBy) {
        this.status = status;
        this.notes = notes;
        this.changedBy = changedBy;
    }
    
    // Getters and setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }
}

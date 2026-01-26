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


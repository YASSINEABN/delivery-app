package com.deliveryapp.delivery.service;

import com.deliveryapp.delivery.client.DelivererServiceClient;
import com.deliveryapp.delivery.client.OrderServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Example Service showing how to use Eureka-based service discovery
 * to communicate between microservices
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryOrchestrationService {
    
    // These clients use Eureka to discover and communicate with other services
    private final OrderServiceClient orderServiceClient;
    private final DelivererServiceClient delivererServiceClient;
    
    /**
     * Example: Create a delivery by fetching order details from Order Service
     * and finding available deliverers from Deliverer Service
     */
    public void createDeliveryFromOrder(Long orderId) {
        log.info("Creating delivery for order ID: {}", orderId);
        
        // Call Order Service via Eureka
        var order = orderServiceClient.getOrderById(orderId);
        log.info("Fetched order: {} from order-service", order.getOrderNumber());
        
        // Call Deliverer Service via Eureka
        var availableDeliverers = delivererServiceClient.getAvailableDeliverers();
        log.info("Found {} available deliverers from deliverer-service", availableDeliverers.size());
        
        // Your business logic here...
        // Create delivery, assign deliverer, update order status, etc.
    }
    
    /**
     * Example: Update order status when delivery is completed
     */
    public void completeDeliveryAndUpdateOrder(Long orderId, String deliveryNotes) {
        log.info("Completing delivery for order ID: {}", orderId);
        
        // Create status update DTO
        var statusUpdate = new com.deliveryapp.delivery.client.OrderStatusUpdateDTO(
            "COMPLETED", 
            deliveryNotes, 
            "delivery-service"
        );
        
        // Update order status via Order Service using Eureka
        var updatedOrder = orderServiceClient.updateOrderStatus(orderId, statusUpdate);
        log.info("Order {} status updated to: {}", updatedOrder.getOrderNumber(), updatedOrder.getStatus());
    }
}

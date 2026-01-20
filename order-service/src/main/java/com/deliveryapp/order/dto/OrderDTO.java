package com.deliveryapp.order.dto;

import com.deliveryapp.order.entity.OrderStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    
    private Long id;
    
    private String orderNumber;
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    private CustomerDTO customer;
    
    private OrderStatus status;
    
    private BigDecimal totalAmount;
    
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    
    @NotBlank(message = "Delivery city is required")
    private String deliveryCity;
    
    @NotBlank(message = "Delivery postal code is required")
    private String deliveryPostalCode;
    
    private String specialInstructions;
    
    @DecimalMin(value = "0.0", message = "Delivery fee must be non-negative")
    private BigDecimal deliveryFee;
    
    @NotEmpty(message = "Order must have at least one item")
    @Valid
    private List<OrderItemDTO> items;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}

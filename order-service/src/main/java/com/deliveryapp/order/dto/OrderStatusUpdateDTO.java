package com.deliveryapp.order.dto;

import com.deliveryapp.order.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateDTO {
    
    @NotNull(message = "Status is required")
    private OrderStatus status;
    
    private String notes;
    
    private String changedBy;
}

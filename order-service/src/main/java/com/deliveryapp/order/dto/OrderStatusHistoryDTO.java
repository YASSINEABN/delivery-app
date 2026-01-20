package com.deliveryapp.order.dto;

import com.deliveryapp.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusHistoryDTO {
    
    private Long id;
    
    private OrderStatus status;
    
    private String notes;
    
    private String changedBy;
    
    private LocalDateTime createdAt;
}

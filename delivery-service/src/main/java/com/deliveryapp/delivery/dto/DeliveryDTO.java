package com.deliveryapp.delivery.dto;

import com.deliveryapp.delivery.entity.DeliveryStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDTO {

    private Long id;
    private String deliveryNumber;

    @NotNull(message = "Order ID is required")
    private Long orderId;
    private String orderNumber;

    private Long delivererId;
    private DeliveryStatus status;

    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    @NotBlank(message = "Pickup city is required")
    @Size(max = 100)
    private String pickupCity;

    @NotBlank(message = "Pickup postal code is required")
    @Size(max = 20)
    private String pickupPostalCode;

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    @NotBlank(message = "Delivery city is required")
    @Size(max = 100)
    private String deliveryCity;

    @NotBlank(message = "Delivery postal code is required")
    @Size(max = 20)
    private String deliveryPostalCode;

    private BigDecimal estimatedDistance;
    private Integer estimatedDuration;
    private BigDecimal actualDistance;
    private Integer actualDuration;
    private String priority;
    private LocalDateTime scheduledPickupTime;
    private LocalDateTime actualPickupTime;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private String specialInstructions;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

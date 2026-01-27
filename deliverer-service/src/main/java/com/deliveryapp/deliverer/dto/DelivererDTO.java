package com.deliveryapp.deliverer.dto;

import com.deliveryapp.deliverer.entity.DelivererStatus;
import com.deliveryapp.deliverer.entity.VehicleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DelivererDTO {

    private Long id;
    private String employeeNumber;

    @NotBlank(message = "First name is required")
    @Size(max = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255)
    private String email;

    @NotBlank(message = "Phone is required")
    @Size(max = 20)
    private String phone;

    private LocalDate dateOfBirth;
    private String nationalId;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    @Size(max = 100)
    private String city;

    @NotBlank(message = "Postal code is required")
    @Size(max = 20)
    private String postalCode;

    private String emergencyContactName;
    private String emergencyContactPhone;
    private DelivererStatus status;
    private LocalDate hireDate;
    private LocalDate terminationDate;
    private BigDecimal rating;
    private Integer totalDeliveries;
    private Integer successfulDeliveries;
    private Integer failedDeliveries;
    private String profilePhotoUrl;
    private VehicleType vehicleType;  // from primary vehicle, for API compatibility
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

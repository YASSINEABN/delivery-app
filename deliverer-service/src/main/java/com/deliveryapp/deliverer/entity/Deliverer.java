package com.deliveryapp.deliverer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliverers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Deliverer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_number", nullable = false, unique = true, length = 50)
    private String employeeNumber;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    @Convert(converter = LocalDateStringConverter.class)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "date_of_birth", length = 10)
    private LocalDate dateOfBirth;

    @Column(name = "national_id", length = 50)
    private String nationalId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;

    @Column(name = "emergency_contact_name", length = 200)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private DelivererStatus status = DelivererStatus.INACTIVE;

    @Convert(converter = LocalDateStringConverter.class)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "hire_date", nullable = false, length = 10)
    private LocalDate hireDate;

    @Convert(converter = LocalDateStringConverter.class)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "termination_date", length = 10)
    private LocalDate terminationDate;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "total_deliveries")
    private Integer totalDeliveries = 0;

    @Column(name = "successful_deliveries")
    private Integer successfulDeliveries = 0;

    @Column(name = "failed_deliveries")
    private Integer failedDeliveries = 0;

    @Column(name = "profile_photo_url", length = 500)
    private String profilePhotoUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

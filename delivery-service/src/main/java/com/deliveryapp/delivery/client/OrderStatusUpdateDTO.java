package com.deliveryapp.delivery.client;

/**
 * DTO used by the delivery-service when updating order status via order-service.
 */
public class OrderStatusUpdateDTO {

    private String status;
    private String notes;
    private String changedBy;

    public OrderStatusUpdateDTO() {
    }

    public OrderStatusUpdateDTO(String status, String notes, String changedBy) {
        this.status = status;
        this.notes = notes;
        this.changedBy = changedBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }
}




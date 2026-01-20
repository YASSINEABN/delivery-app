package com.deliveryapp.order.service;

import com.deliveryapp.order.dto.*;
import com.deliveryapp.order.entity.*;
import com.deliveryapp.order.exception.ResourceNotFoundException;
import com.deliveryapp.order.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    
    public OrderDTO createOrder(OrderDTO orderDTO) {
        log.info("Creating new order for customer ID: {}", orderDTO.getCustomerId());
        
        // Validate customer exists
        Customer customer = customerRepository.findById(orderDTO.getCustomerId())
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + orderDTO.getCustomerId()));
        
        // Create order
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomer(customer);
        order.setStatus(OrderStatus.PENDING);
        order.setDeliveryAddress(orderDTO.getDeliveryAddress());
        order.setDeliveryCity(orderDTO.getDeliveryCity());
        order.setDeliveryPostalCode(orderDTO.getDeliveryPostalCode());
        order.setSpecialInstructions(orderDTO.getSpecialInstructions());
        order.setDeliveryFee(orderDTO.getDeliveryFee() != null ? orderDTO.getDeliveryFee() : BigDecimal.ZERO);
        
        // Add items
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItemDTO itemDTO : orderDTO.getItems()) {
            OrderItem item = new OrderItem();
            item.setProductName(itemDTO.getProductName());
            item.setProductDescription(itemDTO.getProductDescription());
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(itemDTO.getUnitPrice());
            
            BigDecimal itemTotal = itemDTO.getUnitPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            item.setTotalPrice(itemTotal);
            item.setWeight(itemDTO.getWeight());
            item.setDimensions(itemDTO.getDimensions());
            
            order.addItem(item);
            totalAmount = totalAmount.add(itemTotal);
        }
        
        order.setTotalAmount(totalAmount.add(order.getDeliveryFee()));
        
        // Add initial status history
        OrderStatusHistory history = new OrderStatusHistory();
        history.setStatus(OrderStatus.PENDING);
        history.setNotes("Order created");
        history.setChangedBy("SYSTEM");
        order.addStatusHistory(history);
        
        Order savedOrder = orderRepository.save(order);
        log.info("Order created successfully with order number: {}", savedOrder.getOrderNumber());
        
        return convertToDTO(savedOrder);
    }
    
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        return convertToDTO(order);
    }
    
    @Transactional(readOnly = true)
    public OrderDTO getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with order number: " + orderNumber));
        return convertToDTO(order);
    }
    
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::convertToDTO);
    }
    
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByCustomerId(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found with ID: " + customerId);
        }
        return orderRepository.findByCustomerId(customerId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public OrderDTO updateOrderStatus(Long orderId, OrderStatusUpdateDTO statusUpdateDTO) {
        log.info("Updating status for order ID: {} to {}", orderId, statusUpdateDTO.getStatus());
        
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        
        OrderStatus oldStatus = order.getStatus();
        order.setStatus(statusUpdateDTO.getStatus());
        
        // Add status history
        OrderStatusHistory history = new OrderStatusHistory();
        history.setStatus(statusUpdateDTO.getStatus());
        history.setNotes(statusUpdateDTO.getNotes());
        history.setChangedBy(statusUpdateDTO.getChangedBy() != null ? statusUpdateDTO.getChangedBy() : "SYSTEM");
        order.addStatusHistory(history);
        
        Order updatedOrder = orderRepository.save(order);
        log.info("Order {} status updated from {} to {}", order.getOrderNumber(), oldStatus, statusUpdateDTO.getStatus());
        
        return convertToDTO(updatedOrder);
    }
    
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        log.info("Updating order ID: {}", id);
        
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        
        // Update basic fields
        if (orderDTO.getDeliveryAddress() != null) {
            order.setDeliveryAddress(orderDTO.getDeliveryAddress());
        }
        if (orderDTO.getDeliveryCity() != null) {
            order.setDeliveryCity(orderDTO.getDeliveryCity());
        }
        if (orderDTO.getDeliveryPostalCode() != null) {
            order.setDeliveryPostalCode(orderDTO.getDeliveryPostalCode());
        }
        if (orderDTO.getSpecialInstructions() != null) {
            order.setSpecialInstructions(orderDTO.getSpecialInstructions());
        }
        
        Order updatedOrder = orderRepository.save(order);
        log.info("Order {} updated successfully", order.getOrderNumber());
        
        return convertToDTO(updatedOrder);
    }
    
    public void deleteOrder(Long id) {
        log.info("Deleting order ID: {}", id);
        
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with ID: " + id);
        }
        
        orderRepository.deleteById(id);
        log.info("Order deleted successfully");
    }
    
    @Transactional(readOnly = true)
    public List<OrderStatusHistoryDTO> getOrderStatusHistory(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new ResourceNotFoundException("Order not found with ID: " + orderId);
        }
        
        return statusHistoryRepository.findByOrderIdOrderByCreatedAtDesc(orderId).stream()
            .map(this::convertToHistoryDTO)
            .collect(Collectors.toList());
    }
    
    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "ORD-" + timestamp;
    }
    
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomer(convertCustomerToDTO(order.getCustomer()));
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setDeliveryCity(order.getDeliveryCity());
        dto.setDeliveryPostalCode(order.getDeliveryPostalCode());
        dto.setSpecialInstructions(order.getSpecialInstructions());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setItems(order.getItems().stream()
            .map(this::convertItemToDTO)
            .collect(Collectors.toList()));
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }
    
    private CustomerDTO convertCustomerToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setAddress(customer.getAddress());
        dto.setCity(customer.getCity());
        dto.setPostalCode(customer.getPostalCode());
        return dto;
    }
    
    private OrderItemDTO convertItemToDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductName(item.getProductName());
        dto.setProductDescription(item.getProductDescription());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        dto.setWeight(item.getWeight());
        dto.setDimensions(item.getDimensions());
        return dto;
    }
    
    private OrderStatusHistoryDTO convertToHistoryDTO(OrderStatusHistory history) {
        OrderStatusHistoryDTO dto = new OrderStatusHistoryDTO();
        dto.setId(history.getId());
        dto.setStatus(history.getStatus());
        dto.setNotes(history.getNotes());
        dto.setChangedBy(history.getChangedBy());
        dto.setCreatedAt(history.getCreatedAt());
        return dto;
    }
}

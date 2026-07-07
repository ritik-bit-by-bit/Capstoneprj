package org.nagarro.fullstackassignment.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.nagarro.fullstackassignment.model.OrderStatus;
import org.nagarro.fullstackassignment.model.FoodOrder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDtos {

    public record PlaceOrderItem(@NotNull Long menuItemId, @Min(1) Integer quantity) {
    }

    public record PlaceOrderRequest(@NotNull Long restaurantId, @Valid List<PlaceOrderItem> items) {
    }

    public record OrderItemView(Long menuItemId, String itemName, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice) {
    }

    public record OrderView(Long orderId, Long customerId, Long restaurantId, OrderStatus status, BigDecimal totalPrice,
                            LocalDateTime createdAt, List<OrderItemView> items) {
    }

    public record OrderResponse(
            Long id,
            Long customerId,
            Long restaurantId,
            String status,
            BigDecimal totalPrice,
            LocalDateTime createdAt,
            List<OrderItemResponse> items
    ) {
        public static OrderResponse from(FoodOrder order) {
            List<OrderItemResponse> itemResponses = order.getItems().stream()
                    .map(item -> new OrderItemResponse(
                            item.getMenuItemId(),
                            item.getItemName(),
                            item.getQuantity(),
                            item.getUnitPrice(),
                            item.getTotalPrice()
                    ))
                    .toList();

            return new OrderResponse(
                    order.getId(),
                    order.getCustomerId(),
                    order.getRestaurantId(),
                    order.getStatus().name(),
                    order.getTotalPrice(),
                    order.getCreatedAt(),
                    itemResponses
            );
        }
    }

    public record OrderItemResponse(
            Long menuItemId,
            String itemName,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal totalPrice
    ) {
    }

    public record UpdateStatusRequest(@NotNull OrderStatus status) {
    }
}

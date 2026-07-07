package org.nagarro.fullstackassignment.service;

import org.nagarro.fullstackassignment.dto.OrderDtos;
import org.nagarro.fullstackassignment.model.FoodOrder;
import org.nagarro.fullstackassignment.model.MenuItem;
import org.nagarro.fullstackassignment.model.OrderItem;
import org.nagarro.fullstackassignment.model.OrderStatus;
import org.nagarro.fullstackassignment.model.Restaurant;
import org.nagarro.fullstackassignment.model.SpecialTag;
import org.nagarro.fullstackassignment.repository.FoodOrderRepository;
import org.nagarro.fullstackassignment.repository.MenuItemRepository;
import org.nagarro.fullstackassignment.repository.OrderItemRepository;
import org.nagarro.fullstackassignment.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class OrderService {

    private final FoodOrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(FoodOrderRepository orderRepository,
                        MenuItemRepository menuItemRepository,
                        RestaurantRepository restaurantRepository,
                        OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public FoodOrder placeOrder(Long customerId, OrderDtos.PlaceOrderRequest request) {
        Restaurant restaurant = restaurantRepository.findById(request.restaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        FoodOrder order = new FoodOrder();
        order.setCustomerId(customerId);
        order.setRestaurantId(restaurant.getId());

        BigDecimal total = BigDecimal.ZERO;
        for (OrderDtos.PlaceOrderItem itemRequest : request.items()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.menuItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
            if (!menuItem.getRestaurantId().equals(restaurant.getId())) {
                throw new IllegalArgumentException("Menu item doesn't belong to selected restaurant");
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setMenuItemId(menuItem.getId());
            item.setItemName(menuItem.getName());
            item.setQuantity(itemRequest.quantity());
            item.setUnitPrice(menuItem.getPrice());
            item.setTotalPrice(menuItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())));

            total = total.add(item.getTotalPrice());
            order.getItems().add(item);
        }

        order.setTotalPrice(total);
        FoodOrder saved = orderRepository.save(order);
        refreshMostlyOrderedForRestaurant(saved.getRestaurantId());
        return saved;
    }

    public List<FoodOrder> customerOrderHistory(Long customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public FoodOrder updateOrderStatus(Long ownerId, Long orderId, OrderStatus newStatus) {
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        Restaurant restaurant = restaurantRepository.findById(order.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        if (!restaurant.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Unauthorized order operation");
        }

        if (!isValidTransition(order.getStatus(), newStatus)) {
            throw new IllegalArgumentException("Invalid status transition");
        }
        order.setStatus(newStatus);
        return order;
    }

    public List<FoodOrder> ownerOrders(Long ownerId) {
        List<Long> ownerRestaurantIds = restaurantRepository.findByOwnerId(ownerId).stream().map(Restaurant::getId).toList();
        return orderRepository.findAll().stream().filter(o -> ownerRestaurantIds.contains(o.getRestaurantId())).toList();
    }

    public void refreshMostlyOrderedForRestaurant(Long restaurantId) {
        List<OrderItem> items = orderItemRepository.findByOrderRestaurantId(restaurantId);
        Map<Long, Integer> frequencies = new HashMap<>();

        for (OrderItem item : items) {
            frequencies.merge(item.getMenuItemId(), item.getQuantity(), Integer::sum);
        }

        int max = frequencies.values().stream().max(Integer::compareTo).orElse(0);
        List<MenuItem> menu = menuItemRepository.findByRestaurantId(restaurantId);

        for (MenuItem menuItem : menu) {
            if (max > 0 && frequencies.getOrDefault(menuItem.getId(), 0) == max) {
                if (menuItem.getSpecialTag() == SpecialTag.NONE) {
                    menuItem.setSpecialTag(SpecialTag.MOSTLY_ORDERED);
                }
            } else if (menuItem.getSpecialTag() == SpecialTag.MOSTLY_ORDERED) {
                menuItem.setSpecialTag(SpecialTag.NONE);
            }
        }
    }

    private boolean isValidTransition(OrderStatus current, OrderStatus target) {
        return switch (current) {
            case PENDING -> target == OrderStatus.PREPARING;
            case PREPARING -> target == OrderStatus.READY;
            case READY -> target == OrderStatus.COMPLETED;
            case COMPLETED -> false;
        };
    }
}


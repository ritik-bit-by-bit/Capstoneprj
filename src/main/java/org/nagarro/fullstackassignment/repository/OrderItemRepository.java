package org.nagarro.fullstackassignment.repository;

import org.nagarro.fullstackassignment.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderRestaurantId(Long restaurantId);
}


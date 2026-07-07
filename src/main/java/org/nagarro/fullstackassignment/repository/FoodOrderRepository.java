package org.nagarro.fullstackassignment.repository;

import org.nagarro.fullstackassignment.model.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {
    List<FoodOrder> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<FoodOrder> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
}


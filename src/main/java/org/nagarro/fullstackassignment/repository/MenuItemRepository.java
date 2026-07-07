package org.nagarro.fullstackassignment.repository;

import org.nagarro.fullstackassignment.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurantIdAndActiveTrue(Long restaurantId);

    List<MenuItem> findByRestaurantId(Long restaurantId);
}


package org.nagarro.fullstackassignment.repository;

import org.nagarro.fullstackassignment.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByOwnerId(Long ownerId);

    List<Restaurant> findByNameContainingIgnoreCaseAndCuisineContainingIgnoreCaseAndLocationContainingIgnoreCase(
            String name,
            String cuisine,
            String location
    );
}


package org.nagarro.fullstackassignment.service;

import org.nagarro.fullstackassignment.dto.MenuItemDtos;
import org.nagarro.fullstackassignment.dto.RestaurantDtos;
import org.nagarro.fullstackassignment.model.MenuItem;
import org.nagarro.fullstackassignment.model.Restaurant;
import org.nagarro.fullstackassignment.model.SpecialTag;
import org.nagarro.fullstackassignment.repository.MenuItemRepository;
import org.nagarro.fullstackassignment.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public RestaurantService(RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public Restaurant upsertRestaurant(Long ownerId, RestaurantDtos.RestaurantRequest request, Long restaurantId) {
        Restaurant restaurant = restaurantId == null
                ? new Restaurant()
                : restaurantRepository.findById(restaurantId).orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        if (restaurantId != null && !restaurant.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Unauthorized access to restaurant");
        }

        restaurant.setName(request.name());
        restaurant.setCuisine(request.cuisine());
        restaurant.setLocation(request.location());
        restaurant.setRating(request.rating());
        restaurant.setOwnerId(ownerId);

        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> search(String name, String cuisine, String location) {
        return restaurantRepository.findByNameContainingIgnoreCaseAndCuisineContainingIgnoreCaseAndLocationContainingIgnoreCase(
                name == null ? "" : name,
                cuisine == null ? "" : cuisine,
                location == null ? "" : location
        );
    }

    public List<MenuItem> menuForCustomer(Long restaurantId) {
        return menuItemRepository.findByRestaurantIdAndActiveTrue(restaurantId);
    }

    public MenuItem addMenuItem(Long ownerId, MenuItemDtos.MenuItemRequest request) {
        Restaurant restaurant = restaurantRepository.findById(request.restaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        if (!restaurant.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Unauthorized menu operation");
        }

        MenuItem menuItem = new MenuItem();
        menuItem.setRestaurantId(request.restaurantId());
        menuItem.setName(request.name());
        menuItem.setDescription(request.description());
        menuItem.setPrice(request.price());
        menuItem.setSpecialTag(parseSpecialTag(request.specialTag()));
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(Long ownerId, Long menuItemId, MenuItemDtos.MenuItemRequest request) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));

        Restaurant restaurant = restaurantRepository.findById(menuItem.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        if (!restaurant.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Unauthorized menu operation");
        }

        menuItem.setName(request.name());
        menuItem.setDescription(request.description());
        menuItem.setPrice(request.price());
        menuItem.setSpecialTag(parseSpecialTag(request.specialTag()));
        menuItem.setActive(true);
        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(Long ownerId, Long menuItemId) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));

        Restaurant restaurant = restaurantRepository.findById(menuItem.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        if (!restaurant.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("Unauthorized menu operation");
        }

        menuItem.setActive(false);
    }

    public List<Restaurant> ownedRestaurants(Long ownerId) {
        return restaurantRepository.findByOwnerId(ownerId);
    }

    public List<MenuItem> menuByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    private SpecialTag parseSpecialTag(String value) {
        if (value == null || value.isBlank()) {
            return SpecialTag.NONE;
        }
        return SpecialTag.valueOf(value.toUpperCase());
    }
}


package org.nagarro.fullstackassignment.service;

import org.nagarro.fullstackassignment.dto.PreferenceDtos;
import org.nagarro.fullstackassignment.model.AppUser;
import org.nagarro.fullstackassignment.model.Restaurant;
import org.nagarro.fullstackassignment.repository.AppUserRepository;
import org.nagarro.fullstackassignment.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Transactional
public class PreferenceService {

    private final AppUserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    public PreferenceService(AppUserRepository userRepository, RestaurantRepository restaurantRepository) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public AppUser savePreferences(Long userId, PreferenceDtos.PreferencesRequest request) {
        AppUser user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setFavoriteRestaurantIds(request.favoriteRestaurantIds() == null ? Set.of() : request.favoriteRestaurantIds());
        user.setFavoriteCuisines(request.favoriteCuisines() == null ? Set.of() : request.favoriteCuisines());
        user.setDietaryRestrictions(request.dietaryRestrictions() == null ? Set.of() : request.dietaryRestrictions());

        return user;
    }

    public PreferenceDtos.PreferencesResponse getPreferences(Long userId) {
        AppUser user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        return new PreferenceDtos.PreferencesResponse(
            user.getFavoriteRestaurantIds(),
            user.getFavoriteCuisines(),
            user.getDietaryRestrictions()
        );
    }

    public List<Restaurant> recommendations(Long userId) {
        AppUser user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Set<Long> favoriteIds = user.getFavoriteRestaurantIds();
        Set<String> cuisines = user.getFavoriteCuisines();

        return restaurantRepository.findAll().stream().filter(r ->
                favoriteIds.contains(r.getId()) || cuisines.stream().anyMatch(c -> c.equalsIgnoreCase(r.getCuisine()))
        ).toList();
    }
}


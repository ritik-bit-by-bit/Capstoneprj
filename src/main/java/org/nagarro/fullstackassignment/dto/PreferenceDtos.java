package org.nagarro.fullstackassignment.dto;

import java.util.Set;

public class PreferenceDtos {

    public record PreferencesRequest(Set<Long> favoriteRestaurantIds, Set<String> favoriteCuisines,
                                     Set<String> dietaryRestrictions) {
    }

    public record PreferencesResponse(Set<Long> favoriteRestaurantIds, Set<String> favoriteCuisines,
                                      Set<String> dietaryRestrictions) {
    }
}


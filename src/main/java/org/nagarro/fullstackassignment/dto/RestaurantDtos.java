package org.nagarro.fullstackassignment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RestaurantDtos {

    public record RestaurantRequest(
            @NotBlank String name,
            @NotBlank String location,
            @NotBlank String cuisine,
            @NotNull Double rating
    ) {
    }
}


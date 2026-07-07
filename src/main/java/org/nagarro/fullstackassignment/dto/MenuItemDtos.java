package org.nagarro.fullstackassignment.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class MenuItemDtos {

    public record MenuItemRequest(
            @NotNull Long restaurantId,
            @NotBlank String name,
            @NotBlank String description,
            @NotNull @DecimalMin("0.01") BigDecimal price,
            String specialTag
    ) {
    }
}


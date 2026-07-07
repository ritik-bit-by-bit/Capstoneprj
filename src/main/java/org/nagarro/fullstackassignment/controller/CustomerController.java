package org.nagarro.fullstackassignment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.nagarro.fullstackassignment.dto.OrderDtos;
import org.nagarro.fullstackassignment.dto.PreferenceDtos;
import org.nagarro.fullstackassignment.model.AppUser;
import org.nagarro.fullstackassignment.model.FoodOrder;
import org.nagarro.fullstackassignment.model.MenuItem;
import org.nagarro.fullstackassignment.model.Restaurant;
import org.nagarro.fullstackassignment.service.CurrentUserService;
import org.nagarro.fullstackassignment.service.OrderService;
import org.nagarro.fullstackassignment.service.PreferenceService;
import org.nagarro.fullstackassignment.service.RestaurantService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/customer")
@Tag(name = "Customer", description = "Customer operations - browse restaurants, place orders, manage preferences")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {

    private final RestaurantService restaurantService;
    private final OrderService orderService;
    private final PreferenceService preferenceService;
    private final CurrentUserService currentUserService;

    public CustomerController(RestaurantService restaurantService,
                              OrderService orderService,
                              PreferenceService preferenceService,
                              CurrentUserService currentUserService) {
        this.restaurantService = restaurantService;
        this.orderService = orderService;
        this.preferenceService = preferenceService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/restaurants")
    @Operation(
        summary = "Browse restaurants",
        description = "Search and filter restaurants by name, cuisine, or location"
    )
    public List<Restaurant> browseRestaurants(
            @Parameter(description = "Restaurant name") @RequestParam(required = false) String name,
            @Parameter(description = "Cuisine type (e.g., Indian, Chinese)") @RequestParam(required = false) String cuisine,
            @Parameter(description = "Location (e.g., Gurgaon, Delhi)") @RequestParam(required = false) String location) {
        return restaurantService.search(name, cuisine, location);
    }

    @GetMapping("/restaurants/{restaurantId}/menu")
    @Operation(
        summary = "View restaurant menu",
        description = "Get all menu items for a specific restaurant"
    )
    public List<MenuItem> viewMenu(
            @Parameter(description = "Restaurant ID") @PathVariable Long restaurantId) {
        return restaurantService.menuForCustomer(restaurantId);
    }

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Place an order",
        description = "Create a new food order with selected menu items"
    )
    public OrderDtos.OrderResponse placeOrder(@Valid @RequestBody OrderDtos.PlaceOrderRequest request, Principal principal) {
        AppUser user = currentUserService.findByUsername(principal.getName());
        FoodOrder order = orderService.placeOrder(user.getId(), request);
        return OrderDtos.OrderResponse.from(order);
    }

    @GetMapping("/orders/history")
    @Operation(
        summary = "Get order history",
        description = "Retrieve all orders placed by the current customer"
    )
    public List<OrderDtos.OrderResponse> orderHistory(Principal principal) {
        AppUser user = currentUserService.findByUsername(principal.getName());
        return orderService.customerOrderHistory(user.getId()).stream()
                .map(OrderDtos.OrderResponse::from)
                .toList();
    }

    @GetMapping("/orders/{orderId}/status")
    @Operation(
        summary = "Get order status",
        description = "Check the current status of a specific order"
    )
    public String orderStatus(
            @Parameter(description = "Order ID") @PathVariable Long orderId,
            Principal principal) {
        AppUser user = currentUserService.findByUsername(principal.getName());
        return orderService.customerOrderHistory(user.getId()).stream()
                .filter(o -> o.getId().equals(orderId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Order not found"))
                .getStatus()
                .name();
    }

    @PutMapping("/preferences")
    @Operation(
        summary = "Save user preferences",
        description = "Update favorite restaurants, cuisines, and dietary restrictions"
    )
    public AppUser savePreferences(@RequestBody PreferenceDtos.PreferencesRequest request, Principal principal) {
        AppUser user = currentUserService.findByUsername(principal.getName());
        return preferenceService.savePreferences(user.getId(), request);
    }

    @GetMapping("/preferences")
    @Operation(
        summary = "Get user preferences",
        description = "Retrieve current user's saved preferences"
    )
    public PreferenceDtos.PreferencesResponse getPreferences(Principal principal) {
        AppUser user = currentUserService.findByUsername(principal.getName());
        return preferenceService.getPreferences(user.getId());
    }

    @GetMapping("/recommendations")
    @Operation(
        summary = "Get recommended restaurants",
        description = "Get personalized restaurant recommendations based on user preferences"
    )
    public List<Restaurant> recommendations(Principal principal) {
        AppUser user = currentUserService.findByUsername(principal.getName());
        return preferenceService.recommendations(user.getId());
    }
}


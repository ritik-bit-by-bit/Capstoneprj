package org.nagarro.fullstackassignment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.nagarro.fullstackassignment.dto.MenuItemDtos;
import org.nagarro.fullstackassignment.dto.OrderDtos;
import org.nagarro.fullstackassignment.dto.RestaurantDtos;
import org.nagarro.fullstackassignment.model.AppUser;
import org.nagarro.fullstackassignment.model.FoodOrder;
import org.nagarro.fullstackassignment.model.MenuItem;
import org.nagarro.fullstackassignment.model.Restaurant;
import org.nagarro.fullstackassignment.service.CurrentUserService;
import org.nagarro.fullstackassignment.service.OrderService;
import org.nagarro.fullstackassignment.service.RestaurantService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/owner")
@Tag(name = "Restaurant Owner", description = "Restaurant owner operations - manage restaurants, menu items, and orders")
@SecurityRequirement(name = "bearerAuth")
public class OwnerController {

    private final RestaurantService restaurantService;
    private final OrderService orderService;
    private final CurrentUserService currentUserService;

    public OwnerController(RestaurantService restaurantService,
                           OrderService orderService,
                           CurrentUserService currentUserService) {
        this.restaurantService = restaurantService;
        this.orderService = orderService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/restaurants")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Create a new restaurant",
        description = "Register a new restaurant under the current owner"
    )
    public Restaurant createRestaurant(@RequestBody RestaurantDtos.RestaurantRequest request, Principal principal) {
        AppUser owner = currentUserService.findByUsername(principal.getName());
        return restaurantService.upsertRestaurant(owner.getId(), request, null);
    }

    @PutMapping("/restaurants/{restaurantId}")
    @Operation(
        summary = "Update restaurant details",
        description = "Update information for an existing restaurant"
    )
    public Restaurant updateRestaurant(
            @Parameter(description = "Restaurant ID") @PathVariable Long restaurantId,
            @RequestBody RestaurantDtos.RestaurantRequest request,
            Principal principal) {
        AppUser owner = currentUserService.findByUsername(principal.getName());
        return restaurantService.upsertRestaurant(owner.getId(), request, restaurantId);
    }

    @GetMapping("/restaurants")
    @Operation(
        summary = "Get my restaurants",
        description = "Retrieve all restaurants owned by the current user"
    )
    public List<Restaurant> myRestaurants(Principal principal) {
        AppUser owner = currentUserService.findByUsername(principal.getName());
        return restaurantService.ownedRestaurants(owner.getId());
    }

    @PostMapping("/menu-items")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Add menu item",
        description = "Add a new menu item to a restaurant"
    )
    public MenuItem addMenuItem(@RequestBody MenuItemDtos.MenuItemRequest request, Principal principal) {
        AppUser owner = currentUserService.findByUsername(principal.getName());
        return restaurantService.addMenuItem(owner.getId(), request);
    }

    @PutMapping("/menu-items/{menuItemId}")
    @Operation(
        summary = "Update menu item",
        description = "Update an existing menu item"
    )
    public MenuItem updateMenuItem(
            @Parameter(description = "Menu Item ID") @PathVariable Long menuItemId,
            @RequestBody MenuItemDtos.MenuItemRequest request,
            Principal principal) {
        AppUser owner = currentUserService.findByUsername(principal.getName());
        return restaurantService.updateMenuItem(owner.getId(), menuItemId, request);
    }

    @DeleteMapping("/menu-items/{menuItemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Delete menu item",
        description = "Remove a menu item from the restaurant"
    )
    public void deleteMenuItem(
            @Parameter(description = "Menu Item ID") @PathVariable Long menuItemId,
            Principal principal) {
        AppUser owner = currentUserService.findByUsername(principal.getName());
        restaurantService.deleteMenuItem(owner.getId(), menuItemId);
    }

    @GetMapping("/restaurants/{restaurantId}/menu-items")
    @Operation(
        summary = "Get restaurant menu items",
        description = "Retrieve all menu items for a specific restaurant"
    )
    public List<MenuItem> menuByRestaurant(
            @Parameter(description = "Restaurant ID") @PathVariable Long restaurantId) {
        return restaurantService.menuByRestaurant(restaurantId);
    }

    @GetMapping("/orders")
    @Operation(
        summary = "Get received orders",
        description = "Retrieve all orders received for owner's restaurants"
    )
    public List<OrderDtos.OrderResponse> ownerOrders(Principal principal) {
        AppUser owner = currentUserService.findByUsername(principal.getName());
        return orderService.ownerOrders(owner.getId()).stream()
                .map(OrderDtos.OrderResponse::from)
                .toList();
    }

    @PutMapping("/orders/{orderId}/status")
    @Operation(
        summary = "Update order status",
        description = "Change the status of an order (PENDING, PREPARING, READY, COMPLETED)"
    )
    public OrderDtos.OrderResponse updateOrderStatus(
            @Parameter(description = "Order ID") @PathVariable Long orderId,
            @RequestBody OrderDtos.UpdateStatusRequest request,
            Principal principal) {
        AppUser owner = currentUserService.findByUsername(principal.getName());
        FoodOrder order = orderService.updateOrderStatus(owner.getId(), orderId, request.status());
        return OrderDtos.OrderResponse.from(order);
    }
}


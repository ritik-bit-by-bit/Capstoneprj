package org.nagarro.fullstackassignment.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.nagarro.fullstackassignment.dto.OrderDtos;
import org.nagarro.fullstackassignment.model.FoodOrder;
import org.nagarro.fullstackassignment.model.MenuItem;
import org.nagarro.fullstackassignment.model.OrderItem;
import org.nagarro.fullstackassignment.model.OrderStatus;
import org.nagarro.fullstackassignment.model.Restaurant;
import org.nagarro.fullstackassignment.model.SpecialTag;
import org.nagarro.fullstackassignment.repository.FoodOrderRepository;
import org.nagarro.fullstackassignment.repository.MenuItemRepository;
import org.nagarro.fullstackassignment.repository.OrderItemRepository;
import org.nagarro.fullstackassignment.repository.RestaurantRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class OrderServiceTest {

    private FoodOrderRepository orderRepository;
    private MenuItemRepository menuItemRepository;
    private RestaurantRepository restaurantRepository;
    private OrderItemRepository orderItemRepository;
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderRepository = mock(FoodOrderRepository.class);
        menuItemRepository = mock(MenuItemRepository.class);
        restaurantRepository = mock(RestaurantRepository.class);
        orderItemRepository = mock(OrderItemRepository.class);
        orderService = new OrderService(orderRepository, menuItemRepository, restaurantRepository, orderItemRepository);
    }

    @Test
    void shouldPlaceOrderWithComputedTotal() {
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);

        MenuItem menuItem = new MenuItem();
        menuItem.setId(100L);
        menuItem.setRestaurantId(1L);
        menuItem.setName("Pizza");
        menuItem.setPrice(new BigDecimal("12.50"));

        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(restaurant));
        when(menuItemRepository.findById(100L)).thenReturn(Optional.of(menuItem));
        when(orderRepository.save(any(FoodOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderItemRepository.findByOrderRestaurantId(1L)).thenReturn(List.of());
        when(menuItemRepository.findByRestaurantId(1L)).thenReturn(List.of(menuItem));

        FoodOrder order = orderService.placeOrder(10L,
                new OrderDtos.PlaceOrderRequest(1L, List.of(new OrderDtos.PlaceOrderItem(100L, 2))));

        assertEquals(new BigDecimal("25.00"), order.getTotalPrice());
        assertEquals(1, order.getItems().size());
    }

    @Test
    void shouldRejectOrderWhenMenuItemBelongsToDifferentRestaurant() {
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);

        MenuItem menuItem = new MenuItem();
        menuItem.setId(100L);
        menuItem.setRestaurantId(9L);

        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(restaurant));
        when(menuItemRepository.findById(100L)).thenReturn(Optional.of(menuItem));

        assertThrows(IllegalArgumentException.class, () ->
                orderService.placeOrder(10L, new OrderDtos.PlaceOrderRequest(1L,
                        List.of(new OrderDtos.PlaceOrderItem(100L, 1)))));
    }

    @Test
    void shouldAllowValidStatusTransition() {
        Restaurant restaurant = new Restaurant();
        restaurant.setOwnerId(5L);

        FoodOrder order = new FoodOrder();
        order.setId(2L);
        order.setRestaurantId(1L);
        order.setStatus(OrderStatus.PENDING);

        when(orderRepository.findById(2L)).thenReturn(Optional.of(order));
        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(restaurant));

        FoodOrder updated = orderService.updateOrderStatus(5L, 2L, OrderStatus.PREPARING);
        assertEquals(OrderStatus.PREPARING, updated.getStatus());
    }

    @Test
    void shouldRejectInvalidStatusTransition() {
        Restaurant restaurant = new Restaurant();
        restaurant.setOwnerId(5L);

        FoodOrder order = new FoodOrder();
        order.setId(2L);
        order.setRestaurantId(1L);
        order.setStatus(OrderStatus.PENDING);

        when(orderRepository.findById(2L)).thenReturn(Optional.of(order));
        when(restaurantRepository.findById(1L)).thenReturn(Optional.of(restaurant));

        assertThrows(IllegalArgumentException.class,
                () -> orderService.updateOrderStatus(5L, 2L, OrderStatus.READY));
    }

    @Test
    void shouldMarkMostlyOrderedItem() {
        MenuItem first = new MenuItem();
        first.setId(11L);
        first.setSpecialTag(SpecialTag.NONE);

        MenuItem second = new MenuItem();
        second.setId(12L);
        second.setSpecialTag(SpecialTag.NONE);

        OrderItem frequent = new OrderItem();
        frequent.setMenuItemId(11L);
        frequent.setQuantity(5);

        OrderItem lessFrequent = new OrderItem();
        lessFrequent.setMenuItemId(12L);
        lessFrequent.setQuantity(1);

        when(orderItemRepository.findByOrderRestaurantId(1L)).thenReturn(List.of(frequent, lessFrequent));
        when(menuItemRepository.findByRestaurantId(1L)).thenReturn(List.of(first, second));

        orderService.refreshMostlyOrderedForRestaurant(1L);
        assertEquals(SpecialTag.MOSTLY_ORDERED, first.getSpecialTag());
        assertEquals(SpecialTag.NONE, second.getSpecialTag());
    }
}


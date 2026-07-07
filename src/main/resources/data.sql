-- Restaurants
INSERT INTO restaurants (id, name, location, cuisine, rating, owner_id)
SELECT 1, 'Spice House', 'Gurgaon', 'Indian', 4.3, 1
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE id = 1);

INSERT INTO restaurants (id, name, location, cuisine, rating, owner_id)
SELECT 2, 'Dragon Wok', 'Delhi', 'Chinese', 4.5, 1
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE id = 2);

INSERT INTO restaurants (id, name, location, cuisine, rating, owner_id)
SELECT 3, 'Bella Italia', 'Noida', 'Italian', 4.7, 1
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE id = 3);

INSERT INTO restaurants (id, name, location, cuisine, rating, owner_id)
SELECT 4, 'Taco Fiesta', 'Gurgaon', 'Mexican', 4.2, 1
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE id = 4);
-- jj
INSERT INTO restaurants (id, name, location, cuisine, rating, owner_id)
SELECT 5, 'Thai Orchid', 'Delhi', 'Thai', 4.6, 1
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE id = 5);

INSERT INTO restaurants (id, name, location, cuisine, rating, owner_id)
SELECT 6, 'Burger Hub', 'Noida', 'Fast Food', 4.0, 1
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE id = 6);

INSERT INTO restaurants (id, name, location, cuisine, rating, owner_id)
SELECT 7, 'The Grand Continental', 'Gurgaon', 'Continental', 4.8, 1
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE id = 7);

INSERT INTO restaurants (id, name, location, cuisine, rating, owner_id)
SELECT 8, 'Curry Palace', 'Delhi', 'Indian', 4.4, 1
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE id = 8);

-- Menu Items for Spice House (Indian)
INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 100, 1, 'Paneer Tikka', 'Grilled cottage cheese with spices', 280.00, 'TODAYS_SPECIAL', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 100);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 101, 1, 'Veg Biryani', 'Aromatic rice with vegetables', 220.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 101);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 102, 1, 'Dal Makhani', 'Creamy black lentils', 180.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 102);

-- Menu Items for Dragon Wok (Chinese)
INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 200, 2, 'Veg Hakka Noodles', 'Stir-fried noodles with vegetables', 200.00, 'TODAYS_SPECIAL', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 200);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 201, 2, 'Veg Fried Rice', 'Wok-tossed rice with vegetables', 180.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 201);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 202, 2, 'Spring Rolls', 'Crispy vegetable rolls', 150.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 202);

-- Menu Items for Bella Italia (Italian)
INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 300, 3, 'Margherita Pizza', 'Classic pizza with fresh mozzarella', 350.00, 'TODAYS_SPECIAL', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 300);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 301, 3, 'Pasta Alfredo', 'Creamy fettuccine pasta', 320.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 301);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 302, 3, 'Garlic Bread', 'Toasted bread with garlic butter', 120.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 302);

-- Menu Items for Taco Fiesta (Mexican)
INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 400, 4, 'Veg Tacos', 'Soft tacos with beans and vegetables', 240.00, 'TODAYS_SPECIAL', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 400);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 401, 4, 'Burrito Bowl', 'Rice bowl with beans and salsa', 280.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 401);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 402, 4, 'Nachos', 'Crispy chips with cheese sauce', 180.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 402);

-- Menu Items for Thai Orchid (Thai)
INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 500, 5, 'Pad Thai', 'Stir-fried rice noodles with peanuts', 260.00, 'TODAYS_SPECIAL', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 500);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 501, 5, 'Green Curry', 'Spicy coconut curry with vegetables', 290.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 501);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 502, 5, 'Tom Yum Soup', 'Spicy and sour Thai soup', 200.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 502);

-- Menu Items for Burger Hub (Fast Food)
INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 600, 6, 'Veg Burger', 'Crispy veggie patty with cheese', 150.00, 'TODAYS_SPECIAL', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 600);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 601, 6, 'French Fries', 'Crispy golden fries', 100.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 601);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 602, 6, 'Cheese Pizza', 'Personal size cheese pizza', 180.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 602);

-- Menu Items for The Grand Continental
INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 700, 7, 'Grilled Vegetables', 'Assorted grilled vegetables', 320.00, 'TODAYS_SPECIAL', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 700);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 701, 7, 'Mushroom Risotto', 'Creamy Italian rice with mushrooms', 380.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 701);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 702, 7, 'Caesar Salad', 'Fresh romaine with parmesan', 240.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 702);

-- Menu Items for Curry Palace (Indian)
INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 800, 8, 'Butter Chicken', 'Creamy tomato-based curry', 320.00, 'TODAYS_SPECIAL', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 800);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 801, 8, 'Naan Bread', 'Fresh tandoor-baked bread', 50.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 801);

INSERT INTO menu_items (id, restaurant_id, name, description, price, special_tag, active)
SELECT 802, 8, 'Samosa', 'Crispy pastry with spiced potatoes', 80.00, 'NONE', true
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE id = 802);



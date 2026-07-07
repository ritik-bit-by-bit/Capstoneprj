import React, { useState, useEffect } from 'react';
import { customerAPI } from '../../api/apiService';
import { showSuccess, showError } from '../../utils/toast';

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  specialTag: string;
}

interface CartItem {
  menuItemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

const BrowseRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchCuisine, setSearchCuisine] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showRecommended, setShowRecommended] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const availableCuisines = ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Continental', 'Fast Food'];
  const availableLocations = ['Gurgaon', 'Delhi', 'Noida'];

  useEffect(() => {
    loadRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRecommended]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      if (showRecommended) {
        const response = await customerAPI.recommendations();
        setRestaurants(response.data);
      } else {
        const response = await customerAPI.browseRestaurants(searchName, searchCuisine, searchLocation);
        setRestaurants(response.data);
      }
    } catch (error: any) {
      showError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (showRecommended) {
      setShowRecommended(false);
    }
    loadRestaurants();
  };

  const clearFilters = () => {
    setSearchName('');
    setSearchCuisine('');
    setSearchLocation('');
    setShowRecommended(false);
  };

  const handleSelectRestaurant = async (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoading(true);
    try {
      const response = await customerAPI.viewMenu(restaurant.id);
      setMenu(response.data);
    } catch (error: any) {
      showError('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(c => c.menuItemId === item.id);
    if (existing) {
      setCart(cart.map(c =>
        c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, {
        menuItemId: item.id,
        itemName: item.name,
        quantity: 1,
        unitPrice: item.price,
      }]);
    }
    showSuccess(`${item.name} added to cart`);
  };

  const removeFromCart = (menuItemId: number) => {
    setCart(cart.filter(c => c.menuItemId !== menuItemId));
  };

  const handlePlaceOrder = async () => {
    if (!selectedRestaurant || cart.length === 0) {
      showError('Please select items to order');
      return;
    }

    setPlacingOrder(true);
    try {
      await customerAPI.placeOrder(selectedRestaurant.id, cart.map(c => ({
        menuItemId: c.menuItemId,
        quantity: c.quantity,
      })));
      showSuccess('Order placed successfully!');
      setCart([]);
      setSelectedRestaurant(null);
      setMenu([]);
      setShowCart(false);
    } catch (error: any) {
      showError('Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2);

  const getCuisineIcon = (cuisine: string) => {
    const icons: Record<string, string> = {
      'Indian': '🍛',
      'Chinese': '🥡',
      'Italian': '🍝',
      'Mexican': '🌮',
      'Thai': '🍜',
      'Continental': '🍽️',
      'Fast Food': '🍔'
    };
    return icons[cuisine] || '🍴';
  };

  return (
    <div>
      {!selectedRestaurant ? (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#1f2937' }}>
              {showRecommended ? '⭐ Recommended For You' : '🍽️ Browse Restaurants'}
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className={`btn ${!showRecommended ? 'btn-secondary' : ''}`}
                onClick={() => setShowRecommended(!showRecommended)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px'
                }}
              >
                {showRecommended ? '📋 All Restaurants' : '⭐ Show Recommended'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                style={{ padding: '10px 16px' }}
                title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
              >
                {viewMode === 'grid' ? '☰' : '▦'}
              </button>
            </div>
          </div>

          {!showRecommended && (
            <div className="card" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              marginBottom: '24px'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'white' }}>
                🔍 Search & Filter
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'white' }}>Restaurant Name</label>
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Search by name"
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'white' }}>Cuisine Type</label>
                  <select
                    value={searchCuisine}
                    onChange={(e) => setSearchCuisine(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">All Cuisines</option>
                    {availableCuisines.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{getCuisineIcon(cuisine)} {cuisine}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'white' }}>Location</label>
                  <select
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">All Locations</option>
                    {availableLocations.map(location => (
                      <option key={location} value={location}>📍 {location}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn"
                  onClick={handleSearch}
                  disabled={loading}
                  style={{
                    background: 'white',
                    color: '#667eea',
                    flex: 1
                  }}
                >
                  {loading ? 'Searching...' : '🔍 Search'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={clearFilters}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid white'
                  }}
                >
                  ✕ Clear
                </button>
              </div>
            </div>
          )}

          {(searchName || searchCuisine || searchLocation || showRecommended) && (
            <div style={{
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 'bold', color: '#6b7280' }}>Active Filters:</span>
              {showRecommended && (
                <span className="status-badge" style={{ background: '#f59e0b' }}>
                  ⭐ Recommended
                </span>
              )}
              {searchName && (
                <span className="status-badge" style={{ background: '#3b82f6' }}>
                  Name: {searchName}
                </span>
              )}
              {searchCuisine && (
                <span className="status-badge" style={{ background: '#10b981' }}>
                  {getCuisineIcon(searchCuisine)} {searchCuisine}
                </span>
              )}
              {searchLocation && (
                <span className="status-badge" style={{ background: '#8b5cf6' }}>
                  📍 {searchLocation}
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="loading" style={{ padding: '60px', background: 'transparent' }}>
              <div style={{ fontSize: '48px', animation: 'pulse 1.5s ease-in-out infinite' }}>
                🍽️
              </div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>😕</div>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>No restaurants found</p>
              <p style={{ color: '#9ca3af' }}>
                {showRecommended
                  ? 'Set your preferences to get personalized recommendations!'
                  : 'Try adjusting your search criteria or clear filters.'}
              </p>
              {showRecommended && (
                <button
                  className="btn"
                  onClick={() => setShowRecommended(false)}
                  style={{ marginTop: '20px' }}
                >
                  Browse All Restaurants
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{
                marginBottom: '12px',
                fontSize: '14px',
                color: '#6b7280',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Found {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}</span>
              </div>
              <div className={viewMode === 'grid' ? 'grid' : ''} style={viewMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: '16px' } : {}}>
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="card"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: '2px solid transparent',
                      display: viewMode === 'list' ? 'flex' : 'block',
                      justifyContent: viewMode === 'list' ? 'space-between' : 'initial',
                      alignItems: viewMode === 'list' ? 'center' : 'initial',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(15, 23, 42, 0.15)';
                      e.currentTarget.style.borderColor = '#e74c3c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 24px rgba(15, 23, 42, 0.08)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div style={{ flex: viewMode === 'list' ? 1 : 'initial' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px'
                      }}>
                        <span style={{ fontSize: '32px' }}>
                          {getCuisineIcon(restaurant.cuisine)}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div className="card-title" style={{ marginBottom: '4px' }}>
                            {restaurant.name}
                          </div>
                          <div style={{
                            display: 'flex',
                            gap: '12px',
                            fontSize: '13px',
                            color: '#6b7280',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{
                              background: '#fef3c7',
                              color: '#92400e',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: '500'
                            }}>
                              {restaurant.cuisine}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              📍 {restaurant.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#f59e0b',
                        marginBottom: viewMode === 'list' ? 0 : '16px'
                      }}>
                        <span>⭐</span>
                        <span>{restaurant.rating.toFixed(1)}</span>
                        <span style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          fontWeight: 'normal',
                          marginLeft: '4px'
                        }}>
                          / 5.0
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn"
                      onClick={() => handleSelectRestaurant(restaurant)}
                      style={viewMode === 'list' ? { minWidth: '140px' } : { width: '100%' }}
                    >
                      View Menu →
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {/* Restaurant Header */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            marginBottom: '24px',
            borderRadius: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{
                  fontSize: '56px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '16px',
                  padding: '12px',
                  backdropFilter: 'blur(10px)'
                }}>
                  {getCuisineIcon(selectedRestaurant.cuisine)}
                </div>
                <div>
                  <h2 style={{ margin: 0, marginBottom: '8px', color: 'white', fontSize: '32px' }}>
                    {selectedRestaurant.name}
                  </h2>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '14px' }}>
                    <span style={{
                      background: 'rgba(255,255,255,0.25)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}>
                      {selectedRestaurant.cuisine}
                    </span>
                    <span style={{
                      background: 'rgba(255,255,255,0.25)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}>
                      📍 {selectedRestaurant.location}
                    </span>
                    <span style={{
                      background: 'rgba(255,255,255,0.25)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}>
                      ⭐ {selectedRestaurant.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedRestaurant(null);
                    setMenu([]);
                    setCart([]);
                    setShowCart(false);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid white',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  ← Back
                </button>
                <button
                  className="btn"
                  onClick={() => setShowCart(!showCart)}
                  style={{
                    background: 'white',
                    color: '#667eea',
                    position: 'relative',
                    minWidth: '120px'
                  }}
                >
                  🛒 Cart
                  {cart.length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Cart Section */}
          {showCart && (
            <div className="card" style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              marginBottom: '24px',
              border: '2px solid #f59e0b'
            }}>
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                🛒 Your Cart
              </h3>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#92400e' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
                  <p>Your cart is empty. Add some delicious items!</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.menuItemId}
                      className="order-item"
                      style={{
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #fbbf24'
                      }}
                    >
                      <div className="order-item-header">
                        <span className="order-item-name" style={{ fontSize: '16px' }}>
                          {item.itemName}
                        </span>
                        <span className="order-item-price" style={{ fontSize: '18px' }}>
                          ₹{(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <span className="order-item-quantity" style={{
                          background: '#fef3c7',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}>
                          Qty: {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                        </span>
                        <button
                          className="btn btn-secondary"
                          onClick={() => removeFromCart(item.menuItemId)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            background: '#ef4444',
                            color: 'white'
                          }}
                        >
                          Remove ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  <div style={{
                    marginTop: '20px',
                    paddingTop: '20px',
                    borderTop: '2px solid #fbbf24',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }}>
                      <span>Total:</span>
                      <span style={{ color: '#ef4444' }}>₹{totalPrice}</span>
                    </div>
                    <button
                      className="btn"
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                      style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      }}
                    >
                      {placingOrder ? 'Placing Order...' : '✓ Place Order'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Menu Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>
              📋 Menu
            </h3>
            <span style={{
              color: '#6b7280',
              fontSize: '14px',
              background: '#f3f4f6',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: '500'
            }}>
              {menu.length} item{menu.length !== 1 ? 's' : ''} available
            </span>
          </div>

          {menu.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🍽️</div>
              <p>No menu items available at the moment</p>
            </div>
          ) : (
            <div className="grid">
              {menu.map((item) => (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(15, 23, 42, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(15, 23, 42, 0.08)';
                  }}
                >
                  {item.specialTag && item.specialTag !== 'NONE' && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                      zIndex: 1
                    }}>
                      ⭐ {item.specialTag.replace(/_/g, ' ')}
                    </div>
                  )}
                  <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
                    height: '100px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    🍽️
                  </div>
                  <div className="card-title" style={{ fontSize: '20px', marginBottom: '8px' }}>
                    {item.name}
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    minHeight: '40px'
                  }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto'
                  }}>
                    <div style={{
                      color: '#ef4444',
                      fontWeight: 'bold',
                      fontSize: '24px'
                    }}>
                      ₹{item.price.toFixed(2)}
                    </div>
                    <button
                      className="btn"
                      onClick={() => addToCart(item)}
                      style={{
                        padding: '10px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseRestaurants;


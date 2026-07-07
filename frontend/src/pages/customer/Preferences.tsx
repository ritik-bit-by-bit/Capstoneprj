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

const Preferences: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<number[]>([]);
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [newCuisine, setNewCuisine] = useState('');
  const [newRestriction, setNewRestriction] = useState('');
  const [saving, setSaving] = useState(false);

  const commonCuisines = ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Continental', 'Fast Food'];
  const commonRestrictions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Spicy'];

  useEffect(() => {
    loadRestaurants();
    loadCurrentPreferences();
  }, []);

  const loadRestaurants = async () => {
    try {
      const response = await customerAPI.browseRestaurants();
      setRestaurants(response.data);
    } catch (error: any) {
      showError('Failed to load restaurants');
    }
  };

  const loadCurrentPreferences = async () => {
    try {
      const response = await customerAPI.getPreferences();
      const prefs = response.data;
      if (prefs.favoriteRestaurantIds) {
        setFavoriteRestaurantIds(Array.from(prefs.favoriteRestaurantIds));
      }
      if (prefs.favoriteCuisines) {
        setFavoriteCuisines(Array.from(prefs.favoriteCuisines));
      }
      if (prefs.dietaryRestrictions) {
        setDietaryRestrictions(Array.from(prefs.dietaryRestrictions));
      }
    } catch (error: any) {
      // Silent fail - user may not have preferences yet
      console.log('No preferences found or error loading preferences');
    }
  };

  const toggleFavoriteRestaurant = (restaurantId: number) => {
    if (favoriteRestaurantIds.includes(restaurantId)) {
      setFavoriteRestaurantIds(favoriteRestaurantIds.filter(id => id !== restaurantId));
    } else {
      setFavoriteRestaurantIds([...favoriteRestaurantIds, restaurantId]);
    }
  };

  const addCuisine = () => {
    if (newCuisine && !favoriteCuisines.includes(newCuisine)) {
      setFavoriteCuisines([...favoriteCuisines, newCuisine]);
      setNewCuisine('');
    }
  };

  const removeCuisine = (cuisine: string) => {
    setFavoriteCuisines(favoriteCuisines.filter(c => c !== cuisine));
  };

  const addRestriction = () => {
    if (newRestriction && !dietaryRestrictions.includes(newRestriction)) {
      setDietaryRestrictions([...dietaryRestrictions, newRestriction]);
      setNewRestriction('');
    }
  };

  const removeRestriction = (restriction: string) => {
    setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await customerAPI.savePreferences(favoriteRestaurantIds, favoriteCuisines, dietaryRestrictions);
      showSuccess('Preferences saved successfully!');
    } catch (error: any) {
      showError('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#1f2937' }}>
          ⚙️ My Preferences
        </h2>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          {favoriteRestaurantIds.length + favoriteCuisines.length + dietaryRestrictions.length} preferences set
        </div>
      </div>

      <div className="card" style={{
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        color: '#78350f',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>💡</div>
          <div>
            <h4 style={{ margin: 0, marginBottom: '4px', color: '#78350f' }}>
              Personalized Recommendations
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
              Set your preferences to get restaurant recommendations tailored just for you!
              We'll filter restaurants based on your favorite cuisines and dietary needs.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{
        background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
        border: '2px solid #ec4899'
      }}>
        <h3 style={{
          marginTop: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#831843'
        }}>
          ❤️ Favorite Restaurants
        </h3>
        <p style={{ color: '#9f1239', fontSize: '14px', marginTop: 0 }}>
          Select your favorite restaurants to see them in recommendations
        </p>
        {restaurants.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#9f1239'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍽️</div>
            <p>No restaurants available</p>
          </div>
        ) : (
          <div className="grid">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => toggleFavoriteRestaurant(restaurant.id)}
                style={{
                  padding: '20px',
                  border: favoriteRestaurantIds.includes(restaurant.id)
                    ? '3px solid #ec4899'
                    : '2px solid #f9a8d4',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  backgroundColor: favoriteRestaurantIds.includes(restaurant.id)
                    ? '#fff1f2'
                    : 'white',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!favoriteRestaurantIds.includes(restaurant.id)) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(236, 72, 153, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {favoriteRestaurantIds.includes(restaurant.id) && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '28px',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}>
                    ❤️
                  </div>
                )}
                <div style={{
                  fontSize: '36px',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  🍽️
                </div>
                <h4 style={{
                  margin: '0 0 8px 0',
                  textAlign: 'center',
                  color: '#831843',
                  fontSize: '18px'
                }}>
                  {restaurant.name}
                </h4>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    background: '#fce7f3',
                    color: '#9f1239',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {restaurant.cuisine}
                  </span>
                </div>
                <p style={{
                  fontSize: '13px',
                  color: '#9f1239',
                  textAlign: 'center',
                  margin: '4px 0'
                }}>
                  📍 {restaurant.location}
                </p>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#f59e0b',
                  textAlign: 'center',
                  margin: '8px 0 0 0'
                }}>
                  ⭐ {restaurant.rating.toFixed(1)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        border: '2px solid #3b82f6'
      }}>
        <h3 style={{
          marginTop: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#1e40af'
        }}>
          🍜 Favorite Cuisines
        </h3>
        <p style={{ color: '#1e3a8a', fontSize: '14px', marginTop: 0 }}>
          Select cuisine types you love - we'll recommend restaurants matching your tastes
        </p>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600',
            color: '#1e40af',
            fontSize: '14px'
          }}>
            Quick Add Popular Cuisines
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {commonCuisines.map((cuisine) => (
              <button
                key={cuisine}
                className="btn"
                onClick={() => {
                  if (!favoriteCuisines.includes(cuisine)) {
                    setFavoriteCuisines([...favoriteCuisines, cuisine]);
                  }
                }}
                style={{
                  opacity: favoriteCuisines.includes(cuisine) ? 0.5 : 1,
                  background: favoriteCuisines.includes(cuisine)
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  padding: '10px 16px',
                  fontSize: '13px'
                }}
                disabled={favoriteCuisines.includes(cuisine)}
              >
                {favoriteCuisines.includes(cuisine) ? '✓ ' : '+ '}{cuisine}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#1e40af',
            fontSize: '14px'
          }}>
            Or Add Custom Cuisine
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newCuisine}
              onChange={(e) => setNewCuisine(e.target.value)}
              placeholder="Enter cuisine type (e.g., Japanese)"
              onKeyPress={(e) => e.key === 'Enter' && addCuisine()}
              style={{ flex: 1 }}
            />
            <button
              className="btn"
              onClick={addCuisine}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                minWidth: '100px'
              }}
            >
              + Add
            </button>
          </div>
        </div>
        {favoriteCuisines.length > 0 && (
          <div>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              fontWeight: '600',
              color: '#1e40af',
              fontSize: '14px'
            }}>
              Your Selected Cuisines ({favoriteCuisines.length})
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {favoriteCuisines.map((cuisine) => (
                <div
                  key={cuisine}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <span>{cuisine}</span>
                  <button
                    onClick={() => removeCuisine(cuisine)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '2px 8px',
                      borderRadius: '50%',
                      fontWeight: 'bold',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        border: '2px solid #10b981'
      }}>
        <h3 style={{
          marginTop: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#065f46'
        }}>
          🥗 Dietary Restrictions
        </h3>
        <p style={{ color: '#047857', fontSize: '14px', marginTop: 0 }}>
          Let us know your dietary preferences for better recommendations
        </p>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600',
            color: '#065f46',
            fontSize: '14px'
          }}>
            Quick Add Common Restrictions
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {commonRestrictions.map((restriction) => (
              <button
                key={restriction}
                className="btn"
                onClick={() => {
                  if (!dietaryRestrictions.includes(restriction)) {
                    setDietaryRestrictions([...dietaryRestrictions, restriction]);
                  }
                }}
                style={{
                  opacity: dietaryRestrictions.includes(restriction) ? 0.5 : 1,
                  background: dietaryRestrictions.includes(restriction)
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '10px 16px',
                  fontSize: '13px'
                }}
                disabled={dietaryRestrictions.includes(restriction)}
              >
                {dietaryRestrictions.includes(restriction) ? '✓ ' : '+ '}{restriction}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#065f46',
            fontSize: '14px'
          }}>
            Or Add Custom Restriction
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newRestriction}
              onChange={(e) => setNewRestriction(e.target.value)}
              placeholder="Enter dietary restriction"
              onKeyDown={(e) => e.key === 'Enter' && addRestriction()}
              style={{ flex: 1 }}
            />
            <button
              className="btn"
              onClick={addRestriction}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                minWidth: '100px'
              }}
            >
              + Add
            </button>
          </div>
        </div>
        {dietaryRestrictions.length > 0 && (
          <div>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              fontWeight: '600',
              color: '#065f46',
              fontSize: '14px'
            }}>
              Your Dietary Restrictions ({dietaryRestrictions.length})
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {dietaryRestrictions.map((restriction) => (
                <div
                  key={restriction}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <span>{restriction}</span>
                  <button
                    onClick={() => removeRestriction(restriction)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '2px 8px',
                      borderRadius: '50%',
                      fontWeight: 'bold',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{
        position: 'sticky',
        bottom: '20px',
        background: 'white',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '24px'
      }}>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937' }}>
            Ready to save your preferences?
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            {favoriteRestaurantIds.length} favorite restaurants, {favoriteCuisines.length} cuisines, {dietaryRestrictions.length} restrictions
          </div>
        </div>
        <button
          className="btn"
          onClick={handleSave}
          disabled={saving}
          style={{
            minWidth: '160px',
            padding: '14px 28px',
            fontSize: '16px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          }}
        >
          {saving ? 'Saving...' : '💾 Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default Preferences;


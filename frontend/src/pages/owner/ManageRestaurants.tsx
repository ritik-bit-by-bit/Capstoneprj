import React, { useState, useEffect } from 'react';
import { ownerAPI } from '../../api/apiService';
import { showSuccess, showError } from '../../utils/toast';

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
}

const ManageRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    location: '',
    rating: 4.0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const response = await ownerAPI.myRestaurants();
      setRestaurants(response.data);
    } catch (error: any) {
      showError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await ownerAPI.updateRestaurant(editingId, formData.name, formData.location, formData.cuisine, formData.rating);
        showSuccess('Restaurant updated successfully!');
      } else {
        await ownerAPI.createRestaurant(formData.name, formData.location, formData.cuisine, formData.rating);
        showSuccess('Restaurant created successfully!');
      }

      setFormData({ name: '', cuisine: '', location: '', rating: 4.0 });
      setEditingId(null);
      setShowForm(false);
      loadRestaurants();
    } catch (error: any) {
      showError('Failed to save restaurant');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setFormData(restaurant);
    setEditingId(restaurant.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', cuisine: '', location: '', rating: 4.0 });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="empty-state"><p>Loading...</p></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Restaurants</h2>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Restaurant'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingId ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Restaurant Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label>Cuisine Type</label>
              <input
                type="text"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                required
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label>Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                required
                disabled={submitting}
              />
            </div>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel} style={{ marginLeft: '10px' }} disabled={submitting}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {restaurants.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any restaurants yet. Click "Add Restaurant" to get started!</p>
        </div>
      ) : (
        <div className="grid">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="card">
              <div className="card-title">{restaurant.name}</div>
              <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
              <p><strong>Location:</strong> {restaurant.location}</p>
              <p><strong>Rating:</strong> ⭐ {restaurant.rating}</p>
              <button
                className="btn"
                onClick={() => handleEdit(restaurant)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageRestaurants;


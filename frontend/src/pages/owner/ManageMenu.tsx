import React, { useState, useEffect } from 'react';
import { ownerAPI } from '../../api/apiService';
import { showSuccess, showError } from '../../utils/toast';

interface Restaurant {
  id: number;
  name: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  specialTag: string;
}

const ManageMenu: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    specialTag: 'NONE',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const response = await ownerAPI.myRestaurants();
      setRestaurants(response.data);
      if (response.data.length > 0) {
        setSelectedRestaurant(response.data[0].id);
        loadMenuItems(response.data[0].id);
      }
    } catch (error: any) {
      showError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const loadMenuItems = async (restaurantId: number) => {
    try {
      const response = await ownerAPI.menuByRestaurant(restaurantId);
      setMenuItems(response.data);
    } catch (error: any) {
      showError('Failed to load menu items');
    }
  };

  const handleSelectRestaurant = (id: number) => {
    setSelectedRestaurant(id);
    loadMenuItems(id);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant) {
      showError('Please select a restaurant');
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        await ownerAPI.updateMenuItem(editingId, selectedRestaurant, formData.name, formData.description, formData.price, formData.specialTag);
        showSuccess('Menu item updated successfully!');
      } else {
        await ownerAPI.addMenuItem(selectedRestaurant, formData.name, formData.description, formData.price, formData.specialTag);
        showSuccess('Menu item added successfully!');
      }

      setFormData({ name: '', description: '', price: 0, specialTag: 'NONE' });
      setEditingId(null);
      setShowForm(false);
      loadMenuItems(selectedRestaurant);
    } catch (error: any) {
      showError('Failed to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await ownerAPI.deleteMenuItem(itemId);
        showSuccess('Menu item deleted successfully!');
        if (selectedRestaurant) {
          loadMenuItems(selectedRestaurant);
        }
      } catch (error: any) {
        showError('Failed to delete menu item');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', price: 0, specialTag: 'NONE' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="empty-state"><p>Loading...</p></div>;
  }

  if (restaurants.length === 0) {
    return <div className="empty-state"><p>Please create a restaurant first.</p></div>;
  }

  return (
    <div>
      <h2>Manage Menu</h2>

      <div className="card">
        <label style={{ fontWeight: 'bold' }}>Select Restaurant</label>
        <select
          value={selectedRestaurant || ''}
          onChange={(e) => handleSelectRestaurant(parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginTop: '8px',
            marginBottom: '15px',
          }}
        >
          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </option>
          ))}
        </select>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Menu Item'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                disabled={submitting}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label>Special Tag</label>
              <select
                value={formData.specialTag}
                onChange={(e) => setFormData({ ...formData, specialTag: e.target.value })}
                disabled={submitting}
              >
                <option value="NONE">None</option>
                <option value="TODAYS_SPECIAL">Today's Special</option>
                <option value="DEAL_OF_THE_DAY">Deal of the Day</option>
                <option value="MOSTLY_ORDERED">Mostly Ordered</option>
              </select>
            </div>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Saving...' : (editingId ? 'Update' : 'Add Item')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel} style={{ marginLeft: '10px' }} disabled={submitting}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {menuItems.length === 0 ? (
        <div className="empty-state">
          <p>No menu items yet. Click "Add Menu Item" to get started!</p>
        </div>
      ) : (
        <div className="grid">
          {menuItems.map((item) => (
            <div key={item.id} className="card">
              <div className="card-title">{item.name}</div>
              {item.specialTag && item.specialTag !== 'NONE' && (
                <div style={{ marginBottom: '10px' }}>
                  <span className="status-badge" style={{ backgroundColor: '#f39c12' }}>
                    {item.specialTag.replace('_', ' ')}
                  </span>
                </div>
              )}
              <p>{item.description}</p>
              <p style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '18px', marginBottom: '15px' }}>
                ₹{item.price.toFixed(2)}
              </p>
              <div className="btn-group">
                <button className="btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="btn btn-secondary" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMenu;


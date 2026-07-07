import React, { useState, useEffect } from 'react';
import { ownerAPI } from '../../api/apiService';
import { showSuccess, showError } from '../../utils/toast';

interface Order {
  id: number;
  customerId: number;
  restaurantId: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  menuItemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await ownerAPI.ownerOrders();
      setOrders(response.data);
    } catch (error: any) {
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    switch (currentStatus) {
      case 'PENDING':
        return 'PREPARING';
      case 'PREPARING':
        return 'READY';
      case 'READY':
        return 'COMPLETED';
      default:
        return null;
    }
  };

  const handleUpdateStatus = async (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) {
      showError('Order is already completed');
      return;
    }

    setUpdating(orderId);
    try {
      await ownerAPI.updateOrderStatus(orderId, nextStatus);
      showSuccess(`Order status updated to ${nextStatus}`);
      loadOrders();
    } catch (error: any) {
      showError('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'PREPARING':
        return 'status-preparing';
      case 'READY':
        return 'status-ready';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="empty-state"><p>Loading...</p></div>;
  }

  if (orders.length === 0) {
    return <div className="empty-state"><p>No orders yet.</p></div>;
  }

  return (
    <div>
      <h2>Manage Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <h4>Order #{order.id}</h4>
              <p style={{ fontSize: '12px', color: '#666' }}>{formatDate(order.createdAt)}</p>
            </div>
            <span className={`status-badge ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
            <h5>Items:</h5>
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item">
                <div className="order-item-header">
                  <span className="order-item-name">{item.itemName}</span>
                  <span className="order-item-price">₹{item.totalPrice.toFixed(2)}</span>
                </div>
                <span className="order-item-quantity">Qty: {item.quantity}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Total: ₹{order.totalPrice.toFixed(2)}</h4>
            {getNextStatus(order.status) && (
              <button
                className="btn"
                onClick={() => handleUpdateStatus(order.id)}
                disabled={updating === order.id}
              >
                {updating === order.id ? 'Updating...' : `Mark as ${getNextStatus(order.status)}`}
              </button>
            )}
            {!getNextStatus(order.status) && (
              <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓ Order Complete</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageOrders;


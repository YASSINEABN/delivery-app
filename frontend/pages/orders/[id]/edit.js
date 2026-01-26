import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { orderAPI } from '../../../lib/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorAlert from '../../../components/ErrorAlert';
import SuccessAlert from '../../../components/SuccessAlert';
import StatusBadge from '../../../components/StatusBadge';

export default function EditOrder() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [order, setOrder] = useState(null);
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPostalCode: '',
    specialInstructions: '',
  });
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    notes: '',
    changedBy: '',
  });

  useEffect(() => {
    if (!id) return;

    async function fetchOrder() {
      try {
        setLoading(true);
        const orderData = await orderAPI.getById(id);
        setOrder(orderData);
        setFormData({
          deliveryAddress: orderData.deliveryAddress || '',
          deliveryCity: orderData.deliveryCity || '',
          deliveryPostalCode: orderData.deliveryPostalCode || '',
          specialInstructions: orderData.specialInstructions || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (e) => {
    setStatusUpdate({
      ...statusUpdate,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await orderAPI.update(id, formData);
      setSuccess('Order updated successfully!');
      setTimeout(() => {
        router.push(`/orders/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusUpdate.status) {
      setError('Please select a status');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await orderAPI.updateStatus(id, {
        status: statusUpdate.status,
        notes: statusUpdate.notes || '',
        changedBy: statusUpdate.changedBy || 'admin@deliveryapp.com',
      });
      setSuccess('Order status updated successfully!');
      setTimeout(() => {
        router.push(`/orders/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <ErrorAlert message="Order not found" />
        <button onClick={() => router.back()} className="btn btn-secondary mt-4">
          Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Order</h1>
        <p className="mt-2 text-gray-600">Order: {order.orderNumber}</p>
        <div className="mt-2">
          <StatusBadge status={order.status} type="order" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
          {success && <SuccessAlert message={success} />}

          <h2 className="text-xl font-semibold mb-4">Update Order Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="deliveryAddress" className="label">
                Delivery Address *
              </label>
              <input
                type="text"
                id="deliveryAddress"
                name="deliveryAddress"
                required
                value={formData.deliveryAddress}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="deliveryCity" className="label">
                  City *
                </label>
                <input
                  type="text"
                  id="deliveryCity"
                  name="deliveryCity"
                  required
                  value={formData.deliveryCity}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="deliveryPostalCode" className="label">
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="deliveryPostalCode"
                  name="deliveryPostalCode"
                  required
                  value={formData.deliveryPostalCode}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="specialInstructions" className="label">
                Special Instructions
              </label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                className="input"
                rows="3"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-secondary"
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
          <form onSubmit={handleStatusUpdate} className="space-y-6">
            <div>
              <label htmlFor="status" className="label">
                New Status *
              </label>
              <select
                id="status"
                name="status"
                required
                value={statusUpdate.status}
                onChange={handleStatusChange}
                className="input"
              >
                <option value="">Select status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="READY_FOR_DELIVERY">Ready for Delivery</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="label">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={statusUpdate.notes}
                onChange={handleStatusChange}
                className="input"
                rows="3"
                placeholder="Optional notes about this status change"
              />
            </div>

            <div>
              <label htmlFor="changedBy" className="label">
                Changed By
              </label>
              <input
                type="text"
                id="changedBy"
                name="changedBy"
                value={statusUpdate.changedBy}
                onChange={handleStatusChange}
                className="input"
                placeholder="admin@deliveryapp.com"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={saving}>
              {saving ? 'Updating...' : 'Update Status'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



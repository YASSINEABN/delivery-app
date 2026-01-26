import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { deliveryAPI, orderAPI, delivererAPI } from '../../lib/api';
import ErrorAlert from '../../components/ErrorAlert';
import SuccessAlert from '../../components/SuccessAlert';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function NewDelivery() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [orders, setOrders] = useState([]);
  const [deliverers, setDeliverers] = useState([]);
  const [formData, setFormData] = useState({
    orderId: '',
    delivererId: '',
    pickupAddress: '',
    pickupCity: '',
    pickupPostalCode: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPostalCode: '',
    priority: 'NORMAL',
    specialInstructions: '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersData, deliverersData] = await Promise.all([
          orderAPI.getAll().catch(() => []),
          delivererAPI.getAvailable().catch(() => []),
        ]);
        setOrders(Array.isArray(ordersData) ? ordersData : ordersData?.content || []);
        setDeliverers(Array.isArray(deliverersData) ? deliverersData : []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrderSelect = async (orderId) => {
    if (!orderId) return;
    try {
      const order = await orderAPI.getById(orderId);
      setFormData({
        ...formData,
        orderId: orderId,
        pickupAddress: order.deliveryAddress || '',
        pickupCity: order.deliveryCity || '',
        pickupPostalCode: order.deliveryPostalCode || '',
        deliveryAddress: order.deliveryAddress || '',
        deliveryCity: order.deliveryCity || '',
        deliveryPostalCode: order.deliveryPostalCode || '',
        specialInstructions: order.specialInstructions || '',
      });
    } catch (err) {
      console.error('Error fetching order:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const deliveryData = {
        ...formData,
        orderId: parseInt(formData.orderId),
        delivererId: formData.delivererId ? parseInt(formData.delivererId) : null,
      };
      await deliveryAPI.create(deliveryData);
      setSuccess('Delivery created successfully!');
      setTimeout(() => {
        router.push('/deliveries');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create delivery');
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Delivery</h1>
        <p className="mt-2 text-gray-600">Create a new delivery assignment</p>
      </div>

      <div className="card max-w-4xl">
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message={success} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="orderId" className="label">
                Order *
              </label>
              <select
                id="orderId"
                name="orderId"
                required
                value={formData.orderId}
                onChange={(e) => {
                  handleChange(e);
                  handleOrderSelect(e.target.value);
                }}
                className="input"
              >
                <option value="">Select an order</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.orderNumber} - ${order.totalAmount?.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="delivererId" className="label">
                Deliverer (Optional)
              </label>
              <select
                id="delivererId"
                name="delivererId"
                value={formData.delivererId}
                onChange={handleChange}
                className="input"
              >
                <option value="">Not assigned</option>
                {deliverers.map((deliverer) => (
                  <option key={deliverer.id} value={deliverer.id}>
                    {deliverer.firstName} {deliverer.lastName} ({deliverer.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="label">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Pickup Address</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label htmlFor="pickupAddress" className="label">
                  Address *
                </label>
                <input
                  type="text"
                  id="pickupAddress"
                  name="pickupAddress"
                  required
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="pickupCity" className="label">
                  City *
                </label>
                <input
                  type="text"
                  id="pickupCity"
                  name="pickupCity"
                  required
                  value={formData.pickupCity}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="pickupPostalCode" className="label">
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="pickupPostalCode"
                  name="pickupPostalCode"
                  required
                  value={formData.pickupPostalCode}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label htmlFor="deliveryAddress" className="label">
                  Address *
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
              {saving ? 'Creating...' : 'Create Delivery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



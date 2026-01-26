import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { orderAPI, customerAPI } from '../../lib/api';
import ErrorAlert from '../../components/ErrorAlert';
import SuccessAlert from '../../components/SuccessAlert';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function NewOrder() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPostalCode: '',
    specialInstructions: '',
    deliveryFee: 0,
    items: [{ productName: '', productDescription: '', quantity: 1, unitPrice: 0, weight: 0, dimensions: '' }],
  });

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const data = await customerAPI.getAll();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productName: '', productDescription: '', quantity: 1, unitPrice: 0, weight: 0, dimensions: '' }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const orderData = {
        ...formData,
        customerId: parseInt(formData.customerId),
        deliveryFee: parseFloat(formData.deliveryFee),
        items: formData.items.map(item => ({
          ...item,
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          weight: parseFloat(item.weight),
        })),
      };
      await orderAPI.create(orderData);
      setSuccess('Order created successfully!');
      setTimeout(() => {
        router.push('/orders');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create order');
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
        <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
        <p className="mt-2 text-gray-600">Create a new customer order</p>
      </div>

      <div className="card max-w-4xl">
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message={success} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="customerId" className="label">
              Customer *
            </label>
            <select
              id="customerId"
              name="customerId"
              required
              value={formData.customerId}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName} ({customer.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="deliveryFee" className="label">
                Delivery Fee
              </label>
              <input
                type="number"
                step="0.01"
                id="deliveryFee"
                name="deliveryFee"
                value={formData.deliveryFee}
                onChange={handleChange}
                className="input"
              />
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
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="btn btn-secondary"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Item {index + 1}</h3>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="label">Product Name *</label>
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Description</label>
                      <input
                        type="text"
                        value={item.productDescription}
                        onChange={(e) => handleItemChange(index, 'productDescription', e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Quantity *</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Unit Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.weight}
                        onChange={(e) => handleItemChange(index, 'weight', e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Dimensions</label>
                      <input
                        type="text"
                        placeholder="LxWxH"
                        value={item.dimensions}
                        onChange={(e) => handleItemChange(index, 'dimensions', e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              {saving ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { deliveryAPI, delivererAPI } from '../../../lib/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorAlert from '../../../components/ErrorAlert';
import SuccessAlert from '../../../components/SuccessAlert';
import StatusBadge from '../../../components/StatusBadge';

export default function EditDelivery() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [deliverers, setDeliverers] = useState([]);
  const [formData, setFormData] = useState({
    delivererId: '',
    status: '',
    priority: 'NORMAL',
    specialInstructions: '',
  });

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const [deliveryData, deliverersData] = await Promise.all([
          deliveryAPI.getById(id),
          delivererAPI.getAvailable().catch(() => []),
        ]);
        setDelivery(deliveryData);
        setDeliverers(Array.isArray(deliverersData) ? deliverersData : []);
        setFormData({
          delivererId: deliveryData.delivererId?.toString() || '',
          status: deliveryData.status || '',
          priority: deliveryData.priority || 'NORMAL',
          specialInstructions: deliveryData.specialInstructions || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData = {
        ...formData,
        delivererId: formData.delivererId ? parseInt(formData.delivererId) : null,
      };
      await deliveryAPI.update(id, updateData);
      setSuccess('Delivery updated successfully!');
      setTimeout(() => {
        router.push(`/deliveries/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update delivery');
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

  if (!delivery) {
    return (
      <div>
        <ErrorAlert message="Delivery not found" />
        <button onClick={() => router.back()} className="btn btn-secondary mt-4">
          Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Delivery</h1>
        <p className="mt-2 text-gray-600">Delivery: {delivery.deliveryNumber}</p>
        <div className="mt-2">
          <StatusBadge status={delivery.status} type="delivery" />
        </div>
      </div>

      <div className="card max-w-2xl">
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message={success} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="status" className="label">
              Status *
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select status</option>
              <option value="PENDING_ASSIGNMENT">Pending Assignment</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="ARRIVED">Arrived</option>
              <option value="DELIVERED">Delivered</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="delivererId" className="label">
              Assign Deliverer
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
    </div>
  );
}



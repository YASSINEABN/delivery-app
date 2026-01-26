import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { delivererAPI } from '../../../lib/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorAlert from '../../../components/ErrorAlert';
import SuccessAlert from '../../../components/SuccessAlert';
import StatusBadge from '../../../components/StatusBadge';

export default function EditDeliverer() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deliverer, setDeliverer] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    status: 'INACTIVE',
  });

  useEffect(() => {
    if (!id) return;

    async function fetchDeliverer() {
      try {
        setLoading(true);
        const delivererData = await delivererAPI.getById(id);
        setDeliverer(delivererData);
        setFormData({
          firstName: delivererData.firstName || '',
          lastName: delivererData.lastName || '',
          email: delivererData.email || '',
          phone: delivererData.phone || '',
          address: delivererData.address || '',
          city: delivererData.city || '',
          postalCode: delivererData.postalCode || '',
          status: delivererData.status || 'INACTIVE',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDeliverer();
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
      await delivererAPI.update(id, formData);
      setSuccess('Deliverer updated successfully!');
      setTimeout(() => {
        router.push(`/deliverers/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update deliverer');
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

  if (!deliverer) {
    return (
      <div>
        <ErrorAlert message="Deliverer not found" />
        <button onClick={() => router.back()} className="btn btn-secondary mt-4">
          Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Deliverer</h1>
        <p className="mt-2 text-gray-600">
          {deliverer.firstName} {deliverer.lastName}
        </p>
        <div className="mt-2">
          <StatusBadge status={deliverer.status} type="deliverer" />
        </div>
      </div>

      <div className="card max-w-2xl">
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message={success} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="label">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="label">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="label">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="city" className="label">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="label">
                Postal Code *
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="status" className="label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="INACTIVE">Inactive</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_BREAK">On Break</option>
                <option value="OFF_DUTY">Off Duty</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
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
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



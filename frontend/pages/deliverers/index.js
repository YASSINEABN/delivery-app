import { useState, useEffect } from 'react';
import Link from 'next/link';
import { delivererAPI } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import StatusBadge from '../../components/StatusBadge';

export default function DeliverersList() {
  const [deliverers, setDeliverers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ status: '' });

  useEffect(() => {
    async function fetchDeliverers() {
      try {
        setLoading(true);
        const data = await delivererAPI.getAll();
        let filtered = Array.isArray(data) ? data : [];
        if (filter.status) {
          filtered = filtered.filter((d) => d.status === filter.status);
        }
        setDeliverers(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDeliverers();
  }, [filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deliverers</h1>
          <p className="mt-2 text-gray-600">Manage delivery personnel</p>
        </div>
        <Link href="/deliverers/new" className="btn btn-primary">
          + Register Deliverer
        </Link>
      </div>

      <div className="card mb-6">
        <div>
          <label htmlFor="statusFilter" className="label">
            Filter by Status
          </label>
          <select
            id="statusFilter"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="input"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_BREAK">On Break</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {deliverers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No deliverers found</p>
          <Link href="/deliverers/new" className="btn btn-primary">
            Register First Deliverer
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deliverers.map((deliverer) => (
            <div key={deliverer.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {deliverer.firstName} {deliverer.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{deliverer.employeeNumber}</p>
                </div>
                <StatusBadge status={deliverer.status} type="deliverer" />
              </div>

              <dl className="space-y-2 mb-4">
                <div>
                  <dt className="text-xs font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{deliverer.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm text-gray-900">{deliverer.phone}</dd>
                </div>
                {deliverer.rating && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Rating</dt>
                    <dd className="text-sm text-gray-900">
                      ⭐ {deliverer.rating.toFixed(1)} / 5.0
                    </dd>
                  </div>
                )}
                {deliverer.totalDeliveries !== undefined && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Total Deliveries</dt>
                    <dd className="text-sm text-gray-900">{deliverer.totalDeliveries}</dd>
                  </div>
                )}
              </dl>

              <div className="flex space-x-2">
                <Link
                  href={`/deliverers/${deliverer.id}`}
                  className="flex-1 btn btn-primary text-center text-sm"
                >
                  View
                </Link>
                <Link
                  href={`/deliverers/${deliverer.id}/edit`}
                  className="flex-1 btn btn-secondary text-center text-sm"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



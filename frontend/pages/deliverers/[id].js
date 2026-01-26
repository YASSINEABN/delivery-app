import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { delivererAPI, deliveryAPI } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import StatusBadge from '../../components/StatusBadge';

export default function DelivererDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [deliverer, setDeliverer] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [location, setLocation] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const [delivererData, performanceData, locationData, deliveriesData] = await Promise.all([
          delivererAPI.getById(id),
          delivererAPI.getPerformance(id).catch(() => null),
          delivererAPI.getLocation(id).catch(() => null),
          deliveryAPI.getAll().catch(() => []),
        ]);
        setDeliverer(delivererData);
        setPerformance(performanceData);
        setLocation(locationData);
        const allDeliveries = Array.isArray(deliveriesData) ? deliveriesData : [];
        setDeliveries(allDeliveries.filter((d) => d.delivererId === parseInt(id)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !deliverer) {
    return (
      <div>
        <ErrorAlert message={error || 'Deliverer not found'} />
        <Link href="/deliverers" className="btn btn-secondary mt-4">
          Back to Deliverers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {deliverer.firstName} {deliverer.lastName}
          </h1>
          <p className="mt-2 text-gray-600">Deliverer Profile</p>
        </div>
        <div className="space-x-2">
          <Link href={`/deliverers/${id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <Link href="/deliverers" className="btn btn-secondary">
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  <StatusBadge status={deliverer.status} type="deliverer" />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Employee Number</dt>
                <dd className="text-sm text-gray-900">{deliverer.employeeNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{deliverer.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="text-sm text-gray-900">{deliverer.phone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="text-sm text-gray-900 text-right">
                  {deliverer.address}
                  <br />
                  {deliverer.city}, {deliverer.postalCode}
                </dd>
              </div>
              {deliverer.hireDate && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(deliverer.hireDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {performance && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
              <dl className="space-y-3">
                {deliverer.rating !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Rating</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ⭐ {deliverer.rating.toFixed(1)} / 5.0
                    </dd>
                  </div>
                )}
                {deliverer.totalDeliveries !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Total Deliveries</dt>
                    <dd className="text-sm text-gray-900">{deliverer.totalDeliveries}</dd>
                  </div>
                )}
                {deliverer.successfulDeliveries !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Successful Deliveries</dt>
                    <dd className="text-sm text-gray-900">{deliverer.successfulDeliveries}</dd>
                  </div>
                )}
                {deliverer.failedDeliveries !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Failed Deliveries</dt>
                    <dd className="text-sm text-gray-900">{deliverer.failedDeliveries}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {deliveries.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Recent Deliveries</h2>
              <div className="space-y-3">
                {deliveries.slice(0, 5).map((delivery) => (
                  <Link
                    key={delivery.id}
                    href={`/deliveries/${delivery.id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{delivery.deliveryNumber}</p>
                        <p className="text-sm text-gray-500">{delivery.orderNumber}</p>
                      </div>
                      <StatusBadge status={delivery.status} type="delivery" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {location && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Current Location</h2>
              <p className="text-sm text-gray-900">
                Latitude: {location.latitude}
                <br />
                Longitude: {location.longitude}
              </p>
              {location.timestamp && (
                <p className="text-xs text-gray-500 mt-2">
                  Updated: {new Date(location.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Deliveries</span>
                <span className="text-sm font-medium">{deliverer.totalDeliveries || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium">
                  {deliverer.totalDeliveries
                    ? (
                        ((deliverer.successfulDeliveries || 0) / deliverer.totalDeliveries) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              {deliverer.vehicleType && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vehicle Type</span>
                  <span className="text-sm font-medium">{deliverer.vehicleType}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



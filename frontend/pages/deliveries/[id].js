import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { deliveryAPI } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import StatusBadge from '../../components/StatusBadge';

export default function DeliveryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [delivery, setDelivery] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const [deliveryData, trackingData] = await Promise.all([
          deliveryAPI.getById(id),
          deliveryAPI.track(id).catch(() => []),
        ]);
        setDelivery(deliveryData);
        setTracking(Array.isArray(trackingData) ? trackingData : []);
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

  if (error || !delivery) {
    return (
      <div>
        <ErrorAlert message={error || 'Delivery not found'} />
        <Link href="/deliveries" className="btn btn-secondary mt-4">
          Back to Deliveries
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{delivery.deliveryNumber}</h1>
          <p className="mt-2 text-gray-600">Delivery Details</p>
        </div>
        <div className="space-x-2">
          <Link href={`/deliveries/${id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <Link href="/deliveries" className="btn btn-secondary">
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  <StatusBadge status={delivery.status} type="delivery" />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Priority</dt>
                <dd className="text-sm text-gray-900">{delivery.priority || 'NORMAL'}</dd>
              </div>
              {delivery.delivererId && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Deliverer ID</dt>
                  <dd className="text-sm text-gray-900">
                    <Link
                      href={`/deliverers/${delivery.delivererId}`}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      {delivery.delivererId}
                    </Link>
                  </dd>
                </div>
              )}
              {delivery.estimatedDistance && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Estimated Distance</dt>
                  <dd className="text-sm text-gray-900">{delivery.estimatedDistance} km</dd>
                </div>
              )}
              {delivery.estimatedDuration && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Estimated Duration</dt>
                  <dd className="text-sm text-gray-900">{delivery.estimatedDuration} minutes</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Pickup Address</h2>
            <p className="text-gray-900">
              {delivery.pickupAddress}
              <br />
              {delivery.pickupCity}, {delivery.pickupPostalCode}
            </p>
            {delivery.scheduledPickupTime && (
              <p className="text-sm text-gray-500 mt-2">
                Scheduled: {new Date(delivery.scheduledPickupTime).toLocaleString()}
              </p>
            )}
            {delivery.actualPickupTime && (
              <p className="text-sm text-green-600 mt-1">
                Picked up: {new Date(delivery.actualPickupTime).toLocaleString()}
              </p>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <p className="text-gray-900">
              {delivery.deliveryAddress}
              <br />
              {delivery.deliveryCity}, {delivery.deliveryPostalCode}
            </p>
            {delivery.estimatedDeliveryTime && (
              <p className="text-sm text-gray-500 mt-2">
                Estimated: {new Date(delivery.estimatedDeliveryTime).toLocaleString()}
              </p>
            )}
            {delivery.actualDeliveryTime && (
              <p className="text-sm text-green-600 mt-1">
                Delivered: {new Date(delivery.actualDeliveryTime).toLocaleString()}
              </p>
            )}
            {delivery.specialInstructions && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Special Instructions</p>
                <p className="text-gray-900">{delivery.specialInstructions}</p>
              </div>
            )}
          </div>

          {tracking.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Tracking History</h2>
              <div className="space-y-3">
                {tracking.map((point, index) => (
                  <div key={index} className="border-l-2 border-primary-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {point.latitude}, {point.longitude}
                        </p>
                        {point.timestamp && (
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(point.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div>
              <p className="font-medium text-gray-900">Order Number</p>
              <Link
                href={`/orders/${delivery.orderId}`}
                className="text-primary-600 hover:text-primary-800 text-sm"
              >
                {delivery.orderNumber} →
              </Link>
            </div>
          </div>

          {delivery.delivererId && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Deliverer</h2>
              <Link
                href={`/deliverers/${delivery.delivererId}`}
                className="text-primary-600 hover:text-primary-800"
              >
                View Deliverer →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



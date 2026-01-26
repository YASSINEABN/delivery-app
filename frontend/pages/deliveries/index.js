import { useState, useEffect } from 'react';
import Link from 'next/link';
import { deliveryAPI } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import StatusBadge from '../../components/StatusBadge';

export default function DeliveriesList() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDeliveries() {
      try {
        setLoading(true);
        const data = await deliveryAPI.getAll();
        setDeliveries(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDeliveries();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this delivery?')) {
      return;
    }

    try {
      // Note: Delete endpoint might not be available, handle gracefully
      alert('Delete functionality may not be available');
    } catch (err) {
      alert('Error deleting delivery: ' + err.message);
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deliveries</h1>
          <p className="mt-2 text-gray-600">Manage and track deliveries</p>
        </div>
        <Link href="/deliveries/new" className="btn btn-primary">
          + New Delivery
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}

      {deliveries.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No deliveries found</p>
          <Link href="/deliveries/new" className="btn btn-primary">
            Create First Delivery
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deliverer
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {delivery.deliveryNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/orders/${delivery.orderId}`}
                        className="text-sm text-primary-600 hover:text-primary-900"
                      >
                        {delivery.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={delivery.status} type="delivery" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {delivery.deliveryAddress}
                        <br />
                        <span className="text-gray-500">
                          {delivery.deliveryCity} {delivery.deliveryPostalCode}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {delivery.delivererId ? `ID: ${delivery.delivererId}` : 'Not assigned'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/deliveries/${delivery.id}`}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        href={`/deliveries/${delivery.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}



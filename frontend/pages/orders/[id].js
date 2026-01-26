import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { orderAPI } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import StatusBadge from '../../components/StatusBadge';

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const [orderData, historyData] = await Promise.all([
          orderAPI.getById(id),
          orderAPI.getStatusHistory(id).catch(() => []),
        ]);
        setOrder(orderData);
        setHistory(Array.isArray(historyData) ? historyData : []);
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

  if (error || !order) {
    return (
      <div>
        <ErrorAlert message={error || 'Order not found'} />
        <Link href="/orders" className="btn btn-secondary mt-4">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="mt-2 text-gray-600">Order Details</p>
        </div>
        <div className="space-x-2">
          <Link href={`/orders/${id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <Link href="/orders" className="btn btn-secondary">
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  <StatusBadge status={order.status} type="order" />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ${order.totalAmount?.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Delivery Fee</dt>
                <dd className="text-sm text-gray-900">${order.deliveryFee?.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(order.createdAt).toLocaleString()}
                </dd>
              </div>
              {order.updatedAt && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(order.updatedAt).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <p className="text-gray-900">
              {order.deliveryAddress}
              <br />
              {order.deliveryCity}, {order.deliveryPostalCode}
            </p>
            {order.specialInstructions && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Special Instructions</p>
                <p className="text-gray-900">{order.specialInstructions}</p>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
                      {item.productDescription && (
                        <p className="text-sm text-gray-500 mt-1">{item.productDescription}</p>
                      )}
                      <div className="mt-2 text-sm text-gray-600">
                        <span>Quantity: {item.quantity}</span>
                        {item.weight && <span className="ml-4">Weight: {item.weight} kg</span>}
                        {item.dimensions && (
                          <span className="ml-4">Dimensions: {item.dimensions}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${item.unitPrice?.toFixed(2)} × {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total: ${item.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Customer</h2>
            {order.customer ? (
              <div>
                <p className="font-medium text-gray-900">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-sm text-gray-500 mt-1">{order.customer.email}</p>
                <p className="text-sm text-gray-500">{order.customer.phone}</p>
                <Link
                  href={`/customers/${order.customer.id}`}
                  className="text-primary-600 hover:text-primary-800 text-sm mt-2 inline-block"
                >
                  View Customer →
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">Customer ID: {order.customerId}</p>
            )}
          </div>

          {history.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Status History</h2>
              <div className="space-y-3">
                {history.map((entry) => (
                  <div key={entry.id} className="border-l-2 border-primary-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <StatusBadge status={entry.status} type="order" />
                        {entry.notes && (
                          <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {entry.changedBy}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



import { useState, useEffect } from 'react';
import Link from 'next/link';
import { customerAPI, orderAPI, deliveryAPI, delivererAPI } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    deliveries: 0,
    deliverers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [customers, orders, deliveries, deliverers] = await Promise.all([
          customerAPI.getAll().catch(() => []),
          orderAPI.getAll().catch(() => []),
          deliveryAPI.getAll().catch(() => []),
          delivererAPI.getAll().catch(() => []),
        ]);

        setStats({
          customers: Array.isArray(customers) ? customers.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          deliveries: Array.isArray(deliveries) ? deliveries.length : 0,
          deliverers: Array.isArray(deliverers) ? deliverers.length : 0,
        });

        const ordersArray = Array.isArray(orders) ? orders : [];
        setRecentOrders(ordersArray.slice(0, 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.customers,
      change: '+12.5%',
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      href: '/customers',
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      change: '+8.2%',
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      href: '/orders',
    },
    {
      title: 'Active Deliveries',
      value: stats.deliveries,
      change: '+23.1%',
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      href: '/deliveries',
    },
    {
      title: 'Active Deliverers',
      value: stats.deliverers,
      change: '+4.3%',
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      href: '/deliverers',
    },
  ];

  // Mock data for charts
  const weeklyData = [
    { name: 'Mon', orders: 24, deliveries: 20 },
    { name: 'Tue', orders: 32, deliveries: 28 },
    { name: 'Wed', orders: 28, deliveries: 26 },
    { name: 'Thu', orders: 38, deliveries: 35 },
    { name: 'Fri', orders: 42, deliveries: 40 },
    { name: 'Sat', orders: 35, deliveries: 32 },
    { name: 'Sun', orders: 30, deliveries: 28 },
  ];

  const statusData = [
    { name: 'Pending', value: 25, color: '#EAB308' },
    { name: 'Processing', value: 30, color: '#A855F7' },
    { name: 'In Transit', value: 35, color: '#3B82F6' },
    { name: 'Delivered', value: 85, color: '#22C55E' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-red-600 dark:text-red-400">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening with your delivery platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={card.href}
            href={card.href}
            style={{ animationDelay: `${index * 50}ms` }}
            className="stat-card group animate-slide-up"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110`}>
                  <div className="text-white">{card.icon}</div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  card.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.trend === 'up' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                  </svg>
                  <span>{card.change}</span>
                </div>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{card.title}</p>
              <p className="text-3xl font-bold font-display text-neutral-900 dark:text-white">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold font-display text-neutral-900 dark:text-white mb-6">
            Weekly Activity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" className="dark:stroke-neutral-800" />
              <XAxis dataKey="name" stroke="#737373" className="dark:stroke-neutral-400" />
              <YAxis stroke="#737373" className="dark:stroke-neutral-400" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E5E5',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="deliveries" 
                stroke="#22C55E" 
                strokeWidth={3}
                dot={{ fill: '#22C55E', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold font-display text-neutral-900 dark:text-white mb-6">
            Order Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-neutral-600 dark:text-neutral-400">{item.name}</span>
                </div>
                <span className="font-medium text-neutral-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-display text-neutral-900 dark:text-white">
              Recent Orders
            </h2>
            <Link href="/orders" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              No orders yet
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 dark:text-white truncate">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          ${order.totalAmount?.toFixed(2)}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={order.status} type="order" showDot={false} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold font-display text-neutral-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/orders/new"
              className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-primary-600 dark:bg-primary-500 text-white group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-primary-900 dark:text-primary-100">New Order</p>
                <p className="text-xs text-primary-600 dark:text-primary-400">Create a new order</p>
              </div>
            </Link>

            <Link
              href="/customers/new"
              className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-neutral-600 dark:bg-neutral-600 text-white group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">Add Customer</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Register new customer</p>
              </div>
            </Link>

            <Link
              href="/deliveries/new"
              className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-neutral-600 dark:bg-neutral-600 text-white group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">New Delivery</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Schedule delivery</p>
              </div>
            </Link>

            <Link
              href="/deliverers/new"
              className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-neutral-600 dark:bg-neutral-600 text-white group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">Add Deliverer</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Register deliverer</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

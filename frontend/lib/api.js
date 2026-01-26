const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Customer API
export const customerAPI = {
  getAll: () => apiCall('/api/customers'),
  getById: (id) => apiCall(`/api/customers/${id}`),
  getByEmail: (email) => apiCall(`/api/customers/email/${encodeURIComponent(email)}`),
  create: (data) => apiCall('/api/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/api/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/api/customers/${id}`, {
    method: 'DELETE',
  }),
};

// Order API
export const orderAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/api/orders${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiCall(`/api/orders/${id}`),
  getByOrderNumber: (orderNumber) => apiCall(`/api/orders/number/${encodeURIComponent(orderNumber)}`),
  create: (data) => apiCall('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/api/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  updateStatus: (id, data) => apiCall(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  getStatusHistory: (id) => apiCall(`/api/orders/${id}/history`),
  delete: (id) => apiCall(`/api/orders/${id}`, {
    method: 'DELETE',
  }),
};

// Delivery API
export const deliveryAPI = {
  getAll: () => apiCall('/api/deliveries'),
  getById: (id) => apiCall(`/api/deliveries/${id}`),
  create: (data) => apiCall('/api/deliveries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/api/deliveries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  track: (id) => apiCall(`/api/deliveries/${id}/track`),
  addTrackingPoint: (id, data) => apiCall(`/api/deliveries/${id}/track`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Deliverer API
export const delivererAPI = {
  getAll: () => apiCall('/api/deliverers'),
  getById: (id) => apiCall(`/api/deliverers/${id}`),
  getAvailable: () => apiCall('/api/deliverers/available'),
  getLocation: (id) => apiCall(`/api/deliverers/${id}/location`),
  getPerformance: (id) => apiCall(`/api/deliverers/${id}/performance`),
  create: (data) => apiCall('/api/deliverers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/api/deliverers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};



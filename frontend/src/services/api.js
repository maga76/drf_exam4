const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';


const saveTokens = (data) => {
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
};


const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};


const refreshAccessToken = async () => {
  const refresh = localStorage.getItem('refresh_token');

  if (!refresh) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh })
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = await response.json();
  localStorage.setItem('access_token', data.access);
  return data.access;
};


const request = async (path, options = {}) => {
  let access = localStorage.getItem('access_token');

  const sendRequest = (token) => fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  let response = await sendRequest(access);

  if (response.status === 401 && access) {
    access = await refreshAccessToken();
    if (access) {
      response = await sendRequest(access);
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const firstFieldError = Object.entries(errorData).find(([, value]) => Array.isArray(value));
    const message = firstFieldError
      ? `${firstFieldError[0]}: ${firstFieldError[1][0]}`
      : errorData.detail || errorData.error || 'Server request failed';
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};


export const api = {
  async login(username, password) {
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Неверный логин или пароль');
    }

    const data = await response.json();
    saveTokens(data);
    return data;
  },

  async logout() {
    const refresh = localStorage.getItem('refresh_token');

    if (refresh) {
      await request('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh })
      }).catch(() => null);
    }

    clearTokens();
  },

  get(path) {
    return request(path);
  },

  post(path, data) {
    return request(path, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  put(path, data) {
    return request(path, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  patch(path, data) {
    return request(path, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  delete(path) {
    return request(path, {
      method: 'DELETE'
    });
  },

  hasToken() {
    return Boolean(localStorage.getItem('access_token'));
  }
};

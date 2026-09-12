import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Automatically attach Sanctum token + handle FormData Content-Type
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // When sending FormData, remove the default Content-Type so the browser can
    // set the correct multipart/form-data boundary automatically.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      if (typeof window !== 'undefined') {
        const isLoginRequest = error.config?.url?.includes('/auth/login');
        const isSignInPage = window.location.pathname === '/sign-in';
        if (!isLoginRequest && !isSignInPage) {
          window.location.href = '/sign-in';
        }
      }
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

export default axiosInstance;

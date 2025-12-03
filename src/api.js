import axios from "axios";

// Get API URL from environment variables with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE_URL}/api`;

// Get timeout from environment variables with fallback (30 seconds)
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000;

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // Always send cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for CSRF token handling
// Note: This automatically reads the CSRF token from the cookie set by Django.
// Alternatively, you can call api.getCsrfToken() explicitly to fetch the token
// from the /csrf-token/ endpoint as documented in API_DOCUMENTATION.md
axiosInstance.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookie if it exists
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - please check your connection');
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - please check your connection');
    }

    return Promise.reject(error);
  }
);

const api = {
  // CSRF Token
  getCsrfToken: () => axiosInstance.get('/csrf-token/'),

  // Autenticação
  signup: (data) => axiosInstance.post('/signup/', data),
  login: (data) => axiosInstance.post('/login/', data),
  logout: () => axiosInstance.post('/logout/'),
  getUser: () => axiosInstance.get('/user/'),

  // Reservas
  getReservas: () => axiosInstance.get('/reservas/'),
  createReserva: (data) => axiosInstance.post('/reservas/', data),
  checkDisponibilidade: (params) => axiosInstance.get('/check-disponibilidade/', { params }),

  // Sócios
  getSocios: () => axiosInstance.get('/socios/'),
  createSocio: (data) => axiosInstance.post('/socios/', data),

  // Loja
  getArtigos: () => axiosInstance.get('/artigos/'),
  createAvaliacao: (data) => axiosInstance.post('/avaliacao/', data),

  // Torneios
  getTorneios: () => axiosInstance.get('/torneios/'),
  getInscricoes: (torneioId) => axiosInstance.get('/inscricoes-torneio/', {
    params: torneioId ? { torneio_id: torneioId } : {}
  }),
  createInscricao: (data) => axiosInstance.post('/inscricoes-torneio/', data),

  // Treinos
  getTreinadores: () => axiosInstance.get('/treinadores/'),
  getPedidosTreino: () => axiosInstance.get('/pedidos-treino/'),
  createPedidoTreino: (data) => axiosInstance.post('/pedidos-treino/', data),
  getPacotesTreino: () => axiosInstance.get('/pacotes-treino/'),
};

// Export api methods, base URL for media files, and full API URL
export { api, API_BASE_URL, API_URL };
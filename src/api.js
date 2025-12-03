import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Configurar axios para sempre enviar cookies
axios.defaults.withCredentials = true;

const api = {
  // Autenticação
  signup: (data) => axios.post(`${API_URL}/signup/`, data),
  login: (data) => axios.post(`${API_URL}/login/`, data),
  logout: () => axios.get(`${API_URL}/logout/`),
  getUser: () => axios.get(`${API_URL}/user/`),

  // Reservas
  getReservas: () => axios.get(`${API_URL}/reservas/`),
  createReserva: (data) => axios.post(`${API_URL}/reservas/`, data),
  checkDisponibilidade: (params) => axios.get(`${API_URL}/check-disponibilidade/`, { params }),

  // Sócios
  getSocios: () => axios.get(`${API_URL}/socios/`),
  createSocio: (data) => axios.post(`${API_URL}/socios/`, data),

  // Loja
  getArtigos: () => axios.get(`${API_URL}/artigos/`),
  createAvaliacao: (data) => axios.post(`${API_URL}/avaliacao/`, data),

  // Torneios
  getTorneios: () => axios.get(`${API_URL}/torneios/`),
  getInscricoes: (torneioId) => axios.get(`${API_URL}/inscricoes-torneio/`, {
    params: torneioId ? { torneio_id: torneioId } : {}
  }),
  createInscricao: (data) => axios.post(`${API_URL}/inscricoes-torneio/`, data),

  // Treinos
  getTreinadores: () => axios.get(`${API_URL}/treinadores/`),
  getPedidosTreino: () => axios.get(`${API_URL}/pedidos-treino/`),
  createPedidoTreino: (data) => axios.post(`${API_URL}/pedidos-treino/`, data),
  getPacotesTreino: () => axios.get(`${API_URL}/pacotes-treino/`),

  // Upload
  uploadProfilePicture: (formData) => axios.post(`${API_URL}/upload-profile-picture/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export { api, API_URL };
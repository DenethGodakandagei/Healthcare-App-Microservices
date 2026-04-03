import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  me: () => API.get('/auth/me'),
};

// Patient endpoints
export const patientAPI = {
  getProfile: () => API.get('/patients/profile'),
  updateProfile: (data) => API.put('/patients/profile', data),
  getAppointments: () => API.get('/appointments/patient'),
};

// Doctor endpoints
export const doctorAPI = {
  getAll: () => API.get('/doctors'),
  getById: (id) => API.get(`/doctors/${id}`),
  getProfile: () => API.get('/doctors/profile'),
  createProfile: (data) => API.post('/doctors/profile', data),
  updateProfile: (data) => API.put('/doctors/profile', data),
  getAppointments: () => API.get('/appointments/doctor'),
};

// Appointments
export const appointmentAPI = {
  getAll: () => API.get('/appointments'),
  book: (data) => API.post('/appointments', data),
  updateStatus: (id, data) => API.put(`/appointments/${id}/status`, data),
  cancel: (id) => appointmentAPI.updateStatus(id, { status: 'cancelled' }),
};

// Sessions (doctor availability blocks)
export const sessionAPI = {
  getAll: (params) => API.get('/appointments/sessions', { params }),
  getById: (id) => API.get(`/appointments/sessions/${id}`),
  create: (data) => API.post('/appointments/sessions', data),
  update: (id, data) => API.put(`/appointments/sessions/${id}`, data),
  delete: (id) => API.delete(`/appointments/sessions/${id}`),
};

export default API;

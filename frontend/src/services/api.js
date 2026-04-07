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
  getById: (id) => API.get(`/appointments/${id}`),
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

// Telemedicine (video consultation)
export const telemedicineAPI = {
  // Create a video session for an appointment
  createSession: (data) => API.post('/telemedicine', data),
  // Generate Agora token
  generateToken: (data) => API.post('/telemedicine/token', data),
  // Get session by appointment ID
  getSessionByAppointment: (appointmentId) => API.get(`/telemedicine/appointment/${appointmentId}`),
  // Update session status
  updateSessionStatus: (id, data) => API.put(`/telemedicine/${id}/status`, data),
  // Get doctor's telemedicine sessions
  getDoctorSessions: () => API.get('/telemedicine/doctor'),
  // Get patient's telemedicine sessions
  getPatientSessions: () => API.get('/telemedicine/patient'),
  // Chat messages
  sendMessage: (sessionId, data) => API.post(`/telemedicine/${sessionId}/chat`, data),
  getMessages: (sessionId) => API.get(`/telemedicine/${sessionId}/chat`),
};
// Notifications
export const notificationAPI = {
  getNotifications: (userId) => API.get(`/notifications/${userId}`),
};


// Payments
export const paymentAPI = {
  createIntent: (data) => API.post('/payments/intent', data),
  confirm: (data) => API.post('/payments/confirm', data),
  getPatientPayments: () => API.get('/payments/patient'),
};

export default API;

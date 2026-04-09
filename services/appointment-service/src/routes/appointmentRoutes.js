import express from 'express';
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAppointmentById,
  getAllAppointments,
  updateAppointmentStatus,
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  updateAppointmentPayment,
  deleteAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

// Session CRUD
router.route('/sessions')
  .post(createSession)
  .get(getSessions);

router.route('/sessions/:id')
  .get(getSessionById)
  .put(updateSession)
  .delete(deleteSession);

// Appointment Routes
router.route('/')
  .get(getAllAppointments)
  .post(bookAppointment);

router.route('/patient')
  .get(getPatientAppointments);

router.route('/doctor')
  .get(getDoctorAppointments);

router.route('/:id')
  .get(getAppointmentById)
  .delete(deleteAppointment);

router.route('/:id/status')
  .put(updateAppointmentStatus);

router.route('/:id/payment')
  .put(updateAppointmentPayment);

export default router;

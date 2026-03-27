import express from 'express';
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession
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
  .post(bookAppointment);

router.route('/patient')
  .get(getPatientAppointments);

router.route('/doctor')
  .get(getDoctorAppointments);

router.route('/:id/status')
  .put(updateAppointmentStatus);

export default router;

import express from 'express';
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';

const router = express.Router();

router.route('/')
  .post(bookAppointment);

router.route('/patient')
  .get(getPatientAppointments);

router.route('/doctor')
  .get(getDoctorAppointments);

router.route('/:id/status')
  .put(updateAppointmentStatus);

export default router;

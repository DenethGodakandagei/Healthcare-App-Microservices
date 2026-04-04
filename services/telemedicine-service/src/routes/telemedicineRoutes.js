import express from 'express';
import {
  generateToken,
  getSessionByAppointment,
  updateSessionStatus,
  createSession,
  getDoctorSessions,
  getPatientSessions,
  addChatMessage,
  getChatMessages
} from '../controllers/telemedicineController.js';

const router = express.Router();

router.route('/')
  .post(createSession);

router.route('/token')
  .post(generateToken);

router.route('/doctor')
  .get(getDoctorSessions);

router.route('/patient')
  .get(getPatientSessions);

router.route('/appointment/:appointmentId')
  .get(getSessionByAppointment);

router.route('/:id/status')
  .put(updateSessionStatus);

router.route('/:id/chat')
  .post(addChatMessage)
  .get(getChatMessages);

export default router;

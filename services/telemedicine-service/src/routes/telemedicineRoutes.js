import express from 'express';
import {
  generateToken,
  getSessionByAppointment,
  updateSessionStatus,
  createSession
} from '../controllers/telemedicineController.js';

const router = express.Router();

router.route('/')
  .post(createSession);

router.route('/token')
  .post(generateToken);

router.route('/appointment/:appointmentId')
  .get(getSessionByAppointment);

router.route('/:id/status')
  .put(updateSessionStatus);

export default router;

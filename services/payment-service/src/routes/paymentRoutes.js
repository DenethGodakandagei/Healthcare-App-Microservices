import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getPatientPayments,
  getAllPayments
} from '../controllers/paymentController.js';

const router = express.Router();

router.route('/intent')
  .post(createPaymentIntent);

router.route('/confirm')
  .post(confirmPayment);

router.route('/patient')
  .get(getPatientPayments);

router.route('/')
  .get(getAllPayments);

export default router;

import express from 'express';
import {
  createDoctorProfile,
  getAllDoctors,
  getDoctorProfile,
  updateDoctorProfile
} from '../controllers/doctorController.js';

const router = express.Router();

router.route('/')
  .get(getAllDoctors);

router.route('/profile')
  .post(createDoctorProfile)
  .get(getDoctorProfile)
  .put(updateDoctorProfile);

export default router;

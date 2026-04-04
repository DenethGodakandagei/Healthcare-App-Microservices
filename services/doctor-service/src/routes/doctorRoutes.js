import express from 'express';
import {
  createDoctorProfile,
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile
} from '../controllers/doctorController.js';

const router = express.Router();

router.route('/profile')
  .post(createDoctorProfile)
  .get(getDoctorProfile)
  .put(updateDoctorProfile);

router.route('/')
  .get(getAllDoctors);

router.route('/:id')
  .get(getDoctorById);

export default router;

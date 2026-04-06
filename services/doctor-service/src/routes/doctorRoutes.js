import express from 'express';
import {
  createDoctorProfile,
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  updateDoctor,
  deleteDoctor,
  createDoctor
} from '../controllers/doctorController.js';

const router = express.Router();

router.route('/profile')
  .post(createDoctorProfile)
  .get(getDoctorProfile)
  .put(updateDoctorProfile);

router.route('/')
  .get(getAllDoctors)
  .post(createDoctor); // Admin create

router.route('/:id')
  .get(getDoctorById)
  .put(updateDoctor)
  .delete(deleteDoctor);

export default router;

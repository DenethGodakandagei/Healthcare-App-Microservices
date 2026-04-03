import express from 'express';
import {
  getPatientProfile,
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from '../controllers/patientController.js';

const router = express.Router();

router.get('/profile', getPatientProfile);
router.post('/', createPatient);
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;

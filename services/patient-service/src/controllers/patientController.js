import Patient from '../models/Patient.js';

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private (via Gateway)
export const createPatient = async (req, res) => {
  try {
    const { name, age, gender, medicalHistory } = req.body;
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User identity not found' });
    }

    const patient = await Patient.create({
      userId,
      name,
      age,
      gender,
      medicalHistory,
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all patients for the logged-in user
// @route   GET /api/patients
// @access  Private
export const getPatients = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const patients = await Patient.find({ userId });
    res.json({
      success: true,
      message: 'Patients retrieved successfully',
      data: patients
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single patient by ID
// @route   GET /api/patients/:id
// @access  Private
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Security check: ensure the patient belongs to the user
    if (patient.userId !== req.headers['x-user-id']) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this patient' });
    }

    res.json({
      success: true,
      message: 'Patient retrieved successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    if (patient.userId !== req.headers['x-user-id']) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this patient' });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    if (patient.userId !== req.headers['x-user-id']) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this patient' });
    }

    await patient.deleteOne();
    res.json({ success: true, message: 'Patient removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import Patient from '../models/Patient.js';

// @desc    Get current patient profile (by x-user-id)
// @route   GET /api/patients/profile
// @access  Private
export const getPatientProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(200).json({ success: true, data: null, message: 'Patient profile not found' });
    }

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private (via Gateway)
export const createPatient = async (req, res) => {
  try {
    const { name, age, gender, medicalHistory, userId: bodyUserId } = req.body;
    const currentUserId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    // Determine which userId to use
    let finalUserId;
    if (userRole === 'admin' && bodyUserId) {
      // Admin can specify a userId for the patient
      finalUserId = bodyUserId;
    } else if (currentUserId) {
      // Regular user uses their own ID
      finalUserId = currentUserId;
    } else {
      return res.status(401).json({ success: false, message: 'User identity not found' });
    }

    const patient = await Patient.create({
      userId: finalUserId,
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

// @desc    Get all patients (admin sees all, regular users see only their own)
// @route   GET /api/patients
// @access  Private
export const getPatients = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    let patients;
    if (userRole === 'admin') {
      // Admin can see all patients
      patients = await Patient.find({});
    } else {
      // Regular users see only their own patients
      patients = await Patient.find({ userId });
    }

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

    const userRole = req.headers['x-user-role'];
    // Admin can view any patient, otherwise ensure the patient belongs to the user
    if (userRole !== 'admin' && patient.userId !== req.headers['x-user-id']) {
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

    const userRole = req.headers['x-user-role'];
    // Admin can update any patient, otherwise ensure the patient belongs to the user
    if (userRole !== 'admin' && patient.userId !== req.headers['x-user-id']) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this patient' });
    }

    // Explicitly exclude userId from updates - it's immutable
    const { userId, ...allowedUpdates } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
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

    const userRole = req.headers['x-user-role'];
    // Admin can delete any patient, otherwise ensure the patient belongs to the user
    if (userRole !== 'admin' && patient.userId !== req.headers['x-user-id']) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this patient' });
    }

    await patient.deleteOne();
    res.json({ success: true, message: 'Patient removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

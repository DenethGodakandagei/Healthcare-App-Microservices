import Doctor from '../models/Doctor.js';

// @desc    Create doctor profile
// @route   POST /api/doctors/profile
// @access  Private (Doctor)
export const createDoctorProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id']; // Provided by API Gateway

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized, x-user-id missing' });
    }

    const { firstName, lastName, specialty, experienceYears, contactNumber, consultationFee, availability } = req.body;

    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Doctor profile already exists for this user' });
    }

    const doctorProfile = await Doctor.create({
      userId,
      firstName,
      lastName,
      specialty,
      experienceYears,
      contactNumber,
      consultationFee,
      availability
    });

    res.status(201).json({ success: true, data: doctorProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current doctor profile
// @route   GET /api/doctors/profile
// @access  Private (Doctor)
export const getDoctorProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized, x-user-id missing' });
    }

    const doctorProfile = await Doctor.findOne({ userId });

    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    res.status(200).json({ success: true, data: doctorProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor)
export const updateDoctorProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized, x-user-id missing' });
    }

    let doctorProfile = await Doctor.findOne({ userId });

    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Update fields
    const fieldsToUpdate = ['firstName', 'lastName', 'specialty', 'experienceYears', 'contactNumber', 'consultationFee', 'availability'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        doctorProfile[field] = req.body[field];
      }
    });

    await doctorProfile.save();

    res.status(200).json({ success: true, data: doctorProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, data: doctor });
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

    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(200).json({ success: true, data: null, message: 'Doctor profile not found' });
    }

    res.status(200).json({ success: true, data: doctor });
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

// @desc    Update doctor by ID (Admin only)
// @route   PUT /api/doctors/:id
// @access  Private (Admin)
export const updateDoctor = async (req, res) => {
  try {
    const { firstName, lastName, specialty, experienceYears, contactNumber, consultationFee, availability, userId } = req.body;
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Update fields - explicitly exclude userId which is immutable
    if (firstName !== undefined) doctor.firstName = firstName;
    if (lastName !== undefined) doctor.lastName = lastName;
    if (specialty !== undefined) doctor.specialty = specialty;
    if (experienceYears !== undefined) doctor.experienceYears = experienceYears;
    if (contactNumber !== undefined) doctor.contactNumber = contactNumber;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (availability !== undefined) doctor.availability = availability;
    // Ignore userId if provided - it cannot be changed

    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete doctor by ID (Admin only)
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    await doctor.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Doctor removed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create doctor by admin (Admin only)
// @route   POST /api/doctors
// @access  Private (Admin)
export const createDoctor = async (req, res) => {
  try {
    const { firstName, lastName, specialty, experienceYears, contactNumber, consultationFee, availability, userId } = req.body;

    if (!firstName || !lastName || !specialty || !experienceYears || !contactNumber || !consultationFee || !userId) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if doctor profile already exists for this userId
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Doctor profile already exists for this user' });
    }

    const doctor = await Doctor.create({
      userId,
      firstName,
      lastName,
      specialty,
      experienceYears: Number(experienceYears),
      contactNumber,
      consultationFee: Number(consultationFee),
      availability: Array.isArray(availability) ? availability : []
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

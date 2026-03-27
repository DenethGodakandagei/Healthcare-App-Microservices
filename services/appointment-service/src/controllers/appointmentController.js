import Appointment from '../models/Appointment.js';

// Helper to generate a random 6-character appointment suffix
const generateAppointmentNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'APT-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient/Admin)
export const bookAppointment = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'];

    if (!patientId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Patient ID not found in headers.' });
    }

    const { doctorId, date, startTime, endTime, reasonForVisit } = req.body;

    // Check for conflicting appointments for the doctor
    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      date,
      startTime,
      status: 'scheduled'
    });

    if (conflictingAppointment) {
      return res.status(400).json({ success: false, message: 'Doctor is already booked at this time' });
    }

    const appointmentNumber = generateAppointmentNumber();

    const appointment = await Appointment.create({
      appointmentNumber,
      patientId,
      doctorId,
      date,
      startTime,
      endTime,
      reasonForVisit
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get appointments for logged-in patient
// @route   GET /api/appointments/patient
// @access  Private (Patient)
export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'];

    if (!patientId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const appointments = await Appointment.find({ patientId }).sort({ date: 1 });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get appointments for logged-in doctor
// @route   GET /api/appointments/doctor
// @access  Private (Doctor)
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.headers['x-user-id'];

    if (!doctorId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const appointments = await Appointment.find({ doctorId }).sort({ date: 1 });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { status, notes } = req.body;
    const appointmentId = req.params.id;

    let appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Basic authorization check (is the user the assigned patient or doctor?)
    if (appointment.patientId !== userId && appointment.doctorId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have access to this appointment' });
    }

    // Update fields
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;

    await appointment.save();

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

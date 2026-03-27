import Appointment from '../models/Appointment.js';
import AppointmentSession from '../models/Session.js';

// Helper to generate a random 6-character appointment suffix
const generateAppointmentNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'APT-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// --- Session Controllers ---

// @desc    Create a new session
// @route   POST /api/appointments/sessions
// @access  Private (Doctor/Admin)
export const createSession = async (req, res) => {
  try {
    const rawDoctorId = req.headers['x-user-id']; 
    if (!rawDoctorId) return res.status(401).json({ success: false, message: 'Unauthorized, x-user-id missing' });

    const { date, startTime, endTime, maxAppointments } = req.body;

    const session = await AppointmentSession.create({
      doctorId: req.body.doctorId || String(rawDoctorId),
      date: new Date(date),
      startTime,
      endTime,
      maxAppointments: maxAppointments || 20
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all sessions
// @route   GET /api/appointments/sessions
// @access  Public
export const getSessions = async (req, res) => {
  try {
    const { doctorId, date, status } = req.query;
    const query = {};
    if (doctorId) query.doctorId = doctorId;
    if (date) query.date = new Date(date);
    if (status) query.status = status;

    const sessions = await AppointmentSession.find(query).sort({ date: 1, startTime: 1 });
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get session by ID
// @route   GET /api/appointments/sessions/:id
export const getSessionById = async (req, res) => {
  try {
    const session = await AppointmentSession.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update session
// @route   PUT /api/appointments/sessions/:id
export const updateSession = async (req, res) => {
  try {
    let session = await AppointmentSession.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    session = await AppointmentSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete session
// @route   DELETE /api/appointments/sessions/:id
export const deleteSession = async (req, res) => {
  try {
    const session = await AppointmentSession.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    if (session.currentAppointmentsCount > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete session with active appointments' });
    }

    await session.deleteOne();
    res.status(200).json({ success: true, message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Appointment Controllers ---

// @desc    Book a new appointment in a session
// @route   POST /api/appointments
// @access  Private (Patient)
export const bookAppointment = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'];
    if (!patientId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { sessionId, reasonForVisit } = req.body;

    const session = await AppointmentSession.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    if (session.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Session is not active' });
    }

    if (session.currentAppointmentsCount >= session.maxAppointments) {
      return res.status(400).json({ success: false, message: 'Session is full' });
    }

    // Assign token number and update session counter
    session.currentAppointmentsCount += 1;
    const tokenNumber = session.currentAppointmentsCount;
    await session.save();

    const appointmentNumber = generateAppointmentNumber();

    const appointment = await Appointment.create({
      appointmentNumber,
      patientId,
      doctorId: session.doctorId,
      sessionId: session._id,
      tokenNumber,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      reasonForVisit
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get appointments for logged-in patient
export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'];
    const appointments = await Appointment.find({ patientId }).populate('sessionId').sort({ date: 1 });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get appointments for logged-in doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.headers['x-user-id'];
    const appointments = await Appointment.find({ doctorId }).populate('sessionId').sort({ date: 1 });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { status, notes } = req.body;
    const appointmentId = req.params.id;

    let appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (appointment.patientId !== userId && appointment.doctorId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;

    await appointment.save();
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

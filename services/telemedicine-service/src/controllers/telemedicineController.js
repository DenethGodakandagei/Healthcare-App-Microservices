import TelemedicineSession from '../models/TelemedicineSession.js';
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;

const APP_ID = process.env.AGORA_APP_ID || 'dummy_app_id';
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || 'dummy_app_certificate';

// @desc    Create a telemedicine session
// @route   POST /api/telemedicine
// @access  Private (Patient/Doctor/Admin)
export const createSession = async (req, res) => {
  try {
    const { appointmentId, patientId, doctorId, patientName, doctorName } = req.body;
    
    // Check if session already exists
    let session = await TelemedicineSession.findOne({ appointmentId });
    if (session) {
      return res.status(200).json({ success: true, data: session, message: 'Session already exists' });
    }

    // Generate unique channel name
    const channelName = `consultation_${appointmentId}_${Date.now()}`;

    session = await TelemedicineSession.create({
      appointmentId,
      patientId,
      doctorId,
      patientName: patientName || 'Patient',
      doctorName: doctorName || 'Doctor',
      channelName,
      status: 'waiting'
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate Agora token for video consultation
// @route   POST /api/telemedicine/token
// @access  Private
export const generateToken = async (req, res) => {
  try {
    const { channelName, roleType, uid } = req.body;
    
    if (!channelName) {
      return res.status(400).json({ success: false, message: 'Channel name is required' });
    }

    const session = await TelemedicineSession.findOne({ channelName });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const role = roleType === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const expirationTimeInSeconds = 3600; // 1 hour token validity
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID, 
      APP_CERTIFICATE, 
      channelName, 
      uid || 0,
      role, 
      privilegeExpiredTs
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        channelName,
        appId: APP_ID
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get session details by appointment ID
// @route   GET /api/telemedicine/appointment/:appointmentId
// @access  Private
export const getSessionByAppointment = async (req, res) => {
  try {
    const session = await TelemedicineSession.findOne({ appointmentId: req.params.appointmentId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update session status (e.g., start, end)
// @route   PUT /api/telemedicine/:id/status
// @access  Private
export const updateSessionStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const session = await TelemedicineSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.status = status;
    if (notes) session.notes = notes;
    
    if (status === 'ongoing') session.startTime = new Date();
    if (status === 'completed') session.endTime = new Date();
    
    await session.save();
    
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get sessions for a doctor
// @route   GET /api/telemedicine/doctor
// @access  Private
export const getDoctorSessions = async (req, res) => {
  try {
    const doctorId = req.headers['x-user-id'];
    if (!doctorId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const sessions = await TelemedicineSession.find({ doctorId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get sessions for a patient
// @route   GET /api/telemedicine/patient
// @access  Private
export const getPatientSessions = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'];
    if (!patientId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const sessions = await TelemedicineSession.find({ patientId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add chat message to session
// @route   POST /api/telemedicine/:id/chat
// @access  Private
export const addChatMessage = async (req, res) => {
  try {
    const { sender, senderId, senderName, message } = req.body;
    const session = await TelemedicineSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.chatMessages.push({
      sender,
      senderId,
      senderName,
      message,
      timestamp: new Date()
    });
    
    await session.save();
    
    res.status(200).json({ success: true, data: session.chatMessages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get chat messages for a session
// @route   GET /api/telemedicine/:id/chat
// @access  Private
export const getChatMessages = async (req, res) => {
  try {
    const session = await TelemedicineSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    res.status(200).json({ success: true, data: session.chatMessages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

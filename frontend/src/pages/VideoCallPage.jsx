import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { telemedicineAPI, appointmentAPI } from '../services/api';

/* ─── SVG Icon helper ──────────────────────────────────────────── */
const Icon = ({ path, size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  mic: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>,
  micOff: <><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.12 1.49-.34 2.17" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>,
  video: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>,
  videoOff: <><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" /><line x1="1" y1="1" x2="23" y2="23" /></>,
  phoneOff: <><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" /><line x1="23" y1="1" x2="1" y2="23" /></>,
  chat: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
  send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  maximize: <><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
};

/* ─── Duration Timer ───────────────────────────────────────────── */
const useTimer = (running) => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, [running]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

/* ─── Main Component ───────────────────────────────────────────── */
const VideoCallPage = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [callActive, setCallActive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [agoraClient, setAgoraClient] = useState(null);
  const [localTracks, setLocalTracks] = useState({ audioTrack: null, videoTrack: null });
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [joining, setJoining] = useState(false);
  const [ending, setEnding] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  const chatPollRef = useRef(null);

  const duration = useTimer(callActive);
  const isDoctor = user?.role === 'doctor';

  /* ─── Load session data ───────────────────────────────────────── */
  useEffect(() => {
    const loadSession = async () => {
      if (!appointmentId) {
        setError('Appointment ID is required to join a call.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Try to get existing session
        try {
          const res = await telemedicineAPI.getSessionByAppointment(appointmentId);
          if (res.data?.success) {
            setSession(res.data.data);
            setLoading(false);
            return;
          }
        } catch (sessionErr) {
          // If 404, we continue to create it
          if (sessionErr.response?.status !== 404) {
             throw sessionErr;
          }
        }

        // 2. If not found, load appointment details to create session
        const aptRes = await appointmentAPI.getById(appointmentId);
        const apt = aptRes.data?.data;

        if (!apt) {
          setError('Appointment not found.');
          setLoading(false);
          return;
        }

        if (apt.appointmentType !== 'online') {
          setError('This is not an online appointment.');
          setLoading(false);
          return;
        }

        // 3. Create the session
        const createRes = await telemedicineAPI.createSession({
          appointmentId: apt._id,
          patientId: apt.patientId,
          doctorId: apt.doctorId,
          patientName: apt.patientName || 'Patient',
          doctorName: apt.doctor?.lastName ? `Dr. ${apt.doctor.lastName}` : 'Doctor'
        });

        if (createRes.data?.success) {
          setSession(createRes.data.data);
        } else {
          setError('Failed to initialize video session.');
        }

      } catch (err) {
        console.error('Video error:', err);
        setError('Failed to load session details. ' + (err?.response?.data?.message || ''));
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, [appointmentId]);

  /* ─── Poll chat messages ──────────────────────────────────────── */
  useEffect(() => {
    if (!session?._id || !callActive) return;
    const poll = async () => {
      try {
        const res = await telemedicineAPI.getMessages(session._id);
        if (res.data?.success) setChatMessages(res.data.data || []);
      } catch (_) { }
    };
    poll();
    chatPollRef.current = setInterval(poll, 3000);
    return () => clearInterval(chatPollRef.current);
  }, [session?._id, callActive]);

  /* ─── Auto-scroll chat ────────────────────────────────────────── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  /* ─── Join Call ────────────────────────────────────────────────── */
  const handleJoinCall = useCallback(async () => {
    if (!session) return;
    setJoining(true);
    setError('');

    try {
      // Agora SDK is loaded globally via CDN script in index.html
      const AgoraRTC = window.AgoraRTC;
      if (!AgoraRTC) {
        throw new Error('Agora SDK not loaded. Please check your internet connection.');
      }

      // Get token from backend
      const tokenRes = await telemedicineAPI.generateToken({
        channelName: session.channelName,
        roleType: 'publisher',
        uid: 0
      });

      const { token, appId, channelName } = tokenRes.data.data;

      // Create Agora client
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      // Handle remote user events
      client.on('user-published', async (remoteUser, mediaType) => {
        await client.subscribe(remoteUser, mediaType);
        if (mediaType === 'video') {
          setRemoteUsers(prev => {
            const exists = prev.find(u => u.uid === remoteUser.uid);
            if (exists) return prev;
            return [...prev, remoteUser];
          });
          // Play remote video after a short delay to ensure DOM is ready
          setTimeout(() => {
            if (remoteVideoRef.current) {
              remoteUser.videoTrack?.play(remoteVideoRef.current);
            }
          }, 500);
        }
        if (mediaType === 'audio') {
          remoteUser.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (remoteUser, mediaType) => {
        if (mediaType === 'video') {
          setRemoteUsers(prev => prev.filter(u => u.uid !== remoteUser.uid));
        }
      });

      client.on('user-left', (remoteUser) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== remoteUser.uid));
      });

      // Join channel
      await client.join(appId, channelName, token, null);

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      await client.publish([audioTrack, videoTrack]);

      setAgoraClient(client);
      setLocalTracks({ audioTrack, videoTrack });
      setCallActive(true);

      // Update session status to ongoing
      await telemedicineAPI.updateSessionStatus(session._id, { status: 'ongoing' });

    } catch (err) {
      console.error('Failed to join call:', err);
      setError('Failed to join video call. Please check your camera/microphone permissions. ' + (err.message || ''));
    } finally {
      setJoining(false);
    }
  }, [session]);

  /* ─── End Call ─────────────────────────────────────────────────── */
  const handleEndCall = useCallback(async () => {
    setEnding(true);
    try {
      // Stop and close local tracks
      if (localTracks.audioTrack) {
        localTracks.audioTrack.stop();
        localTracks.audioTrack.close();
      }
      if (localTracks.videoTrack) {
        localTracks.videoTrack.stop();
        localTracks.videoTrack.close();
      }
      // Leave channel
      if (agoraClient) {
        await agoraClient.leave();
      }
      // Update session status
      if (session?._id) {
        await telemedicineAPI.updateSessionStatus(session._id, { status: 'completed' });
      }
    } catch (err) {
      console.error('Error ending call:', err);
    }
    setCallActive(false);
    setRemoteUsers([]);
    setEnding(false);
    // Navigate back to dashboard
    navigate(isDoctor ? '/doctor/dashboard' : '/patient/dashboard');
  }, [localTracks, agoraClient, session, navigate, isDoctor]);

  /* ─── Toggle Mic ──────────────────────────────────────────────── */
  const toggleMic = useCallback(() => {
    if (localTracks.audioTrack) {
      localTracks.audioTrack.setEnabled(!micOn);
      setMicOn(!micOn);
    }
  }, [localTracks.audioTrack, micOn]);

  /* ─── Toggle Video ────────────────────────────────────────────── */
  const toggleVideo = useCallback(() => {
    if (localTracks.videoTrack) {
      localTracks.videoTrack.setEnabled(!videoOn);
      setVideoOn(!videoOn);
    }
  }, [localTracks.videoTrack, videoOn]);

  /* ─── Send Chat Message ───────────────────────────────────────── */
  const sendMessage = async () => {
    if (!chatInput.trim() || !session?._id) return;
    try {
      await telemedicineAPI.sendMessage(session._id, {
        sender: isDoctor ? 'doctor' : 'patient',
        senderId: user?.id || user?._id,
        senderName: user?.username || user?.name || (isDoctor ? 'Doctor' : 'Patient'),
        message: chatInput.trim()
      });
      setChatInput('');
      // Immediately poll for new messages
      const res = await telemedicineAPI.getMessages(session._id);
      if (res.data?.success) setChatMessages(res.data.data || []);
    } catch (_) { }
  };

  /* ─── Loading / Error States ──────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-700 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm font-medium">Preparing consultation room...</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon path={icons.x} size={28} className="text-red-400" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Unable to Join</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ─── Pre-Call Lobby ──────────────────────────────────────────── */
  if (!callActive) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Secure Consultation</span>
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">Video Consultation</h1>
            <p className="text-gray-500 text-sm">
              {isDoctor ? `Patient: ${session?.patientName || 'Patient'}` : `Doctor: ${session?.doctorName || 'Doctor'}`}
            </p>
          </div>

          {/* Session Info Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {isDoctor
                  ? (session?.patientName || 'P')[0].toUpperCase()
                  : (session?.doctorName || 'D')[0].toUpperCase()
                }
              </div>
              <div>
                <p className="text-white font-semibold text-lg">
                  {isDoctor ? session?.patientName : `Dr. ${session?.doctorName}`}
                </p>
                <p className="text-gray-500 text-sm">Channel: {session?.channelName?.slice(0, 20)}...</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/50 rounded-xl p-3 flex items-center gap-3">
                <div className="text-cyan-400"><Icon path={icons.shield} size={16} /></div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Security</p>
                  <p className="text-white text-xs font-semibold">End-to-End Encrypted</p>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 flex items-center gap-3">
                <div className="text-cyan-400"><Icon path={icons.clock} size={16} /></div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Duration</p>
                  <p className="text-white text-xs font-semibold">Up to 60 min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              id="join-call-btn"
              onClick={handleJoinCall}
              disabled={joining}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              {joining ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Icon path={icons.video} size={22} />
                  Join Consultation
                </>
              )}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-gray-900 border border-gray-800 text-gray-400 font-medium rounded-2xl hover:text-white hover:border-gray-700 transition-all"
            >
              Cancel
            </button>
          </div>

          {/* Tips */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <p className="text-gray-500 text-xs font-medium mb-2">Before you join:</p>
            <ul className="text-gray-500 text-xs space-y-1">
              <li>• Ensure your camera and microphone are connected</li>
              <li>• Use a well-lit, quiet room for best experience</li>
              <li>• Have a stable internet connection</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Active Call UI ──────────────────────────────────────────── */
  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/50 z-20">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white font-semibold text-sm">Live Consultation</span>
          <span className="text-gray-500 text-sm font-mono">{duration}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
            <Icon path={icons.shield} size={12} className="text-green-400" />
            <span className="text-green-400 text-[10px] font-bold uppercase tracking-wider">Encrypted</span>
          </div>
        </div>
      </header>

      {/* Video Area */}
      <div className="flex-1 flex relative">
        {/* Main Video (Remote User) */}
        <div className={`flex-1 relative ${chatOpen ? 'mr-80' : ''} transition-all duration-300`}>
          {/* Remote Video */}
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            {remoteUsers.length > 0 ? (
              <div ref={remoteVideoRef} className="w-full h-full" />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon path={icons.user} size={40} className="text-gray-600" />
                </div>
                <p className="text-gray-500 font-medium">Waiting for {isDoctor ? 'patient' : 'doctor'} to connect...</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Local Video (PiP) */}
          <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700/50 z-10">
            {videoOn ? (
              <div ref={localVideoRef} className="w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <Icon path={icons.user} size={20} className="text-gray-500" />
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded-md">
              <span className="text-white text-[10px] font-medium">You</span>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            {/* Mic Toggle */}
            <button
              id="toggle-mic-btn"
              onClick={toggleMic}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${micOn
                  ? 'bg-gray-800/80 backdrop-blur-sm text-white hover:bg-gray-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              title={micOn ? 'Mute' : 'Unmute'}
            >
              <Icon path={micOn ? icons.mic : icons.micOff} size={20} />
            </button>

            {/* Video Toggle */}
            <button
              id="toggle-video-btn"
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${videoOn
                  ? 'bg-gray-800/80 backdrop-blur-sm text-white hover:bg-gray-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              title={videoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              <Icon path={videoOn ? icons.video : icons.videoOff} size={20} />
            </button>

            {/* Chat Toggle */}
            <button
              id="toggle-chat-btn"
              onClick={() => setChatOpen(!chatOpen)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${chatOpen
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800/80 backdrop-blur-sm text-white hover:bg-gray-700'
                }`}
              title="Toggle chat"
            >
              <Icon path={icons.chat} size={20} />
            </button>

            {/* End Call */}
            <button
              id="end-call-btn"
              onClick={handleEndCall}
              disabled={ending}
              className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all shadow-lg shadow-red-600/30"
              title="End call"
            >
              {ending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Icon path={icons.phoneOff} size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Chat Panel */}
        {chatOpen && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900 border-l border-gray-800 flex flex-col z-10">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Icon path={icons.chat} size={16} className="text-cyan-400" />
                <span className="text-white font-semibold text-sm">Session Chat</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <Icon path={icons.x} size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-700 mb-2"><Icon path={icons.chat} size={32} className="mx-auto" /></div>
                  <p className="text-gray-600 text-xs">No messages yet. Send a message to start the conversation.</p>
                </div>
              )}
              {chatMessages.map((msg, i) => {
                const isOwn = msg.senderId === (user?.id || user?._id);
                return (
                  <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${isOwn
                        ? 'bg-cyan-500/20 text-cyan-100 rounded-br-md'
                        : 'bg-gray-800 text-gray-200 rounded-bl-md'
                      }`}>
                      <p className={`text-[10px] font-bold mb-1 ${isOwn ? 'text-cyan-400' : 'text-gray-500'}`}>
                        {isOwn ? 'You' : msg.senderName || msg.sender}
                      </p>
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <p className={`text-[10px] mt-1 ${isOwn ? 'text-cyan-400/50' : 'text-gray-600'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  id="chat-input"
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                <button
                  id="send-chat-btn"
                  onClick={sendMessage}
                  disabled={!chatInput.trim()}
                  className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white hover:bg-cyan-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Icon path={icons.send} size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;

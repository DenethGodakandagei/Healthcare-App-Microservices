import { useState, useEffect, useMemo, useCallback } from 'react';
import { doctorAPI, sessionAPI, appointmentAPI, patientAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Icon = ({ path, size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
);

export default function AppointmentBookingWizard({ open, onClose }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [patient, setPatient] = useState({ name: '', nic: '', phone: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = useCallback((date) => {
    const year = date.getFullYear(), month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push(new Date(year, month, -i));
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) days.push(new Date(year, month, i));
    return days;
  }, []);

  const calendarDays = useMemo(() => getDaysInMonth(currentMonth), [currentMonth, getDaysInMonth]);
  const sessionsByDate = useMemo(() => {
    const map = {};
    sessions.forEach(s => {
      const key = new Date(s.date).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return map;
  }, [sessions]);

  useEffect(() => {
    if (open) {
      reset();
      loadInitialData();
    }
  }, [open]);

  const loadInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      // Load doctors first (critical)
      const docsRes = await doctorAPI.getAll();
      const docs = docsRes.data?.data || [];
      setDoctors(docs);
      const specs = [...new Set(docs.map(d => d.specialty).filter(Boolean))].sort();
      setSpecialties(specs);

      // Try to load patient profile (non-critical, don't fail if this errors)
      try {
        const profileRes = await patientAPI.getProfile();
        const profile = profileRes.data?.data;
        if (profile?.name) {
          setPatient(prev => ({ ...prev, name: profile.name }));
        }
      } catch (profileErr) {
        // Silently ignore profile errors, use username fallback
        console.log('Profile not loaded, using username fallback');
      }

      // Fallback to username if no name set yet
      if (!patient.name && user?.username) {
        setPatient(prev => ({ ...prev, name: user.username }));
      }
    } catch (err) {
      console.error('Load error:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelectedSpecialty('');
    setSelectedDoctor(null);
    setSelectedSession(null);
    setCurrentMonth(new Date());
    setPatient(prev => ({ ...prev, nic: '', phone: '', reason: '' }));
    setError('');
    setSessions([]);
    setFilteredDoctors([]);
  };

  useEffect(() => {
    if (selectedDoctor) {
      setLoading(true);
      sessionAPI.getAll({ doctorId: selectedDoctor.userId, status: 'active' })
        .then(res => setSessions(res.data?.data || []))
        .catch(err => {
          console.error('Sessions error:', err);
          setSessions([]);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (selectedSpecialty) {
      setFilteredDoctors(doctors.filter(d => d.specialty === selectedSpecialty));
    } else {
      setFilteredDoctors([]);
    }
  }, [selectedSpecialty, doctors]);

  const changeMonth = (offset) => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + offset);
    setCurrentMonth(d);
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleBook = async (e) => {
    e?.preventDefault();
    if (!selectedSession || !patient.name || !patient.nic || !patient.phone) {
      setError('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await appointmentAPI.book({
        sessionId: selectedSession._id,
        reasonForVisit: patient.reason || 'General Consultation',
        patientName: patient.name,
        patientNIC: patient.nic,
        patientPhone: patient.phone,
      });
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err?.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const canProceed = {
    1: selectedSpecialty && filteredDoctors.length > 0,
    2: selectedDoctor,
    3: Object.keys(sessionsByDate).some(key => sessionsByDate[key].length > 0),
    4: selectedSession && patient.name && patient.nic && patient.phone
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 md:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex-1 text-center">
            <h2 className="text-lg font-semibold text-gray-900">Book Appointment</h2>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${step >= s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</div>
                  {s < 4 && <div className={`w-4 h-0.5 ${step > s ? 'bg-green-600' : 'bg-gray-100'}`} />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Icon path={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[55vh]">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">{error}</div>}

          {/* Step 1: Specialty */}
          {step === 1 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Medical Specialty</h3>
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"/></div>
              ) : specialties.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-sm mb-2">No specialties available</p>
                  <button onClick={() => window.location.reload()} className="text-xs text-blue-600 hover:underline">Retry</button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {specialties.map(spec => (
                    <button
                      key={spec}
                      onClick={() => { setSelectedSpecialty(spec); }}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        selectedSpecialty === spec ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Doctor */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Select Doctor</h3>
                <p className="text-xs text-gray-500">{selectedSpecialty}</p>
              </div>
              {loading ? (
                <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"/></div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm mb-3">No doctors found</p>
                  <button onClick={() => setStep(1)} className="text-xs text-blue-600 hover:underline">Choose different specialty</button>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 -mr-2">
                  {filteredDoctors.map(doc => (
                    <div
                      key={doc._id}
                      onClick={() => setSelectedDoctor(doc)}
                      className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${
                        selectedDoctor?._id === doc._id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        selectedDoctor?._id === doc._id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {doc.firstName[0]}{doc.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${selectedDoctor?._id === doc._id ? 'text-green-900' : 'text-gray-800'}`}>
                          Dr. {doc.firstName} {doc.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{doc.experienceYears}+ years</p>
                      </div>
                      {selectedDoctor?._id === doc._id && (
                        <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                          <Icon path={<><polyline points="20 6 9 17 4 12"/></>} size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Calendar */}
          {step === 3 && selectedDoctor && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Select Appointment Date</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                  <div className="flex gap-1">
                    <button onClick={() => changeMonth(-1)} className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                      <Icon path={<><polyline points="15 18 9 12 15 6"/></>} size={14} />
                    </button>
                    <button onClick={() => changeMonth(1)} className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                      <Icon path={<><polyline points="9 18 15 12 9 6"/></>} size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-700 mt-1">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"/></div>
              ) : (
                <>
                  <div className="border border-gray-200 rounded-xl p-3">
                    <div className="grid grid-cols-7 gap-1 mb-1.5">
                      {weekDays.map(d => <div key={d} className="text-center text-[10px] font-medium text-gray-500 uppercase">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((date, idx) => {
                        const key = date.toDateString();
                        const daySessions = sessionsByDate[key] || [];
                        const isPast = isPastDate(date);
                        const isAvailable = daySessions.length > 0;
                        const isSelected = selectedSession && new Date(selectedSession.date).toDateString() === key;

                        return (
                          <button
                            key={idx}
                            onClick={() => !isPast && isAvailable && setSelectedSession(daySessions[0])}
                            disabled={isPast || !isAvailable}
                            className={`aspect-square rounded-md flex flex-col items-center justify-center transition-all text-xs ${
                              isSelected
                                ? 'bg-green-600 text-white font-semibold'
                                : isPast
                                  ? 'bg-purple-50 text-purple-400 cursor-not-allowed border border-purple-100'
                                  : isAvailable
                                    ? 'bg-white border border-green-500 text-gray-900 hover:bg-green-50 hover:border-green-600 font-medium'
                                    : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            <span className="text-sm">{date.getDate()}</span>
                            {isAvailable && !isSelected && <div className="w-1 h-1 bg-green-600 rounded-full mt-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedSession && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="min-w-0">
                          <p className="text-[10px] text-green-700 font-medium uppercase tracking-wide mb-0.5">Selected Time</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {new Date(selectedSession.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {selectedSession.startTime} - {selectedSession.endTime}
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <p className="text-[10px] text-green-700 font-medium uppercase tracking-wide mb-0.5">Slots left</p>
                          <p className="font-bold text-green-700 text-base">{selectedSession.maxAppointments - selectedSession.currentAppointmentsCount}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 4: Patient Form */}
          {step === 4 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Patient Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={patient.name}
                    onChange={e => setPatient(p => ({ ...p, name: e.target.value }))}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">NIC / ID</label>
                  <input
                    type="text"
                    value={patient.nic}
                    onChange={e => setPatient(p => ({ ...p, nic: e.target.value }))}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                    placeholder="NIC number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone (+94)</label>
                  <input
                    type="tel"
                    value={patient.phone}
                    onChange={e => setPatient(p => ({ ...p, phone: e.target.value }))}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                    placeholder="77 123 4567"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Reason for Visit (Optional)</label>
                  <textarea
                    value={patient.reason}
                    onChange={e => setPatient(p => ({ ...p, reason: e.target.value }))}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none text-sm"
                    placeholder="Briefly describe your symptoms..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex gap-2.5">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">Back</button>
          ) : (
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">Cancel</button>
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed[step]}
              className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleBook}
              disabled={submitting || !canProceed[4]}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

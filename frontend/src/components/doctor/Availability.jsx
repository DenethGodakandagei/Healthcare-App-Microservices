import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { sessionAPI } from '../../services/api';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  plus: <React.Fragment><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></React.Fragment>,
  x: <line x1="18" y1="6" x2="6" y2="18" />,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></>,
};

const SessionModal = ({ session, onClose, onSave }) => {
  const [form, setForm] = useState({
    date: session?.date ? new Date(session.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    startTime: session?.startTime || '08:00',
    endTime: session?.endTime || '10:00',
    maxAppointments: session?.maxAppointments ?? 20,
    status: session?.status || 'active',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch (err) { setError(err?.response?.data?.message || 'Update failed.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-[#111]/40 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-[3rem] w-full max-w-lg p-12 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h2 className="text-[#111] text-4xl font-black tracking-tighter mb-2 italic">Availability Block.</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Portal Initialization Settings</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
            <Icon path={icons.x} size={24} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-blue-500 text-[10px] font-black uppercase tracking-widest ml-2">Cycle Date</label>
               <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all border-none" />
             </div>
             <div className="space-y-2">
               <label className="text-blue-500 text-[10px] font-black uppercase tracking-widest ml-2">Patient Capacity</label>
               <input type="number" value={form.maxAppointments} onChange={e => setForm({...form, maxAppointments: e.target.value})} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all border-none" />
             </div>
          </div>
      <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-blue-500 text-[10px] font-black uppercase tracking-widest ml-2">Shift Start</label>
               <input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all border-none" />
             </div>
             <div className="space-y-2">
               <label className="text-blue-500 text-[10px] font-black uppercase tracking-widest ml-2">Cycle Status</label>
               <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all border-none appearance-none">
                 <option value="active">Active System</option>
                 <option value="cancelled">Declined Shift</option>
                 <option value="completed">Cycle Finished</option>
               </select>
             </div>
          </div>
          <div className="space-y-2">
             <label className="text-blue-500 text-[10px] font-black uppercase tracking-widest ml-2">Shift End</label>
             <input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all border-none" />
          </div>

          <button type="submit" disabled={saving} className="w-full h-20 bg-[#427CFF] text-white font-black rounded-[2rem] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-200 uppercase tracking-[0.3em] text-xs">
            {saving ? 'Processing Cycle...' : 'Synchronize Block'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Availability = () => {
  const { user, profile } = useOutletContext();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try { 
      const res = await sessionAPI.getAll({ doctorId: user.id }); 
      const allSessions = res.data?.data || res.data || [];
      const doctorId = user.id;

      if (!doctorId) {
        setSessions([]);
        setLoading(false);
        return;
      }

      // Final strict filter on frontend to ensure zero bleed between doctors
      const filtered = allSessions.filter(s => 
        (s.doctor && String(s.doctor) === String(doctorId)) || 
        (s.doctorId && String(s.doctorId) === String(doctorId)) ||
        (s.doctor?._id && String(s.doctor?._id) === String(doctorId))
      );
      
      setSessions(filtered); 
    } catch (err) {
      console.error("Session load error:", err);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 flex items-center justify-center animate-pulse"><Icon path={icons.activity} size={40} className="text-blue-200" /></div>;

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#111] text-5xl font-black tracking-tighter mb-2 italic">Clinical Blocks.</h2>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{sessions.length} active diagnostic windows</p>
        </div>
        <button onClick={() => setModal({ type: 'create' })} className="h-16 px-10 bg-[#427CFF] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-blue-100 flex items-center gap-3 group">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform">
             <Icon path={icons.plus} size={14} />
          </div>
          Initialize Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sessions.map(s => {
          const filled = s.currentAppointmentsCount || 0;
          const max = s.maxAppointments || 1;
          const pct = Math.min(100, Math.round((filled / max) * 100));
          return (
            <div key={s._id} className="bg-white rounded-[2.5rem] border border-gray-50 p-8 hover:shadow-2xl hover:shadow-gray-100/50 transition-all duration-500 relative group overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#427CFF]">
                       <Icon path={icons.calendar} size={20} />
                     </div>
                     <div>
                       <h4 className="text-[#111] font-black text-lg tracking-tight">{new Date(s.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
                       <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">{s.startTime} — {s.endTime}</p>
                     </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => setModal({type:'edit', session:s})} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-500 transition-all"><Icon path={icons.edit} size={14}/></button>
                     <button onClick={() => sessionAPI.delete(s._id).then(load)} className="p-2.5 bg-red-50 rounded-xl text-red-500 transition-all"><Icon path={icons.trash} size={14}/></button>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-end">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#427CFF]">Cycle Saturation</p>
                     <p className="text-[#111] font-black text-sm">{filled} / {max} Patients</p>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#427CFF] rounded-full group-hover:animate-pulse transition-all" style={{width: `${pct}%`}} />
                  </div>
               </div>
            </div>
          );
        })}
      </div>
      {modal && <SessionModal session={modal.session} onClose={() => setModal(null)} onSave={f => modal.type==='create'? sessionAPI.create(f).then(load) : sessionAPI.update(modal.session._id, f).then(load)} />}
    </div>
  );
};

export default Availability;

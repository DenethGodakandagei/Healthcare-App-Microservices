import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { sessionAPI } from '../../services/api';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  x: <line x1="18" y1="6" x2="6" y2="18" />,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></>,
  video: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>,
};

const SessionModal = ({ session, onClose, onSave }) => {
  const [form, setForm] = useState({
    date: session?.date ? new Date(session.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    startTime: session?.startTime || '08:00',
    endTime: session?.endTime || '10:00',
    sessionType: session?.sessionType || 'offline',
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
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-[3rem] w-full max-w-lg p-12 relative overflow-hidden shadow-2xl shadow-indigo-200/20 animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h2 className="text-slate-950 text-4xl font-black tracking-tighter mb-2 uppercase leading-none">Diagnostic Block</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Portal Initialization Settings</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100">
            <Icon path={icons.x} size={24} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-indigo-950 text-[10px] font-black uppercase tracking-widest ml-1">Cycle Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:ring-4 focus:ring-indigo-50 border-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-indigo-950 text-[10px] font-black uppercase tracking-widest ml-1">Limit (Patients)</label>
              <input type="number" value={form.maxAppointments} onChange={e => setForm({ ...form, maxAppointments: e.target.value })} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:ring-4 focus:ring-indigo-50 border-none transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-emerald-500 text-[10px] font-black uppercase tracking-widest ml-1">Shift Start</label>
              <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:ring-4 focus:ring-emerald-50 border-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">Shift End</label>
              <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:ring-4 focus:ring-rose-50 border-none transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-indigo-900 text-[10px] font-black uppercase tracking-widest ml-1">Session Protocol</label>
              <select value={form.sessionType} onChange={e => setForm({ ...form, sessionType: e.target.value })} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-sm outline-none appearance-none cursor-pointer">
                <option value="offline">In-Person (Offline)</option>
                <option value="online">Video Call (Online)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-indigo-900 text-[10px] font-black uppercase tracking-widest ml-1">Operational State</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-sm outline-none appearance-none cursor-pointer">
                <option value="active">Active Entry</option>
                <option value="cancelled">Declined Shift</option>
                <option value="completed">Cycle Finished</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={saving} className={`w-full h-20 text-white font-black rounded-[2rem] transition-all shadow-2xl uppercase tracking-[0.2em] text-xs ${form.sessionType === 'online' ? 'bg-indigo-950 hover:bg-black shadow-indigo-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'}`}>
            {saving ? 'Synchronizing Archive...' : form.sessionType === 'online' ? 'Launch Video session' : 'Sync Clinical Block'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Availability = () => {
  const { user } = useOutletContext();
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
      const filtered = allSessions.filter(s =>
        (s.doctor && String(s.doctor) === String(doctorId)) ||
        (s.doctorId && String(s.doctorId) === String(doctorId)) ||
        (s.doctor?._id && String(s.doctor?._id) === String(doctorId))
      );
      setSessions(filtered);
    } catch (err) { }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 flex items-center justify-center animate-pulse"><div className="w-10 h-10 border-4 border-indigo-950 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-slate-950 text-5xl font-black tracking-tighter mb-4 leading-none uppercase">Clinical Blocks</h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.25em]">{sessions.length} active diagnostic windows / Current Registry</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setModal({ type: 'create', session: { sessionType: 'online' } })} className="h-16 px-8 bg-indigo-950 text-white rounded-[1.8rem] font-bold text-xs uppercase tracking-widest hover:bg-black shadow-xl shadow-indigo-100 flex items-center gap-3 transition-all shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
               <Icon path={icons.video} size={16} />
            </div>
            Video Session
          </button>
          <button onClick={() => setModal({ type: 'create', session: { sessionType: 'offline' } })} className="h-16 px-8 bg-emerald-600 text-white rounded-[1.8rem] font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 flex items-center gap-3 transition-all shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
               <Icon path={icons.plus} size={16} />
            </div>
            Clinical Block
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sessions.map(s => {
          const filled = s.currentAppointmentsCount || 0;
          const max = s.maxAppointments || 1;
          const pct = Math.min(100, Math.round((filled / max) * 100));
          const isOnline = s.sessionType === 'online';
          return (
            <div key={s._id} className={`bg-white rounded-[3rem] border border-gray-50 p-10 hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-700 relative group group-hover:-translate-y-2 overflow-hidden ${!isOnline ? 'border-emerald-100 bg-emerald-50/5' : 'border-indigo-100 bg-indigo-50/5'}`}>
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-[1.8rem] flex flex-col items-center justify-center font-black transition-all duration-500 group-hover:rotate-3 shadow-inner ${isOnline ? 'bg-indigo-950 text-white shadow-indigo-100' : 'bg-emerald-600 text-white shadow-emerald-100'}`}>
                    <span className="text-[10px] uppercase opacity-60 mb-1 leading-none">{new Date(s.date).toLocaleDateString([], { weekday: 'short' })}</span>
                    <span className="text-3xl leading-none">{new Date(s.date).getDate()}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-slate-950 font-black text-2xl tracking-tighter uppercase leading-none">{new Date(s.date).toLocaleDateString([], { month: 'short', year: 'numeric' })}</h4>
                      {isOnline && (
                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-900 text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-100">Telemedicine</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                      <Icon path={icons.clock} size={12} className="text-gray-300" />
                      <span className="text-slate-950">{s.startTime} — {s.endTime}</span>
                      <span className="text-gray-200">/</span>
                      <span className="text-gray-400">{s.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <button onClick={() => setModal({ type: 'edit', session: s })} className="w-12 h-12 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-900 hover:border-indigo-100 transition-all flex items-center justify-center shadow-sm"><Icon path={icons.edit} size={16} /></button>
                  <button onClick={() => sessionAPI.delete(s._id).then(load)} className="w-12 h-12 bg-white border border-gray-100 rounded-2xl text-red-500 transition-all flex items-center justify-center shadow-sm hover:bg-red-50"><Icon path={icons.trash} size={16} /></button>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end px-1">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-indigo-900' : 'text-emerald-600'}`}>Capacity Load</p>
                  <p className="text-slate-950 font-black text-sm">{filled} / {max} Patients</p>
                </div>
                <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100/50">
                  <div className={`h-full rounded-full transition-all duration-1000 ${isOnline ? 'bg-indigo-950' : 'bg-emerald-400'}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest text-right">{pct}% Saturated</p>
              </div>
            </div>
          );
        })}
      </div>
      {modal && <SessionModal session={modal.session} onClose={() => setModal(null)} onSave={f => modal.type === 'create' ? sessionAPI.create(f).then(load) : sessionAPI.update(modal.session._id, f).then(load)} />}
    </div>
  );
};

export default Availability;

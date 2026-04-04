import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppointmentCard from './AppointmentCard';

const Appointments = () => {
  const { appointments } = useOutletContext();

  const groups = useMemo(() => {
    const list = appointments || [];
    return {
      pending: list.filter(a => a.status === 'pending'),
      active: list.filter(a => a.status === 'confirmed' || a.status === 'scheduled'),
      all: list
    };
  }, [appointments]);

  if (!appointments || appointments.length === 0) {
    return (
      <div className="p-32 bg-white rounded-[3rem] border border-gray-50 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <svg className="text-gray-200" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
        </div>
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Registry is currently empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-1000">

      {/* Dynamic Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-950 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Waitlist</span>
          <span className="text-3xl font-black">{groups.pending.length}</span>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Active Shift</span>
          <span className="text-emerald-500 text-3xl font-black">{groups.active.length}</span>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Registry</span>
          <span className="text-slate-900 text-3xl font-black">{groups.all.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Prioritize Waiting List */}
        {groups.pending.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 px-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <h3 className="text-slate-900 font-black uppercase tracking-[0.2em] text-[10px]">Action Required</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {groups.pending.map(apt => <AppointmentCard key={apt._id} apt={apt} />)}
            </div>
          </div>
        )}

        {/* General Queue */}
        <div className="space-y-4">
          {groups.pending.length > 0 && (
            <div className="flex items-center gap-4 px-2 pt-4">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              <h3 className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Clinical Queue</h3>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4">
            {groups.all.filter(a => a.status !== 'pending').map(apt => <AppointmentCard key={apt._id} apt={apt} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;

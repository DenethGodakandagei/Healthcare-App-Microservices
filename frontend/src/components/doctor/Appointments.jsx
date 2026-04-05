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
      <div className="p-32 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center animate-in fade-in duration-500 shadow-sm shadow-gray-50">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100/50">
          <svg className="text-gray-300" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Registry is currently empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">

      {/* Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#2299C9] p-5 rounded-2xl text-white shadow-lg shadow-sky-500/10 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Pending Waitlist</span>
          <span className="text-2xl font-black">{groups.pending.length}</span>
        </div>
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Active Schedule</span>
          <span className="text-[#0EA5E9] text-2xl font-black">{groups.active.length}</span>
        </div>
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Patient Records</span>
          <span className="text-gray-900 text-2xl font-black">{groups.all.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Waiting List */}
        {groups.pending.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-1">
              <span className="w-1.5 h-1.5 bg-[#0EA5E9] rounded-full animate-pulse" />
              <h3 className="text-gray-900 font-bold uppercase tracking-widest text-[10px]">Action Required</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {groups.pending.map(apt => <AppointmentCard key={apt._id} apt={apt} />)}
            </div>
          </div>
        )}

        {/* General Queue */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <h3 className="text-gray-900 font-bold uppercase tracking-widest text-[10px]">Registry History</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {groups.all.filter(a => a.status !== 'pending').map(apt => <AppointmentCard key={apt._id} apt={apt} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;

import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AppointmentCard from './AppointmentCard';

const Appointments = () => {
  const { appointments } = useOutletContext();
  
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <h2 className="text-[#111] text-5xl font-black tracking-tighter mb-8 italic">Patient Appointments.</h2>
      <div className="grid grid-cols-1 gap-4">
        {appointments.length === 0 ? (
          <div className="p-20 bg-white rounded-[3rem] border border-gray-50 text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No appointment records found</p>
          </div>
        ) : (
          appointments.map(apt => (
            <AppointmentCard key={apt._id} apt={apt} />
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;

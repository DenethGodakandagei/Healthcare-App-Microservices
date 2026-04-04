import React from 'react';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  trendingUp: <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />,
};

const DocStatCard = ({ label, value, sub, iconContent, highlight, trend, intensity = "blue" }) => {
  const intensities = {
    blue: 'bg-indigo-50 text-indigo-900 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-100',
    amber: 'bg-amber-50 text-amber-900 border-amber-100',
    rose: 'bg-rose-50 text-rose-900 border-rose-100'
  };

  const currentIntensity = intensities[intensity] || intensities.blue;

  return (
    <div className={`group relative p-8 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-2 transform perspective-1000 ${highlight ? 'bg-indigo-950 text-white shadow-2xl shadow-indigo-100' : 'bg-white border border-gray-50 hover:shadow-2xl hover:shadow-gray-200/40'}`}>
      {highlight && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 blur-[60px] opacity-20 -translate-y-12 translate-x-12" />
      )}
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={`p-4 rounded-3xl transition-transform duration-500 group-hover:rotate-6 ${highlight ? 'bg-white/10' : currentIntensity}`}>
          <Icon path={iconContent} size={24} className={highlight ? 'text-emerald-400' : ''} />
        </div>
        {trend && (
           <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${highlight ? 'bg-white/10 text-emerald-400' : 'bg-green-50 text-green-600 border border-green-100'}`}>
             <Icon path={icons.trendingUp} size={10} />
             {trend}
           </div>
        )}
      </div>
      
      <div className="relative z-10">
         <h3 className={`text-5xl font-black tracking-tighter mb-1 ${highlight ? 'text-white' : 'text-slate-950'}`}>{value}</h3>
         <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{label}</p>
         {sub && <p className={`text-[9px] mt-2 font-bold ${highlight ? 'text-white/40' : 'text-gray-300'}`}>{sub}</p>}
      </div>
    </div>
  );
};

export default DocStatCard;

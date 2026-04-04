import React from 'react';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  trendingUp: <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />,
};

const DocStatCard = ({ label, value, sub, iconContent, highlight, trend }) => (
  <div className={`group relative p-8 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 ${highlight ? 'bg-[#427CFF] text-white shadow-[0_20px_40px_-10px_rgba(66,124,255,0.4)]' : 'bg-white border border-gray-50 hover:shadow-2xl hover:shadow-gray-200/50'}`}>
    <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -translate-y-12 translate-x-12 ${highlight ? 'bg-white' : 'bg-[#427CFF]'}`} />
    
    <div className="flex items-center justify-between mb-8 relative z-10">
      <div className={`p-4 rounded-3xl ${highlight ? 'bg-white/20' : 'bg-gray-50'}`}>
        <Icon path={iconContent} size={24} className={highlight ? 'text-white' : 'text-[#427CFF]'} />
      </div>
      {trend && (
         <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${highlight ? 'bg-white/10' : 'bg-green-50 text-green-600'}`}>
           <Icon path={icons.trendingUp} size={12} />
           {trend}
         </div>
      )}
    </div>
    
    <div className="relative z-10">
       <h3 className={`text-4xl font-black tracking-tighter mb-1 ${highlight ? 'text-white' : 'text-[#111]'}`}>{value}</h3>
       <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{label}</p>
       {sub && <p className={`text-[10px] mt-2 font-bold ${highlight ? 'text-white/40' : 'text-gray-300'}`}>{sub}</p>}
    </div>
  </div>
);

export default DocStatCard;

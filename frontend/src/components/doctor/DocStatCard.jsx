import React from 'react';

const Icon = ({ path, size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const DocStatCard = ({ label, value, sub, iconContent, highlight, trend }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow ${highlight ? 'ring-2 ring-sky-100 border-[#2299C9]' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-[#2299C9] text-white' : 'bg-gray-100 text-gray-600'}`}>
          <Icon path={iconContent} />
        </div>
        {trend && (
          <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
            {trend}
          </div>
        )}
      </div>
      <p className="text-gray-900 text-2xl font-bold mb-0.5">{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
      {sub && <p className="text-gray-400 text-xs mt-1">{sub}</p>}
    </div>
  );
};

export default DocStatCard;

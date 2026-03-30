import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { doctorAPI } from '../services/api';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
  star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  mapPin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  chevronRight: <polyline points="9 18 15 12 9 6"/>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
};

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await doctorAPI.getAll();
        const data = res.data?.data || [];
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doc => {
      const matchesSearch = `${doc.firstName} ${doc.lastName} ${doc.specialty}`.toLowerCase().includes(search.toLowerCase());
      const matchesSpecialty = specialty === 'All' || doc.specialty === specialty;
      return matchesSearch && matchesSpecialty;
    });
    setFilteredDoctors(filtered);
  }, [search, specialty, doctors]);

  const specialties = ['All', ...new Set(doctors.map(d => d.specialty))];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Our Specialists.</h1>
              <p className="text-lg text-gray-500 font-medium">Find and book appointments with verified medical professionals.</p>
            </div>
             <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative group min-w-[300px]">
                   <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                     <Icon path={icons.search} size={18} />
                   </div>
                   <input
                     type="text"
                     placeholder="Search name, specialty..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all shadow-sm"
                   />
                </div>
                <div className="relative">
                   <select
                     value={specialty}
                     onChange={(e) => setSpecialty(e.target.value)}
                     className="appearance-none w-full sm:w-48 pl-5 pr-10 py-4 bg-white border border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all shadow-sm"
                   >
                     {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                   <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                     <Icon path={icons.filter} size={14} />
                   </div>
                </div>
             </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-48 bg-gray-100 animate-pulse rounded-[2.5rem]" />)}
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doc) => (
                <div key={doc._id} className="group bg-white border border-gray-100 rounded-[2.5rem] p-4 hover:border-gray-900 transition-all hover:shadow-2xl hover:shadow-gray-100">
                   <div className="flex items-start gap-5">
                      <div className="w-24 h-24 bg-gray-50 rounded-3xl overflow-hidden shrink-0">
                         <img
                           src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                           alt={doc.firstName}
                           className="w-full h-full object-cover transition-transform group-hover:scale-110"
                         />
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Available</p>
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 truncate">Dr. {doc.firstName} {doc.lastName}</h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-4">{doc.specialty}</p>
                        
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1 text-xs font-bold text-gray-900">
                             <Icon path={icons.star} size={14} className="fill-current" />
                             4.9
                           </div>
                           <div className="w-1 h-1 bg-gray-200 rounded-full" />
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{doc.experienceYears}+ YRS EXP.</p>
                        </div>
                      </div>
                   </div>
                   
                   <div className="mt-8 grid grid-cols-2 gap-3 pb-2 pt-1">
                      <div className="bg-gray-50 rounded-2xl p-4 text-center">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fee</p>
                         <p className="text-lg font-extrabold text-gray-900">${doc.consultationFee}</p>
                      </div>
                      <Link
                        to={`/booking/${doc._id}`}
                        className="bg-gray-900 text-white rounded-2xl flex flex-col items-center justify-center p-4 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                      >
                         <p className="text-sm font-bold">Book Appointment</p>
                      </Link>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-[3rem] p-24 text-center shadow-sm">
               <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
                 <Icon path={icons.search} size={32} />
               </div>
               <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No doctors found</h3>
               <p className="text-gray-500 font-medium">Try adjusting your filters or search keywords.</p>
               <button
                 onClick={() => { setSearch(''); setSpecialty('All'); }}
                 className="mt-8 text-sm font-bold text-gray-900 underline underline-offset-8 decoration-2 decoration-gray-900/10 hover:decoration-gray-900 transition-all"
               >
                 Clear all filters
               </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Newsletter */}
      <section className="py-24 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
             <div className="relative z-10 max-w-xl">
               <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Stay informed.</h2>
               <p className="text-gray-400 text-lg font-medium leading-relaxed">Subscribe to our newsletter for the latest health tips, medical news, and specialist insights.</p>
             </div>
             <div className="relative z-10 w-full md:w-auto min-w-[300px]">
                <div className="flex p-2 bg-white/10 backdrop-blur rounded-[2rem] border border-white/10 group focus-within:bg-white transition-all">
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="flex-1 bg-transparent border-none px-6 py-4 text-white focus:text-gray-900 focus:outline-none font-medium placeholder:text-gray-500"
                  />
                  <button className="px-8 bg-white text-gray-900 rounded-3xl font-bold hover:bg-gray-100 transition-all">Join</button>
                </div>
             </div>
           </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
              <Icon path={icons.activity} size={16} />
            </div>
            <span className="text-gray-900 font-bold">MediCare.</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">© 2026 MediCare Health Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DoctorsPage;

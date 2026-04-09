import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI, authAPI } from '../../services/api';

const Icon = ({ path, size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const icons = {
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
  x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
};

const formatAvailability = (availability) => {
  if (!availability) return '—';
  // If it's not an array, try to convert or return as-is
  if (!Array.isArray(availability)) {
    console.warn('Availability is not an array:', availability);
    return typeof availability === 'object' ? JSON.stringify(availability) : String(availability);
  }
  if (availability.length === 0) return '—';

  return availability
    .map(slot => {
      // Handle both plain objects and objects with _id
      if (slot && typeof slot === 'object') {
        const day = slot.day || slot.dayOfWeek || '—';
        const start = slot.startTime || slot.start || '—';
        const end = slot.endTime || slot.end || '—';
        if (day !== '—' && start !== '—' && end !== '—') {
          return `${day} ${start}-${end}`;
        }
      }
      return 'Invalid slot';
    })
    .filter(text => text !== 'Invalid slot') // Remove invalid entries
    .join(', ');
};

const parseAvailabilityToForm = (availability) => {
  if (!availability || !Array.isArray(availability)) {
    return '';
  }
  // Convert array to JSON string for textarea
  return JSON.stringify(availability, null, 2);
};

const parseAvailabilityFromForm = (availabilityArray) => {
  if (!Array.isArray(availabilityArray)) return [];
  return availabilityArray
    .filter(slot => slot.day && slot.startTime && slot.endTime)
    .map(slot => ({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      ...(slot._id && { _id: slot._id })
    }));
};

const DoctorsManagement = ({ doctors, onDoctorsChange }) => {
  const { user } = useAuth();
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [addingDoctor, setAddingDoctor] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    specialty: '', experienceYears: '',
    contactNumber: '', consultationFee: '', availability: []
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      specialty: doctor.specialty || '',
      experienceYears: doctor.experienceYears || '',
      contactNumber: doctor.contactNumber || '',
      consultationFee: doctor.consultationFee || '',
      availability: doctor.availability || [],
      email: '', // Not shown in edit
      password: '' // Not shown in edit
    });
  };

  const handleCancelEdit = () => {
    setEditingDoctor(null);
    setFormData({ firstName: '', lastName: '', specialty: '', experienceYears: '', contactNumber: '', consultationFee: '', availability: [], email: '', password: '' });
  };

  const handleAddClick = () => {
    setAddingDoctor(true);
    setFormData({ firstName: '', lastName: '', specialty: '', experienceYears: '', contactNumber: '', consultationFee: '', availability: [] });
  };

  const handleCancelAdd = () => {
    setAddingDoctor(false);
    setFormData({ firstName: '', lastName: '', specialty: '', experienceYears: '', contactNumber: '', consultationFee: '', availability: [], email: '', password: '' });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      // Generate a unique username from doctor's name
      const generateUsername = () => {
        const base = `${formData.firstName}${formData.lastName}`.replace(/\s+/g, '').toLowerCase();
        const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random suffix
        return `${base}${random}`;
      };

      const username = generateUsername();

      // Register a new user with role 'doctor'
      const registerRes = await authAPI.register({
        username,
        email: formData.email,
        password: formData.password,
        role: 'doctor'
      });

      const userId = registerRes.data.data._id;

      // Create doctor profile with userId
      const createData = {
        userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        specialty: formData.specialty,
        experienceYears: Number(formData.experienceYears),
        contactNumber: formData.contactNumber,
        consultationFee: Number(formData.consultationFee),
        availability: parseAvailabilityFromForm(formData.availability)
      };

      const res = await doctorAPI.create(createData);
      const newDoctor = res.data.data || res.data;
      onDoctorsChange([...doctors, newDoctor]);
      setAddingDoctor(false);
      setFormData({ firstName: '', lastName: '', specialty: '', experienceYears: '', contactNumber: '', consultationFee: '', availability: [], email: '', password: '' });
      alert('Doctor created successfully!');
    } catch (error) {
      console.error('Create failed:', error);
      if (error.response?.data?.message?.includes('User already exists')) {
        alert('A user with that email already exists. Please use a different email.');
      } else {
        alert('Failed to create doctor: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setAdding(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingDoctor) return;
    setSaving(true);
    try {
      const updateData = {
        ...formData,
        experienceYears: formData.experienceYears ? Number(formData.experienceYears) : undefined,
        consultationFee: formData.consultationFee ? Number(formData.consultationFee) : undefined,
        availability: parseAvailabilityFromForm(formData.availability),
      };
      const res = await doctorAPI.update(editingDoctor._id, updateData);
      const updatedDoctor = res.data.data || res.data;
      onDoctorsChange(doctors.map(d => d._id === editingDoctor._id ? updatedDoctor : d));
      setEditingDoctor(null);
      alert('Doctor updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update doctor: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (doctorId) => {
    setDeleteConfirmId(doctorId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      await doctorAPI.delete(deleteConfirmId);
      onDoctorsChange(doctors.filter(d => d._id !== deleteConfirmId));
      setDeleteConfirmId(null);
      alert('Doctor deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete doctor: ' + (error.response?.data?.message || error.message));
    } finally {
      setDeleting(false);
    }
  };

  if (doctors.length === 0) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 text-xl font-bold">Doctors Management</h2>
            <p className="text-gray-500 text-sm mt-0.5">View and manage all doctors</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Icon path={icons.user} size={16} />
            Add Doctor
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-gray-300 flex justify-center mb-4"><Icon path={icons.user} size={40} /></div>
          <p className="text-gray-600 text-sm font-medium">No doctors registered</p>
          <p className="text-gray-400 text-xs mt-1">Click "Add Doctor" to create the first doctor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-xl font-bold">Doctors Management</h2>
          <p className="text-gray-500 text-sm mt-0.5">View and manage all doctors</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          <Icon path={icons.user} size={16} />
          Add Doctor
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Specialty</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Experience</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Contact</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Fee</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Availability</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doc => (
                <tr key={doc._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">Dr. {doc.firstName} {doc.lastName}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{doc.specialty}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.experienceYears || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.contactNumber || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">${doc.consultationFee || '0'}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={formatAvailability(doc.availability)}>
                    {formatAvailability(doc.availability)}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="text-xs px-2.5 py-1 border border-gray-200 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(doc._id)}
                      className="text-xs px-2.5 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(editingDoctor || addingDoctor) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{addingDoctor ? 'Add Doctor' : 'Edit Doctor'}</h3>
              <button onClick={addingDoctor ? handleCancelAdd : handleCancelEdit} className="text-gray-400 hover:text-gray-600">
                <Icon path={icons.x} size={18} />
              </button>
            </div>
            <form onSubmit={addingDoctor ? handleAdd : handleSave} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                    required
                  />
                </div>
              </div>
              {addingDoctor && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                      required
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Specialty</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Contact Number</label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Availability</label>
                <div className="space-y-2">
                  {formData.availability.map((slot, index) => (
                    <div key={slot._id || index} className="flex gap-2 items-center">
                      <select
                        value={slot.day}
                        onChange={(e) => {
                          const newAvail = [...formData.availability];
                          newAvail[index].day = e.target.value;
                          setFormData({...formData, availability: newAvail});
                        }}
                        className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                      >
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => {
                          const newAvail = [...formData.availability];
                          newAvail[index].startTime = e.target.value;
                          setFormData({...formData, availability: newAvail});
                        }}
                        className="w-32 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => {
                          const newAvail = [...formData.availability];
                          newAvail[index].endTime = e.target.value;
                          setFormData({...formData, availability: newAvail});
                        }}
                        className="w-32 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newAvail = formData.availability.filter((_, i) => i !== index);
                          setFormData({...formData, availability: newAvail});
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Remove slot"
                      >
                        <Icon path={icons.trash} size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        availability: [...formData.availability, { day: '', startTime: '', endTime: '' }]
                      });
                    }}
                    className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors text-sm font-medium"
                  >
                    + Add Availability Slot
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Add time slots when the doctor is available for appointments.</p>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={addingDoctor ? handleCancelAdd : handleCancelEdit}
                  className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingDoctor ? adding : saving}
                  className={`flex-1 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 ${
                    addingDoctor ? 'bg-blue-600' : 'bg-green-600'
                  }`}
                >
                  {(addingDoctor ? adding : saving)
                    ? (addingDoctor ? 'Adding...' : 'Saving...')
                    : (addingDoctor ? 'Add Doctor' : 'Save Changes')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <button onClick={() => setDeleteConfirmId(null)} className="text-gray-400 hover:text-gray-600">
                <Icon path={icons.x} size={18} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete this doctor? This action cannot be undone.
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsManagement;
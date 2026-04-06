import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientAPI, authAPI } from '../../services/api';

const Icon = ({ path, size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const icons = {
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
  x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  plus: <><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></>,
};

const formatMedicalHistory = (medicalHistory) => {
  if (!medicalHistory || !Array.isArray(medicalHistory) || medicalHistory.length === 0) {
    return '—';
  }
  return medicalHistory.slice(0, 2).join(', ') + (medicalHistory.length > 2 ? '...' : '');
};

const PatientsManagement = ({ patients, onPatientsChange }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [editingPatient, setEditingPatient] = useState(null);
  const [addingPatient, setAddingPatient] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    medicalHistory: '',
    userId: ''
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name || '',
      age: patient.age?.toString() || '',
      gender: patient.gender || '',
      medicalHistory: Array.isArray(patient.medicalHistory) ? patient.medicalHistory.join('\n') : '',
      userId: patient.userId || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingPatient(null);
    setFormData({ name: '', age: '', gender: '', medicalHistory: '', userId: '' });
  };

  const handleAddClick = () => {
    console.log('Add Patient button clicked!');
    setAddingPatient(true);
    setFormData({ name: '', email: '', password: '', age: '', gender: '', medicalHistory: '', userId: '' });
  };

  const handleCancelAdd = () => {
    setAddingPatient(false);
    setFormData({ name: '', email: '', password: '', age: '', gender: '', medicalHistory: '', userId: '' });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      // 1. Create user account via auth service
      const username = formData.name.trim();
      const email = formData.email.trim();
      const password = formData.password;

      if (!email || !password) {
        alert('Email and password are required for patient login');
        setAdding(false);
        return;
      }

      const userRes = await authAPI.register({
        username,
        email,
        password,
        role: 'patient'
      });

      const newUser = userRes.data.data || userRes.data;
      const userId = newUser._id || newUser.id;

      // 2. Create patient profile
      const medicalHistoryArray = formData.medicalHistory
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== '');

      const patientData = {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        medicalHistory: medicalHistoryArray,
        userId: userId
      };

      const res = await patientAPI.create(patientData);
      const newPatient = res.data.data || res.data;
      onPatientsChange([...patients, newPatient]);
      setAddingPatient(false);
      setFormData({ name: '', email: '', password: '', age: '', gender: '', medicalHistory: '', userId: '' });
      alert(`Patient account created!\n\nEmail: ${email}\nPassword: ${password}\n\nPatient can now login.`);
    } catch (error) {
      console.error('Create failed:', error);
      alert('Failed to create patient: ' + (error.response?.data?.message || error.message));
    } finally {
      setAdding(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingPatient) return;
    setSaving(true);
    try {
      const medicalHistoryArray = formData.medicalHistory
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== '');

      const updateData = {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        medicalHistory: medicalHistoryArray
        // NOTE: userId is NEVER included here - it's immutable once set
      };

      const res = await patientAPI.update(editingPatient._id, updateData);
      const updatedPatient = res.data.data || res.data;
      onPatientsChange(patients.map(p => p._id === editingPatient._id ? updatedPatient : p));
      setEditingPatient(null);
      alert('Patient updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update patient: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (patientId) => {
    setDeleteConfirmId(patientId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      await patientAPI.delete(deleteConfirmId);
      onPatientsChange(patients.filter(p => p._id !== deleteConfirmId));
      setDeleteConfirmId(null);
      alert('Patient deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete patient: ' + (error.response?.data?.message || error.message));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-xl font-bold">Patients Management</h2>
          <p className="text-gray-500 text-sm mt-0.5">View and manage all patients</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          <Icon path={icons.user} size={16} />
          Add Patient
        </button>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-gray-300 flex justify-center mb-4"><Icon path={icons.user} size={40} /></div>
          <p className="text-gray-600 text-sm font-medium">No patients registered</p>
          <p className="text-gray-400 text-xs mt-1">Click "Add Patient" to create the first patient</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Age</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Gender</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Medical History</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{patient.name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{patient.age || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{patient.gender || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={formatMedicalHistory(patient.medicalHistory)}>
                      {formatMedicalHistory(patient.medicalHistory)}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(patient)}
                        className="text-xs px-2.5 py-1 border border-gray-200 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(patient._id)}
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
      )}

      {/* Add/Edit Modal */}
      {(editingPatient || addingPatient) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{addingPatient ? 'Add Patient' : 'Edit Patient'}</h3>
              <button onClick={addingPatient ? handleCancelAdd : handleCancelEdit} className="text-gray-400 hover:text-gray-600">
                <Icon path={icons.x} size={18} />
              </button>
            </div>
            <form onSubmit={addingPatient ? handleAdd : handleSave} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              {addingPatient ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      placeholder="patient@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      placeholder="At least 6 characters"
                      required
                      minLength="6"
                    />
                  </div>
                </>
              ) : (
                isAdmin && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <label className="block text-xs font-medium text-gray-500 mb-1">User ID (immutable)</label>
                    <p className="text-sm font-mono text-gray-700 break-all">{formData.userId || 'N/A'}</p>
                    <p className="text-xs text-red-600 mt-1">⚠️ User ID is permanent and cannot be modified</p>
                  </div>
                )
              )}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Medical History (one per line)</label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                  rows={4}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-y"
                  placeholder="Allergies&#10;Chronic conditions&#10;Previous surgeries"
                />
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={addingPatient ? handleCancelAdd : handleCancelEdit}
                  className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingPatient ? adding : saving}
                  className={`flex-1 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 ${
                    addingPatient ? 'bg-blue-600' : 'bg-green-600'
                  }`}
                >
                  {(addingPatient ? adding : saving)
                    ? (addingPatient ? 'Adding...' : 'Saving...')
                    : (addingPatient ? 'Add Patient' : 'Save Changes')
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
                Are you sure you want to delete this patient? This action cannot be undone.
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

export default PatientsManagement;

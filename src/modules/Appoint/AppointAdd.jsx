import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import appointApi from '../../api/appointApi';
import staffApi from '../../api/staffApi';
import visitorApi from '../../api/visitorApi';

function AppointAdd() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ visitorId:'', staffId:'', appointmentDate:'', purpose:'', status:0, changeBy:1 });
  const [staff, setStaff] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([staffApi.getAll(), visitorApi.getAll()])
      .then(([sRes, vRes]) => {
        setStaff(sRes.data.data || sRes.data || []);
        setVisitors(vRes.data.data || vRes.data || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.visitorId) errs.visitorId = 'Visitor is required';
    if (!form.staffId) errs.staffId = 'Staff member is required';
    if (!form.appointmentDate) errs.appointmentDate = 'Appointment date is required';
    if (!form.purpose) errs.purpose = 'Purpose is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      await appointApi.create({ ...form, visitorId: +form.visitorId, staffId: +form.staffId });
      navigate('/appoint');
    } catch (err) {
      alert(`Failed to create appointment: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Appointment</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Visitor *</label>
          <select name="visitorId" value={form.visitorId} onChange={handleChange} disabled={isSubmitting}
            className={`w-full p-2 border rounded ${errors.visitorId ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Select a visitor</option>
            {visitors.map(v => <option key={v.id} value={v.id}>{v.firstName} {v.lastName} — {v.company || v.email}</option>)}
          </select>
          {errors.visitorId && <p className="text-red-500 text-xs mt-1">{errors.visitorId}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Host Staff *</label>
          <select name="staffId" value={form.staffId} onChange={handleChange} disabled={isSubmitting}
            className={`w-full p-2 border rounded ${errors.staffId ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Select a staff member</option>
            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {errors.staffId && <p className="text-red-500 text-xs mt-1">{errors.staffId}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Appointment Date *</label>
          <Input type="datetime-local" name="appointmentDate" value={form.appointmentDate}
            onChange={handleChange} disabled={isSubmitting}
            className={errors.appointmentDate ? 'border-red-500' : ''} />
          {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Purpose *</label>
          <textarea name="purpose" value={form.purpose} onChange={handleChange} rows="3"
            disabled={isSubmitting}
            className={`w-full p-2 border rounded ${errors.purpose ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="outline" onClick={() => navigate('/appoint')} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Appointment'}</Button>
        </div>
      </form>
    </div>
  );
}
export default AppointAdd;

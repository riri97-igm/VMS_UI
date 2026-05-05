import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import appointApi from '../../api/appointApi';
import staffApi from '../../api/staffApi';
import visitorApi from '../../api/visitorApi';

const STATUS_OPTIONS = [
  { value:0, label:'Pending' }, { value:1, label:'Approved' },
  { value:2, label:'Completed' }, { value:3, label:'Rejected' }, { value:4, label:'Cancelled' },
];

function AppointEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [staff, setStaff] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
  Promise.all([appointApi.getById(id), staffApi.getAll(), visitorApi.getAll()])
    .then(([aRes, sRes, vRes]) => {
      const a = aRes.data.data || aRes.data;
      setForm({
        visitorId: a.visitor?.id || a.visitorId || '',
        staffId: a.staff?.id || a.staffId || '',
        purpose: a.purpose || '',
        appointmentDate: a.appointmentDate?.slice(0, 16) || '',
        status: a.status ?? 0,
      });
      setStaff(sRes.data.data || sRes.data || []);
      setVisitors(vRes.data.data || vRes.data || []);
    })
    .catch(() => setError('Failed to load data.'));
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setSaving(true);

    const payload = {
      id: +id,
      visitorId: +form.visitorId,
      staffId: +form.staffId,
      purpose: form.purpose,
      appointmentDate: form.appointmentDate,
      status: +form.status,
      changeBy: 1,
    };

    await appointApi.update(id, payload);
    navigate('/appoint');
  } catch (err) {
    setError(`Failed to save: ${err.message}`);
  } finally {
    setSaving(false);
  }
};
  if (!form) return <div className="flex justify-center items-center h-64">{error || 'Loading...'}</div>;

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Appointment</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Visitor *</label>
          <select name="visitorId" value={form.visitorId} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded">
            {visitors.map(v => <option key={v.id} value={v.id}>{v.firstName} {v.lastName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Host Staff *</label>
          <select name="staffId" value={form.staffId} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded">
            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Date & Time *</label>
          <Input type="datetime-local" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Purpose *</label>
          <textarea name="purpose" value={form.purpose} onChange={handleChange} rows="3"
            className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded">
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1">Changing to Approved or Rejected will email the visitor automatically.</p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="outline" onClick={() => navigate('/appoint')} disabled={saving}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Appointment'}</Button>
        </div>
      </form>
    </div>
  );
}
export default AppointEdit;

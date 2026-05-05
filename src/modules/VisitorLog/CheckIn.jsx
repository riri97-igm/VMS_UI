import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import visitorLogApi from '../../api/visitorLogApi';
import visitorApi from '../../api/visitorApi';
import staffApi from '../../api/staffApi';
import appointApi from '../../api/appointApi';

function CheckIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ visitorId:'', staffId:'', appointmentId:'', remarks:'', changedBy:1 });
  const [visitors, setVisitors] = useState([]);
  const [staff, setStaff] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([visitorApi.getAll(), staffApi.getAll(), appointApi.getAll()])
      .then(([vRes, sRes, aRes]) => {
        setVisitors(vRes.data.data || vRes.data || []);
        setStaff(sRes.data.data || sRes.data || []);
        const allAppts = aRes.data.data || aRes.data || [];
        setAppointments(allAppts.filter(a => a.status === 1 || a.status === 'Approved'));
      }).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    // Auto-fill staff from appointment
    if (name === 'appointmentId' && value) {
      const appt = appointments.find(a => a.id === +value);
      if (appt) updated.staffId = appt.staffId;
    }
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await visitorLogApi.checkIn({
        visitorId: +form.visitorId,
        staffId: +form.staffId,
        appointmentId: form.appointmentId ? +form.appointmentId : 0,
        checkInTime: new Date().toISOString(),
        remarks: form.remarks,
        changedBy: 1,
      });
      navigate('/visitor-log');
    } catch (err) {
      setError(`Check-in failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Check In Visitor</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Visitor *</label>
          <select name="visitorId" value={form.visitorId} onChange={handleChange} required
            className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select visitor...</option>
            {visitors.map(v => <option key={v.id} value={v.id}>{v.firstName} {v.lastName} — {v.company || v.email}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Pre-booked Appointment (optional)</label>
          <select name="appointmentId" value={form.appointmentId} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded">
            <option value="">Walk-in (no appointment)</option>
            {appointments.map(a => <option key={a.id} value={a.id}>Appt #{a.id} — {a.purpose}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Host Staff *</label>
          <select name="staffId" value={form.staffId} onChange={handleChange} required
            className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select staff...</option>
            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks</label>
          <Input type="text" name="remarks" value={form.remarks} onChange={handleChange} placeholder="Optional notes..." />
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded p-3 text-sm text-blue-700">
          ✉️ The host staff will receive an email notification when you click Check In.
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
            {saving ? 'Checking in...' : '✓ Check In'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/visitor-log')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
export default CheckIn;

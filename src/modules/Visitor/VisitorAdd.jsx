import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import visitorApi from '../../api/visitorApi';

const FIELDS = [
  { name:'firstName', label:'First Name', required:true },
  { name:'lastName',  label:'Last Name',  required:true },
  { name:'email',     label:'Email',      required:true, type:'email' },
  { name:'phone',     label:'Phone',      required:true },
  { name:'address',   label:'Address' },
  { name:'company',   label:'Company' },
  { name:'identificationNumber', label:'ID / Passport Number' },
];

function VisitorAdd() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', address:'', company:'', identificationNumber:'', changeBy:1 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await visitorApi.create(form);
      navigate('/visitor');
    } catch (err) {
      setError(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Visitor</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        {FIELDS.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}{f.required && ' *'}</label>
            <Input type={f.type || 'text'} value={form[f.name]} required={f.required}
              onChange={e => setForm({ ...form, [f.name]: e.target.value })} />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
            {saving ? 'Saving...' : 'Save Visitor'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/visitor')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
export default VisitorAdd;

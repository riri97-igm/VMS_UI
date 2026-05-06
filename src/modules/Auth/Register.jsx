import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import loginApi from '../../api/loginApi';
import departmentApi from '../../api/departmentApi';
import roleApi from '../../api/roleApi';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:         '',
    email:        '',
    phone:        '',
    password:     '',
    confirmPassword: '',
    departmentId: '',
    roleId:       '',
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles]             = useState([]);
  const [errors, setErrors]           = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading]     = useState(true);
  const [successMsg, setSuccessMsg]   = useState('');

  useEffect(() => {
    Promise.all([departmentApi.getAll(), roleApi.getAll()])
      .then(([dRes, rRes]) => {
        setDepartments(dRes.data.data || dRes.data || []);
        setRoles(rRes.data.data || rRes.data || []);
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
    if (!form.name.trim())         errs.name         = 'Name is required';
    if (!form.email.trim())        errs.email        = 'Email is required';
    if (!form.phone.trim())        errs.phone        = 'Phone is required';
    if (!form.password)            errs.password     = 'Password is required';
    if (form.password.length < 6)  errs.password     = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
                                   errs.confirmPassword = 'Passwords do not match';
    if (!form.departmentId)        errs.departmentId = 'Department is required';
    if (!form.roleId)              errs.roleId       = 'Role is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email))
      errs.email = 'Enter a valid email address';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      await loginApi.register({
        name:         form.name.trim(),
        email:        form.email.trim(),
        phone:        form.phone.trim(),
        password:     form.password,
        departmentId: parseInt(form.departmentId, 10),
        roleId:       parseInt(form.roleId, 10),
      });
      setSuccessMsg(`Account for "${form.name}" created successfully!`);
      // Reset form
      setForm({ name:'', email:'', phone:'', password:'', confirmPassword:'', departmentId:'', roleId:'' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to register account.';
      setErrors({ submit: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Register New Account</h1>
        <Button variant="outline" onClick={() => navigate('/staff')}>Back to Staff</Button>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          ✅ {successMsg}
          <button className="ml-3 text-green-600 underline text-xs" onClick={() => setSuccessMsg('')}>
            Register another
          </button>
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          ❌ {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">

        {/* Name */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Full Name *</label>
          <Input name="name" value={form.name} onChange={handleChange}
            placeholder="Enter full name" disabled={isSubmitting}
            className={errors.name ? 'border-red-500' : ''} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Email *</label>
          <Input name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="Enter email address" disabled={isSubmitting}
            className={errors.email ? 'border-red-500' : ''} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Phone *</label>
          <Input name="phone" type="tel" value={form.phone} onChange={handleChange}
            placeholder="Enter phone number" disabled={isSubmitting}
            className={errors.phone ? 'border-red-500' : ''} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Department + Role side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Department *</label>
            <select name="departmentId" value={form.departmentId} onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full p-2 border rounded ${errors.departmentId ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Select department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {errors.departmentId && <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Role *</label>
            <select name="roleId" value={form.roleId} onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full p-2 border rounded ${errors.roleId ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Select role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            {errors.roleId && <p className="text-red-500 text-xs mt-1">{errors.roleId}</p>}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Password *</label>
          <Input name="password" type="password" value={form.password} onChange={handleChange}
            placeholder="Min. 6 characters" disabled={isSubmitting}
            className={errors.password ? 'border-red-500' : ''} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">Confirm Password *</label>
          <Input name="confirmPassword" type="password" value={form.confirmPassword}
            onChange={handleChange} placeholder="Re-enter password" disabled={isSubmitting}
            className={errors.confirmPassword ? 'border-red-500' : ''} />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="outline" onClick={() => navigate('/staff')} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Register;
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import staffApi from '../../api/staffApi';
import departmentApi from '../../api/departmentApi';
import roleApi from '../../api/roleApi';

function StaffEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name:        '',
    email:       '',
    phone:       '',
    departmetId: '',
    roleId:      '',
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles]             = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors]           = useState({});
  const [error, setError]             = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [deptRes, staffRes, roleRes] = await Promise.all([
          departmentApi.getAll(),
          staffApi.getById(id),
          roleApi.getAll(),
        ]);

        const departmentsData = deptRes.data.data || deptRes.data;
        if (Array.isArray(departmentsData)) setDepartments(departmentsData);

        const rolesData = roleRes.data.data || roleRes.data;
        if (Array.isArray(rolesData)) setRoles(rolesData);

        const s = staffRes.data.data || staffRes.data;
        if (s && s.id) {
          setFormData({
            name:        s.name        || '',
            email:       s.email       || '',
            phone:       s.phone       || '',
            departmetId: s.departmetId || s.departmentId || s.DepartmetId || '',
            roleId:      s.roleId      || s.RoleId       || '',
          });
        } else {
          setError('Received unexpected data format from the server.');
        }
      } catch (err) {
        setError(`Failed to load data: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())  errs.name        = 'Staff name is required';
    if (!formData.email.trim()) errs.email        = 'Email is required';
    if (!formData.phone.trim()) errs.phone        = 'Phone number is required';
    if (!formData.departmetId)  errs.departmetId  = 'Department is required';
    if (!formData.roleId)       errs.roleId       = 'Role is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email))
      errs.email = 'Please enter a valid email address';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      const payload = {
        id:          parseInt(id, 10),
        name:        formData.name.trim(),
        email:       formData.email.trim(),
        phone:       formData.phone.replace(/[^\d]/g, ''),
        departmetId: parseInt(formData.departmetId, 10),
        roleId:      parseInt(formData.roleId, 10),
      };
      await staffApi.update(id, payload);
      navigate('/staff');
    } catch (err) {
      console.error('Error updating staff:', err);
      alert(err.response?.data?.message || 'Failed to update staff. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  if (error) return (
    <div className="text-red-500 text-center p-4">
      {error}
      <div className="mt-4">
        <Button onClick={() => navigate('/staff')}>Back to Staff</Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Staff</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Staff Name *</label>
          <Input name="name" value={formData.name} onChange={handleChange}
            placeholder="Enter staff name" disabled={isSubmitting}
            className={errors.name ? 'border-red-500' : ''} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Email *</label>
          <Input name="email" type="email" value={formData.email} onChange={handleChange}
            placeholder="Enter email address" disabled={isSubmitting}
            className={errors.email ? 'border-red-500' : ''} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number *</label>
          <Input name="phone" type="tel" value={formData.phone} onChange={handleChange}
            placeholder="Enter phone number" disabled={isSubmitting}
            className={errors.phone ? 'border-red-500' : ''} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Department *</label>
          <select
            name="departmetId"
            value={formData.departmetId}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full p-2 border rounded ${errors.departmetId ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select a department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {errors.departmetId && <p className="text-red-500 text-xs mt-1">{errors.departmetId}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Role *</label>
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full p-2 border rounded ${errors.roleId ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select a role</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          {errors.roleId && <p className="text-red-500 text-xs mt-1">{errors.roleId}</p>}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="outline" onClick={() => navigate('/staff')} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Staff'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StaffEdit;
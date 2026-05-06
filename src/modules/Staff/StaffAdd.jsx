import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import departmentApi from '../../api/departmentApi';
import staffApi from '../../api/staffApi';

function StaffAdd() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: '',  // ← corrected key to match API
    roleId: 1,
  });

  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  useEffect(() => {
    departmentApi.getAll()
      .then(res => {
        const data = res.data.data || res.data;
        if (Array.isArray(data)) setDepartments(data);
      })
      .catch(console.error)
      .finally(() => setIsLoadingDepartments(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim())       newErrors.name = 'Staff name is required';
    if (!formData.email.trim())      newErrors.email = 'Email is required';
    if (!formData.phone.trim())      newErrors.phone = 'Phone number is required';
    if (!formData.departmentId)       newErrors.departmentId = 'Department is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email))
      newErrors.email = 'Please enter a valid email address';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      const staffData = {
        name:        formData.name.trim(),
        email:       formData.email.trim(),
        phone:       formData.phone.replace(/[^\d]/g, ''),
        departmentId: parseInt(formData.departmentId, 10), // ← correct key sent to API
        roleId:      parseInt(formData.roleId, 10),
      };
      await staffApi.create(staffData);
      navigate('/staff');
    } catch (err) {
      console.error('Error creating staff:', err);
      alert(err.response?.data?.message || 'Failed to create staff. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Staff</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Staff Name *</label>
          <Input name="name" value={formData.name} onChange={handleChange}
            placeholder="Enter staff name" disabled={isSubmitting}
            className={errors.name ? 'border-red-500' : ''} />
          {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email *</label>
          <Input name="email" type="email" value={formData.email} onChange={handleChange}
            placeholder="Enter email address" disabled={isSubmitting}
            className={errors.email ? 'border-red-500' : ''} />
          {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number *</label>
          <Input name="phone" type="tel" value={formData.phone} onChange={handleChange}
            placeholder="Enter phone number" disabled={isSubmitting}
            className={errors.phone ? 'border-red-500' : ''} />
          {errors.phone && <p className="text-red-500 text-xs italic mt-1">{errors.phone}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Department *</label>
          <select
            name="departmentId"
            value={formData.departmetId}
            onChange={handleChange}
            disabled={isSubmitting || isLoadingDepartments}
            className={`w-full p-2 border rounded ${errors.departmetId ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select a department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          {errors.departmetId && <p className="text-red-500 text-xs italic mt-1">{errors.departmetId}</p>}
        </div>

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => navigate('/staff')} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Staff'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StaffAdd;
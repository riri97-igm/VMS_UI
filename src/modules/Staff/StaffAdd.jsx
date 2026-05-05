import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import departmentApi from '../../api/departmentApi';
import staffApi from '../../api/staffApi'; // Switch back to direct API call for debugging

function StaffAdd() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: ''
  });
  
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  
  // Fetch departments for dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentApi.getAll();
        const departmentsData = response.data.data || response.data;
        
        if (Array.isArray(departmentsData)) {
          setDepartments(departmentsData);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Staff name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Basic phone validation - make it less strict
    const phoneRegex = /^\d{7,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (7-15 digits)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare the data - ensure departmentId is properly formatted as a number
      const staffData = {
        ...formData,
        departmentId: formData.departmentId ? parseInt(formData.departmentId, 10) : null,
        phone: formData.phone.replace(/[^\d]/g, '') // Clean phone number
      };
      
      const response = await staffApi.create(staffData);
      
      if (response.data) {
        navigate('/staff');
      } else {
        throw new Error('Failed to create staff');
      }
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
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Staff Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'border-red-500' : ''}
            placeholder="Enter staff name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'border-red-500' : ''}
            placeholder="Enter email address"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'border-red-500' : ''}
            placeholder="Enter phone number"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs italic mt-1">{errors.phone}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="departmentId" className="block text-gray-700 text-sm font-bold mb-2">
            Department
          </label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.departmentId ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isSubmitting || isLoadingDepartments}
          >
            <option value="">Select a department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="text-red-500 text-xs italic mt-1">{errors.departmentId}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/staff')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Staff'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StaffAdd;
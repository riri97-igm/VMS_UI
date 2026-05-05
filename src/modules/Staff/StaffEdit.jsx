import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import staffApi from '../../api/staffApi';
import departmentApi from '../../api/departmentApi';

function StaffEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', // Added phone field
    departmentId: ''
    // Removed roleId field
  });
  
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch staff data and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch departments
        const deptResponse = await departmentApi.getAll();
        const departmentsData = deptResponse.data.data || deptResponse.data;
        
        if (Array.isArray(departmentsData)) {
          setDepartments(departmentsData);
        }
        
        // Fetch staff by ID
        const staffResponse = await staffApi.getById(id);
        const staffData = staffResponse.data.data || staffResponse.data;
        
        if (staffData && staffData.id) {
          setFormData(staffData);
        } else {
          console.error('Unexpected data format:', staffData);
          setError("Received unexpected data format from the server.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to load data: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Prepare the data
      const staffData = {
        ...formData,
        departmentId: formData.departmentId ? parseInt(formData.departmentId, 10) : null,
        phone: formData.phone.replace(/[^\d]/g, '') // Clean phone number
      };
      
      const response = await staffApi.update(id, staffData);
      
      if (response.data) {
        navigate('/staff');
      } else {
        throw new Error('Failed to update staff');
      }
    } catch (err) {
      console.error('Error updating staff:', err);
      alert(err.response?.data?.message || 'Failed to update staff. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
        <div className="mt-4">
          <Button onClick={() => navigate('/staff')}>
            Back to Staff
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Staff</h1>
      
      <form onSubmit={handleSubmit} className="bg-card shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Staff Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter staff name"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            disabled={isSubmitting}
          />
        </div>
        
        {/* Added Phone field */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="departmentId" className="block text-sm font-medium mb-2">
            Department
          </label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className="w-full p-2 border rounded border-gray-300"
            disabled={isSubmitting}
          >
            <option value="">Select a department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
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
            {isSubmitting ? 'Updating...' : 'Update Staff'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StaffEdit;
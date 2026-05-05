import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import departmentApi from '../../api/departmentApi';
import staffApi from '../../api/staffApi'; // Import staffApi to get staff for ChangedBy dropdown

function DepartmentAdd() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    changedBy: '' // Added changedBy field
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staff, setStaff] = useState([]); // Added state for staff list
  const [isLoadingStaff, setIsLoadingStaff] = useState(true); // Added loading state for staff
  
  // Fetch staff for ChangedBy dropdown
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffApi.getAll();
        const staffData = response.data.data || response.data;
        
        if (Array.isArray(staffData)) {
          setStaff(staffData);
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
      } finally {
        setIsLoadingStaff(false);
      }
    };

    fetchStaff();
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
    if (!formData.name.trim()) newErrors.name = 'Department name is required';
    if (!formData.changedBy) newErrors.changedBy = 'Changed by is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      console.log("Submitting department data:", formData);
      const response = await departmentApi.create(formData);
      console.log("API Response:", response);
      navigate('/department');
    } catch (err) {
      console.error("Error creating department:", err);
      
      // More detailed error message
      let errorMessage = "Failed to create department. Please try again.";
      if (err.response) {
        console.log("Error response:", err.response);
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Department</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Department Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'border-red-500' : ''}
            placeholder="Enter department name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
          )}
        </div>
        
        {/* Added ChangedBy field */}
        <div className="mb-4">
          <label htmlFor="changedBy" className="block text-gray-700 text-sm font-bold mb-2">
            Changed By
          </label>
          <select
            id="changedBy"
            name="changedBy"
            value={formData.changedBy}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.changedBy ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isSubmitting || isLoadingStaff}
          >
            <option value="">Select a staff member</option>
            {staff.map(staffMember => (
              <option key={staffMember.id} value={staffMember.id}>
                {staffMember.name}
              </option>
            ))}
          </select>
          {errors.changedBy && (
            <p className="text-red-500 text-xs italic mt-1">{errors.changedBy}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/department')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Department'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default DepartmentAdd;
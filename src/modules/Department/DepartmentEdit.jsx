import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import departmentApi from '../../api/departmentApi';
import staffApi from '../../api/staffApi'; // Import staffApi to get staff for ChangedBy dropdown

function DepartmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    changedBy: '' // Added changedBy field
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [staff, setStaff] = useState([]); // Added state for staff list
  const [isLoadingStaff, setIsLoadingStaff] = useState(true); // Added loading state for staff
  
  // Fetch department data and staff list
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch staff for ChangedBy dropdown
        const staffResponse = await staffApi.getAll();
        const staffData = staffResponse.data.data || staffResponse.data;
        
        if (Array.isArray(staffData)) {
          setStaff(staffData);
        }
        setIsLoadingStaff(false);
        
        // Fetch department by ID
        const response = await departmentApi.getById(id);
        console.log('Department data response:', response);
        
        const departmentData = response.data.data || response.data;
        
        if (departmentData && departmentData.id) {
          setFormData(departmentData);
        } else {
          console.error('Unexpected data format:', departmentData);
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
      await departmentApi.update(id, formData);
      navigate('/department');
    } catch (err) {
      console.error("Error updating department:", err);
      alert("Failed to update department. Please try again.");
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
          <Button onClick={() => navigate('/department')}>
            Back to Departments
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Department</h1>
      
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
            placeholder="Enter department name"
            disabled={isSubmitting}
          />
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
            className="w-full p-2 border rounded border-gray-300"
            disabled={isSubmitting || isLoadingStaff}
          >
            <option value="">Select staff</option>
            {staff.map(staffMember => (
              <option key={staffMember.id} value={staffMember.id}>
                {staffMember.name}
              </option>
            ))}
          </select>
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
            {isSubmitting ? 'Updating...' : 'Update Department'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default DepartmentEdit;
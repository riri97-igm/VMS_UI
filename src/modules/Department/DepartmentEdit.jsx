import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';

function DepartmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch department data based on ID
  useEffect(() => {
    // Mock data for demonstration
    const mockDepartments = [
      { id: 1, name: 'Human Resources', code: 'HR' },
      { id: 2, name: 'Information Technology', code: 'IT' },
      { id: 3, name: 'Finance', code: 'FIN' }
    ];
    
    const department = mockDepartments.find(dept => dept.id === parseInt(id));
    
    if (department) {
      setFormData(department);
      setIsLoading(false);
    } else {
      navigate('/department');
    }
  }, [id, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would send this data to an API
    console.log('Updating department data:', formData);
    
    // Redirect back to department list
    navigate('/department');
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Department</h1>
      
      <form onSubmit={handleSubmit} className="bg-card shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Department Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter department name"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="code" className="block text-sm font-medium mb-2">
            Department Code
          </label>
          <Input
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter department code"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/department')}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
          >
            Update Department
          </Button>
        </div>
      </form>
    </div>
  );
}

export default DepartmentEdit;
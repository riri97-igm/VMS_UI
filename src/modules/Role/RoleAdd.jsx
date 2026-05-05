import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import roleApi from '../../api/roleApi';

function RoleAdd() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '' // Add description field
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Role name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Remove the commented-out duplicate validate function
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      await roleApi.create(formData);
      navigate('/role');
    } catch (err) {
      console.error("Error creating role:", err);
      alert("Failed to create role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Role</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Role Name"
            error={errors.name}
          />
        </div>

        <div>
          <Input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Role Description"
            error={errors.description}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/role')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Role'}
        </Button>
        </div>
      </form>
    </div>
  );
}

export default RoleAdd;
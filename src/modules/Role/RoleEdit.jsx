import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../button';
import { Input } from '../../input';
import roleApi from '../../api/roleApi';

function RoleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '' // Add description field
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRole = async () => {
      try {
        setIsLoading(true);
        const response = await roleApi.getById(id);
        const roleData = response.data.data || response.data;
        
        if (roleData && roleData.id) {
          setFormData(roleData);
        } else {
          setError("Received unexpected data format from the server.");
        }
      } catch (err) {
        console.error("Error fetching role:", err);
        setError(`Failed to load role: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
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
      await roleApi.update(id, formData);
      navigate('/role');
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role. Please try again.");
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
          <Button onClick={() => navigate('/role')}>
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Role</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Role Name"
          />
        </div>

        <div>
          <Input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Role Description"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}

export default RoleEdit;
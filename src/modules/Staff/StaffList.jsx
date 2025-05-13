import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash, Plus } from 'lucide-react';
import { Button } from '../../button';
import staffApi from '../../api/staffApi';

function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch staff from API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const response = await staffApi.getAll();
        console.log('API Response:', response);
        
        // Check if the response data is in the expected format
        const staffData = response.data.data || response.data;
        
        if (Array.isArray(staffData)) {
          setStaff(staffData);
        } else {
          console.error('Unexpected data format:', staffData);
          setError("Received unexpected data format from the server.");
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
        setError(`Failed to load staff: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffApi.delete(id);
        setStaff(staff.filter(s => s.id !== id));
      } catch (err) {
        console.error("Error deleting staff:", err);
        alert(`Failed to delete staff: ${err.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading staff...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>{error}</p>
        <Button 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Staff</h1>
        <Link to="/staff/add">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            <Plus size={16} className="mr-2" />
            Add Staff
          </Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.length > 0 ? (
              staff.map((staffMember) => (
                <tr key={staffMember.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{staffMember.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{staffMember.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{staffMember.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{staffMember.departmentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/staff/edit/${staffMember.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Pencil size={16} />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(staffMember.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No staff found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffList;
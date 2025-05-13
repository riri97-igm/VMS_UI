import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash, Plus } from 'lucide-react';
import { Button } from '../../button';
import departmentApi from '../../api/departmentApi';
import staffApi from '../../api/staffApi'; // Import staffApi to get staff names

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffMap, setStaffMap] = useState({}); // Map staff IDs to names

  // Fetch departments and staff from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch staff to map IDs to names
        const staffResponse = await staffApi.getAll();
        const staffData = staffResponse.data.data || staffResponse.data;
        
        if (Array.isArray(staffData)) {
          const staffMapping = {};
          staffData.forEach(staff => {
            staffMapping[staff.id] = staff.name;
          });
          setStaffMap(staffMapping);
        }
        
        // Fetch departments
        const deptResponse = await departmentApi.getAll();
        console.log('API Response:', deptResponse);
        
        const departmentsData = deptResponse.data.data || deptResponse.data;
        
        if (Array.isArray(departmentsData)) {
          setDepartments(departmentsData);
        } else {
          console.error('Unexpected data format:', departmentsData);
          setError("Received unexpected data format from the server.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to load data: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentApi.delete(id);
        setDepartments(departments.filter(dept => dept.id !== id));
      } catch (err) {
        console.error("Error deleting department:", err);
        alert(`Failed to delete department: ${err.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading departments...</div>;
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
        <h1 className="text-2xl font-bold">Departments</h1>
        <Link to="/department/add">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            <Plus size={16} className="mr-2" />
            Add Department
          </Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Changed By</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.length > 0 ? (
              departments.map((department) => (
                <tr key={department.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{department.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staffMap[department.changedBy] || `Staff ID: ${department.changedBy}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/department/edit/${department.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Pencil size={16} />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(department.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No departments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DepartmentList;
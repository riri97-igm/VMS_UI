import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash, Plus } from 'lucide-react';
import { Button } from '../../button';
import appointApi from '../../api/appointApi';

const STATUS_LABEL = { 0:'Pending', 1:'Approved', 2:'Completed', 3:'Rejected', 4:'Cancelled' };
const STATUS_COLOR = {
  0:'bg-yellow-100 text-yellow-800', Pending:'bg-yellow-100 text-yellow-800',
  1:'bg-green-100 text-green-800',   Approved:'bg-green-100 text-green-800',
  2:'bg-blue-100 text-blue-800',     Completed:'bg-blue-100 text-blue-800',
  3:'bg-red-100 text-red-800',       Rejected:'bg-red-100 text-red-800',
  4:'bg-gray-100 text-gray-600',     Cancelled:'bg-gray-100 text-gray-600',
};

function AppointList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await appointApi.getAll();
        setAppointments(res.data.data || res.data || []);
      } catch (err) {
        setError(`Failed to load appointments: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await appointApi.delete(id);
      setAppointments(appointments.filter(a => a.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading appointments...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Link to="/appoint/add">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            <Plus size={16} className="mr-2" /> Add Appointment
          </Button>
        </Link>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Visitor','Staff','Purpose','Date','Status','Actions'].map(h => (
                <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${h==='Actions'?'text-right':'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.length > 0 ? appointments.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">{a.visitorName || `#${a.visitorId}`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{a.staffName || `#${a.staffId}`}</td>
                <td className="px-6 py-4 text-sm max-w-xs truncate">{a.purpose}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(a.appointmentDate).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[a.status] || STATUS_COLOR[0]}`}>
                    {typeof a.status === 'number' ? STATUS_LABEL[a.status] : a.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link to={`/appoint/edit/${a.id}`}>
                    <Button variant="outline" size="sm" className="mr-2"><Pencil size={16} /></Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(a.id)}>
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No appointments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default AppointList;

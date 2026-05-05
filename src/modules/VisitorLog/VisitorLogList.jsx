import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, Trash } from 'lucide-react';
import { Button } from '../../button';
import visitorLogApi from '../../api/visitorLogApi';

function VisitorLogList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayOnly, setTodayOnly] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = todayOnly ? await visitorLogApi.getToday() : await visitorLogApi.getAll();
      setLogs(res.data.data || res.data || []);
    } catch (err) {
      setError(`Failed to load logs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [todayOnly]);

  const handleCheckOut = async (id) => {
    const remarks = window.prompt('Check-out remarks (optional):');
    try {
      await visitorLogApi.checkOut(id, remarks || null);
      fetchLogs();
    } catch (err) {
      alert(`Check-out failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this log entry?')) return;
    try {
      await visitorLogApi.delete(id);
      setLogs(logs.filter(l => l.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading visitor logs...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Visitor Log</h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={todayOnly} onChange={e => setTodayOnly(e.target.checked)} className="w-4 h-4" />
            Today only
          </label>
          <Link to="/visitor-log/checkin">
            <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center">
              <LogIn size={16} className="mr-2" /> Check In
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Visitor','Host Staff','Check In','Check Out','Remarks','Actions'].map(h => (
                <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${h==='Actions'?'text-right':'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.length > 0 ? logs.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-sm">{l.visitor?.firstName} {l.visitor?.lastName}</div>
                  <div className="text-xs text-gray-400">{l.visitor?.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{l.staff?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(l.checkInTime).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {l.checkOutTime
                    ? new Date(l.checkOutTime).toLocaleString()
                    : <span className="text-yellow-600 font-medium">Still inside</span>}
                </td>
                <td className="px-6 py-4 text-sm max-w-xs truncate">{l.remarks || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  {!l.checkOutTime && (
                    <Button variant="outline" size="sm" className="text-green-600 border-green-300" onClick={() => handleCheckOut(l.id)}>
                      <LogOut size={16} />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(l.id)}>
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No visitor logs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default VisitorLogList;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash, Plus, Building2 } from 'lucide-react';
import { Button } from '../../button';
import appointApi from '../../api/appointApi';
import departmentApi from '../../api/departmentApi';
import staffApi from '../../api/staffApi';
import visitorApi from '../../api/visitorApi';

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
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [visitorList, setVisitorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDeptId, setFilterDeptId] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, dRes, sRes, vRes] = await Promise.all([
          appointApi.getAll(),
          departmentApi.getAll(),
          staffApi.getAll(),
          visitorApi.getAll(),
        ]);
        setAppointments(aRes.data.data || aRes.data || []);
        setDepartments(dRes.data.data || dRes.data || []);
        setStaffList(sRes.data.data || sRes.data || []);
        setVisitorList(vRes.data.data || vRes.data || []);
      } catch (err) {
        setError(`Failed to load appointments: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    load();
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

  // Build lookup maps
  const staffMap = {};
  staffList.forEach(s => { staffMap[s.id] = s; });

  const visitorMap = {};
  visitorList.forEach(v => { visitorMap[v.id] = v; });

  const staffDeptMap = {};
  staffList.forEach(s => {
    staffDeptMap[s.id] = {
      deptId:   s.departmetId || s.departmentId,
      deptName: s.departmentName || '—',
    };
  });

  // Resolve names from lookup maps if nested objects are missing
  const enriched = appointments.map(a => {
  const staffId   = a.staffId   || a.staff?.id;
  const visitorId = a.visitorId || a.visitor?.id;

  const staffObj   = staffMap[staffId]     || {};
  const visitorObj = visitorMap[visitorId] || {};

  const staffName = a.staff?.name
                 || staffObj.name
                 || '—';

  // Handle all possible casings + missing visitor
  const getVisitorName = () => {
    const v = a.visitor || visitorObj;
    if (!v || (!v.firstName && !v.FirstName && !v.id)) return '(Deleted Visitor)';
    const first = v.firstName || v.FirstName || '';
    const last  = v.lastName  || v.LastName  || '';
    return `${first} ${last}`.trim() || `Visitor #${visitorId}`;
  };

  const info     = staffDeptMap[staffId] || {};
  const deptName = a.staff?.departmentName || info.deptName || '—';
  const deptId   = a.staff?.departmetId || a.staff?.departmentId || info.deptId || null;

  return {
    ...a,
    _staffName:   staffName,
    _visitorName: getVisitorName(),
    _deptName:    deptName,
    _deptId:      deptId,
  };
});

  const filtered = filterDeptId
    ? enriched.filter(a => String(a._deptId) === String(filterDeptId))
    : enriched;

  if (loading) return <div className="flex justify-center items-center h-64">Loading appointments...</div>;
  if (error)   return <div className="text-red-500 text-center p-4">{error}</div>;

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

      {/* Department filter */}
      <div className="mb-4 flex items-center gap-3">
        <Building2 size={18} className="text-gray-500" />
        <label className="text-sm font-medium text-gray-600">Filter by Department:</label>
        <select
          value={filterDeptId}
          onChange={e => setFilterDeptId(e.target.value)}
          className="p-2 border border-gray-300 rounded text-sm min-w-[200px]"
        >
          <option value="">All Departments</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        {filterDeptId && (
          <button onClick={() => setFilterDeptId('')} className="text-xs text-blue-500 hover:underline">
            Clear
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Visitor','Staff','Department','Purpose','Date','Status','Actions'].map(h => (
                <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${h==='Actions'?'text-right':'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length > 0 ? filtered.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{a._visitorName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{a._staffName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                    <Building2 size={11} />{a._deptName}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm max-w-xs truncate">{a.purpose}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(a.appointmentDate).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}</td>
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
              <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                No appointments found{filterDeptId ? ' for this department' : ''}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default AppointList;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, Trash, Building2, CalendarDays, Calendar, UserCheck } from 'lucide-react';
import { Button } from '../../button';
import visitorLogApi from '../../api/visitorLogApi';
import departmentApi from '../../api/departmentApi';
import staffApi from '../../api/staffApi';

function VisitorLogList() {
  const [logs, setLogs]             = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [todayOnly, setTodayOnly]   = useState(true);
  const [filterDeptId, setFilterDeptId] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState(''); // '' | 'walkin' | 'appointment'

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

  useEffect(() => {
    fetchLogs();
    Promise.all([departmentApi.getAll(), staffApi.getAll()])
      .then(([dRes, sRes]) => {
        setDepartments(dRes.data.data || dRes.data || []);
        setStaffList(sRes.data.data || sRes.data || []);
      })
      .catch(console.error);
  }, [todayOnly]);

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

  // staffId → department lookup
  const staffDeptMap = {};
  staffList.forEach(s => {
    staffDeptMap[s.id] = {
      deptId:   s.departmetId || s.departmentId,
      deptName: s.departmentName || '—',
    };
  });

  const enriched = logs.map(l => {
    const staffId = l.staffId || l.staff?.id;
    const info    = staffDeptMap[staffId] || {};
    const isWalkin = !l.appointmentId;
    return {
      ...l,
      _deptName: l.staff?.departmentName || info.deptName || '—',
      _deptId:   l.staff?.departmetId || l.staff?.departmentId || info.deptId || null,
      _isWalkin: isWalkin,
    };
  });

  // Apply filters
  const filtered = enriched.filter(l => {
    if (filterDeptId && String(l._deptId) !== String(filterDeptId)) return false;
    if (filterDate && new Date(l.checkInTime).toISOString().slice(0, 10) !== filterDate) return false;
    if (filterType === 'walkin' && !l._isWalkin) return false;
    if (filterType === 'appointment' && l._isWalkin) return false;
    return true;
  });

  const clearFilters = () => { setFilterDeptId(''); setFilterDate(''); setFilterType(''); };
  const hasFilters   = filterDeptId || filterDate || filterType;

  if (loading) return <div className="flex justify-center items-center h-64">Loading visitor logs...</div>;
  if (error)   return <div className="text-red-500 text-center p-4">{error}</div>;

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

      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        {/* Type filter */}
        <div className="flex items-center gap-2">
          <UserCheck size={16} className="text-gray-500" />
          <label className="text-sm font-medium text-gray-600">Type:</label>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="p-1.5 border border-gray-300 rounded text-sm"
          >
            <option value="">All Types</option>
            <option value="appointment">Appointment</option>
            <option value="walkin">Walk-in</option>
          </select>
        </div>

        {/* Department filter */}
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-gray-500" />
          <label className="text-sm font-medium text-gray-600">Department:</label>
          <select
            value={filterDeptId}
            onChange={e => setFilterDeptId(e.target.value)}
            className="p-1.5 border border-gray-300 rounded text-sm min-w-[160px]"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-gray-500" />
          <label className="text-sm font-medium text-gray-600">Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="p-1.5 border border-gray-300 rounded text-sm"
          />
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-blue-500 hover:underline">
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Type','Visitor','Host Staff','Department','Check In','Check Out','Remarks','Actions'].map(h => (
                <th key={h} className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase ${h==='Actions'?'text-right':'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length > 0 ? filtered.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">

                {/* Type badge */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {l._isWalkin ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-medium">
                      <UserCheck size={11} /> Walk-in
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                      <Calendar size={11} /> Appointment
                    </span>
                  )}
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="font-medium text-sm">{l.visitor?.firstName} {l.visitor?.lastName}</div>
                  <div className="text-xs text-gray-400">{l.visitor?.company}</div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-sm">{l.staff?.name}</td>

                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                    <Building2 size={11} />{l._deptName}
                  </span>
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {new Date(l.checkInTime).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {l.checkOutTime
                    ? new Date(l.checkOutTime).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
                    : <span className="text-yellow-600 font-medium">Still inside</span>}
                </td>

                <td className="px-4 py-4 text-sm max-w-xs truncate">{l.remarks || '-'}</td>

                <td className="px-4 py-4 whitespace-nowrap text-right space-x-2">
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
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No visitor logs found{hasFilters ? ' for the selected filters' : ''}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VisitorLogList;
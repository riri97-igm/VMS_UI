import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Building2, Users, Calendar, Clock, TrendingUp, UserCheck } from 'lucide-react';
import { Button } from '../../button';
import reportApi from '../../api/reportApi';

const COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#8b5cf6','#14b8a6','#f97316'];

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className={`bg-white rounded-xl shadow p-4 flex items-center gap-4 border-l-4 ${color}`}>
      <div className={`p-3 rounded-full ${color.replace('border-','bg-').replace('-500','-100')}`}>
        <Icon size={20} className={color.replace('border-','text-')} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{value ?? '—'}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function ReportPage() {
  const today     = new Date().toISOString().slice(0, 10);
  const thirtyAgo = new Date(Date.now() - 365 * 86400000).toISOString().slice(0, 10);

  const [from, setFrom]       = useState(thirtyAgo);
  const [to, setTo]           = useState(today);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reportApi.getSummary(from, to);
      setData(res.data);
    } catch (err) {
      setError(`Failed to load report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  const visitTypePie = data ? [
    { name: 'Walk-in',     value: data.walkIns },
    { name: 'Appointment', value: data.withAppointment },
  ] : [];

  return (
    <div className="container mx-auto space-y-6">

      {/* Header + date filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex items-center gap-3 bg-white shadow-sm border border-gray-100 rounded-lg p-3">
          <Calendar size={16} className="text-gray-400" />
          <label className="text-sm text-gray-600">From:</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)}
            className="p-1.5 border border-gray-300 rounded text-sm" />
          <label className="text-sm text-gray-600">To:</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)}
            className="p-1.5 border border-gray-300 rounded text-sm" />
          <Button onClick={fetchReport} disabled={loading} className="px-4 py-1.5 text-sm">
            {loading ? 'Loading...' : 'Apply'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</div>
      )}

      {loading && !data && (
        <div className="flex justify-center items-center h-64">Loading report...</div>
      )}

      {data && (
        <>
          {/* Summary stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}     label="Total Visits"
              value={data.totalVisits}
              color="border-blue-500"
              sub={`${data.walkIns} walk-in · ${data.withAppointment} appt`}
            />
            <StatCard
              icon={Calendar}  label="Total Appointments"
              value={data.totalAppointments}
              color="border-purple-500"
            />
            <StatCard
              icon={UserCheck} label="Currently Inside"
              value={data.currentlyInside}
              color="border-green-500"
            />
            <StatCard
              icon={Clock}     label="Avg Visit Duration"
              value={`${data.avgVisitMinutes} min`}
              color="border-orange-500"
            />
          </div>

          {/* Row 1: Visitors per day + Visit type pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Visitors per day */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" /> Visitors Per Day
              </h2>
              {data.visitorsPerDay.length === 0
                ? <p className="text-gray-400 text-sm text-center py-8">No data for this period</p>
                : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.visitorsPerDay}>
                      <XAxis dataKey="date" tick={{ fontSize: 11 }}
                        tickFormatter={d => new Date(d).toLocaleDateString('en-SG', { month:'short', day:'numeric' })} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip
                        labelFormatter={d => new Date(d).toLocaleDateString('en-SG', { weekday:'short', month:'short', day:'numeric' })}
                        formatter={v => [v, 'Visitors']}
                      />
                      <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
            </div>

            {/* Walk-in vs Appointment */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <UserCheck size={16} className="text-teal-500" /> Visit Type Breakdown
              </h2>
              {visitTypePie.every(d => d.value === 0)
                ? <p className="text-gray-400 text-sm text-center py-8">No visit data</p>
                : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={visitTypePie} cx="50%" cy="50%" outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                      >
                        {visitTypePie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={v => [v, 'Visits']} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
            </div>
          </div>

          {/* Row 2: Visits by department + Appointments by status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Visits by department */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Building2 size={16} className="text-indigo-500" /> Visits by Department
              </h2>
              {data.visitsByDepartment.length === 0
                ? <p className="text-gray-400 text-sm text-center py-8">No data</p>
                : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.visitsByDepartment} layout="vertical">
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="department" tick={{ fontSize: 11 }} width={120} />
                      <Tooltip formatter={v => [v, 'Visits']} />
                      <Bar dataKey="count" radius={[0,4,4,0]}>
                        {data.visitsByDepartment.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
            </div>

            {/* Appointments by status */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-purple-500" /> Appointments by Status
              </h2>
              {data.appointmentsByStatus.length === 0
                ? <p className="text-gray-400 text-sm text-center py-8">No appointment data</p>
                : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={data.appointmentsByStatus.map(a => ({ name: a.status, value: a.count }))}
                        cx="50%" cy="50%" outerRadius={80} dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                      >
                        {data.appointmentsByStatus.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={v => [v, 'Appointments']} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
            </div>
          </div>

          {/* Top 5 most visited staff */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Users size={16} className="text-green-500" /> Top 5 Most Visited Staff
            </h2>
            {data.topStaff.length === 0
              ? <p className="text-gray-400 text-sm">No data available</p>
              : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b text-xs uppercase">
                      <th className="pb-2 pr-4">Rank</th>
                      <th className="pb-2 pr-4">Staff Name</th>
                      <th className="pb-2">Total Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topStaff.map((s, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 pr-4">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold ${
                            i === 0 ? 'bg-yellow-400' :
                            i === 1 ? 'bg-gray-400'   :
                            i === 2 ? 'bg-amber-600'  : 'bg-gray-200 text-gray-600'
                          }`}>{i + 1}</span>
                        </td>
                        <td className="py-2 pr-4 font-medium">{s.staff}</td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[120px]">
                              <div className="bg-indigo-500 h-2 rounded-full"
                                style={{ width: `${(s.count / data.topStaff[0].count) * 100}%` }} />
                            </div>
                            <span className="font-semibold text-indigo-600">{s.count}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </>
      )}
    </div>
  );
}

export default ReportPage;
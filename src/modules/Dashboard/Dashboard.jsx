import { useState, useEffect } from 'react';
import { Users, Calendar, LogIn, CheckCircle } from 'lucide-react';
import appointApi from '../../api/appointApi';
import visitorApi from '../../api/visitorApi';
import visitorLogApi from '../../api/visitorLogApi';

const STATUS_COLOR = {
  0:'bg-yellow-100 text-yellow-800', 1:'bg-green-100 text-green-800',
  2:'bg-blue-100 text-blue-800',     3:'bg-red-100 text-red-800',
  4:'bg-gray-100 text-gray-600',
  Pending:'bg-yellow-100 text-yellow-800',  Approved:'bg-green-100 text-green-800',
  Completed:'bg-blue-100 text-blue-800',    Rejected:'bg-red-100 text-red-800',
  Cancelled:'bg-gray-100 text-gray-600',
};
const STATUS_LABEL = { 0:'Pending', 1:'Approved', 2:'Completed', 3:'Rejected', 4:'Cancelled' };

const getVisitorName = (a) => {
  if (a.visitor) {
    const first = a.visitor.firstName || a.visitor.FirstName || '';
    const last  = a.visitor.lastName  || a.visitor.LastName  || '';
    const full  = `${first} ${last}`.trim();
    if (full) return full;
  }
  return a.visitorName || `Visitor #${a.visitorId}`;
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`bg-white rounded-xl shadow p-5 flex items-center gap-4 border-l-4 ${color}`}>
      <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
        <Icon size={22} className={color.replace('border-', 'text-')} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold">{value ?? '—'}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats]               = useState(null);
  const [visitorCount, setVisitorCount] = useState(null);
  const [todayLogs, setTodayLogs]       = useState([]);
  const [recentAppts, setRecentAppts]   = useState([]);
  const [recentWalkins, setRecentWalkins] = useState([]);

  useEffect(() => {
    appointApi.getStats()
      .then(r => setStats(r.data))
      .catch(() => {});

    visitorApi.getAll()
      .then(r => setVisitorCount((r.data.data || r.data || []).length))
      .catch(() => {});

    visitorLogApi.getToday()
      .then(r => setTodayLogs(r.data.data || r.data || []))
      .catch(() => {});

    // Recent appointments — sorted newest first, top 5
    appointApi.getAll()
      .then(r => {
        const all = r.data.data || r.data || [];
        const sorted = [...all].sort((a, b) =>
          new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        setRecentAppts(sorted.slice(0, 5));
      })
      .catch(() => {});

    // Recent walk-ins — only logs with no linked appointment, top 5
    visitorLogApi.getAll()
      .then(r => {
        const all = r.data.data || r.data || [];
        const walkins = all
          .filter(l => !l.appointmentId)
          .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime))
          .slice(0, 5);
        setRecentWalkins(walkins);
      })
      .catch(() => {});
  }, []);

  const activeVisitors = todayLogs.filter(l => !l.checkOutTime).length;

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}       label="Total Visitors"     value={visitorCount}     color="border-blue-500" />
        <StatCard icon={Calendar}    label="Total Appointments" value={stats?.total}     color="border-purple-500" />
        <StatCard icon={LogIn}       label="Visitors Today"     value={todayLogs.length} color="border-green-500" />
        <StatCard icon={CheckCircle} label="Currently Inside"   value={activeVisitors}   color="border-orange-500" />
      </div>

      {/* Appointment Breakdown */}
      {stats && (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Appointment Breakdown</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label:'Pending',   val:stats.pending,   cls:'border-yellow-200 bg-yellow-50' },
              { label:'Approved',  val:stats.approved,  cls:'border-green-200 bg-green-50' },
              { label:'Completed', val:stats.completed, cls:'border-blue-200 bg-blue-50' },
              { label:'Rejected',  val:stats.rejected,  cls:'border-red-200 bg-red-50' },
            ].map(s => (
              <div key={s.label} className={`rounded-lg border p-4 text-center ${s.cls}`}>
                <p className="text-2xl font-bold">{s.val}</p>
                <p className="text-sm text-gray-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Visitors + Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Today's Check-ins */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Today's Visitors ({todayLogs.length})</h2>
          {todayLogs.length === 0
            ? <p className="text-gray-400 text-sm">No visitors checked in today.</p>
            : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2 pr-3">Visitor</th>
                    <th className="pb-2 pr-3">Host</th>
                    <th className="pb-2 pr-3">Check In</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayLogs.map(l => (
                    <tr key={l.id} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-medium">
                        {l.visitor?.firstName} {l.visitor?.lastName}
                      </td>
                      <td className="py-2 pr-3">{l.staff?.name}</td>
                      <td className="py-2 pr-3">
                        {new Date(l.checkInTime).toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore' })}
                      </td>
                      <td className="py-2">
                        {l.checkOutTime
                          ? <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">Out</span>
                          : <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Inside</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-1">Recent Appointments</h2>
          <p className="text-xs text-gray-400 mb-4">Latest 5 scheduled appointments</p>
          {recentAppts.length === 0
            ? <p className="text-gray-400 text-sm">No appointments yet.</p>
            : (
              <div className="space-y-2">
                {recentAppts.map(a => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-sm truncate">{getVisitorName(a)}</p>
                      <p className="text-xs text-gray-400 truncate">
                        → {a.staff?.name || '—'} &bull; {a.purpose}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs text-gray-400">
                        {new Date(a.appointmentDate).toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore' })}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[a.status] || 'bg-gray-100'}`}>
                        {typeof a.status === 'number' ? STATUS_LABEL[a.status] : a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Recent Walk-ins — separate section below */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-1">Recent Walk-ins</h2>
        <p className="text-xs text-gray-400 mb-4">Latest 5 unplanned visits (no appointment)</p>
        {recentWalkins.length === 0
          ? <p className="text-gray-400 text-sm">No walk-in visits recorded.</p>
          : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 pr-4">Visitor</th>
                  <th className="pb-2 pr-4">Host Staff</th>
                  <th className="pb-2 pr-4">Department</th>
                  <th className="pb-2 pr-4">Check In</th>
                  <th className="pb-2 pr-4">Check Out</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentWalkins.map(l => (
                  <tr key={l.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">
                      <div>{l.visitor?.firstName} {l.visitor?.lastName}</div>
                      <div className="text-xs text-gray-400">{l.visitor?.company}</div>
                    </td>
                    <td className="py-2 pr-4">{l.staff?.name || '—'}</td>
                    <td className="py-2 pr-4 text-xs text-indigo-600">{l.staff?.departmentName || '—'}</td>
                    <td className="py-2 pr-4">
                      {new Date(l.checkInTime).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}
                    </td>
                    <td className="py-2 pr-4">
                      {l.checkOutTime
                        ? new Date(l.checkOutTime).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
                        : <span className="text-yellow-600 font-medium">Still inside</span>}
                    </td>
                    <td className="py-2">
                      {l.checkOutTime
                        ? <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">Completed</span>
                        : <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Inside</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

    </div>
  );
}

export default Dashboard;
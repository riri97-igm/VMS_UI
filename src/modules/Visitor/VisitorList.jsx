import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash, Plus } from 'lucide-react';
import { Button } from '../../button';
import visitorApi from '../../api/visitorApi';

function VisitorList() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await visitorApi.getAll();
        setVisitors(res.data.data || res.data || []);
      } catch (err) {
        setError(`Failed to load visitors: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this visitor?')) return;
    try {
      await visitorApi.delete(id);
      setVisitors(visitors.filter(v => v.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const filtered = visitors.filter(v =>
    `${v.firstName} ${v.lastName} ${v.email} ${v.company || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-64">Loading visitors...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Visitors</h1>
        <Link to="/visitor/add">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            <Plus size={16} className="mr-2" /> Add Visitor
          </Button>
        </Link>
      </div>
      <div className="mb-3">
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          placeholder="Search by name, email or company..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Name','Email','Phone','Company','ID Number','Actions'].map(h => (
                <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length > 0 ? filtered.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{v.firstName} {v.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{v.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{v.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{v.company || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{v.identificationNumber || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link to={`/visitor/edit/${v.id}`}>
                    <Button variant="outline" size="sm" className="mr-2"><Pencil size={16} /></Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(v.id)}>
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No visitors found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default VisitorList;

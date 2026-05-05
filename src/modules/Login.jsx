import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../button';
import { Input } from '../input';
import loginApi from '../api/loginApi';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const response = await loginApi.login(formData);
    const user = response.data;
    localStorage.setItem('vms_user', JSON.stringify(user));
    localStorage.setItem('token', user.token);
    navigate('/dashboard');
  } catch (err) {
    setError('Invalid email or password');
  } finally {
    setIsSubmitting(false);
  }
};

  const getUser = () => JSON.parse(localStorage.getItem('vms_user') || '{}');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 mb-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">VMS System</h2>
          <p className="text-gray-500 text-sm">Visitor Management System</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-1">Email</label>
          <Input id="email" name="email" type="email" value={formData.email}
            onChange={handleChange} required disabled={isSubmitting} placeholder="you@vms.com" />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-1">Password</label>
          <Input id="password" name="password" type="password" value={formData.password}
            onChange={handleChange} required disabled={isSubmitting} placeholder="••••••••" />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>

        {/* Demo accounts */}
        <div className="mt-5 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-600 mb-1">Demo accounts:</p>
          <p>🔑 Admin: <code>admin@vms.com</code> / <code>Admin@123</code></p>
          <p>📋 Reception: <code>sarah@vms.com</code> / <code>Reception@123</code></p>
          <p>👤 Staff: <code>alice@vms.com</code> / <code>Staff@123</code></p>
        </div>
      </form>
    </div>
  );
}

export default Login;

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { changePassword, clearError } from '../features/auth/authSlice';
import { selectAuthLoading, selectAuthError } from '../features/auth/selectors';
import { validatePassword } from '../utils/validators';
import toast from 'react-hot-toast';
import { ArrowRight, ChevronLeft, Lock } from 'lucide-react';

function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (error) {
      toast.error(error.error || 'Password change failed');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.message);
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const result = await dispatch(changePassword({
      old_password: formData.oldPassword,
      new_password: formData.newPassword,
    }));
    
    if (!result.error) {
      toast.success('Password changed successfully');
      setFormData({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
      });
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden h-[85vh]">
        
        {/* Left Side - Image & Branding (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop" 
            alt="Men's Suit Detail" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10 flex flex-col justify-between p-12 h-full text-white">
             <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">SHOP.CO</h1>
             </div>
             <div className="max-w-md">
                <p className="text-2xl font-light leading-relaxed">
                  "Clothes mean nothing until someone lives in them."
                </p>
                <p className="mt-4 text-sm font-bold uppercase tracking-widest opacity-70">— Marc Jacobs</p>
             </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative bg-white">
          <div className="max-w-md w-full">
            
            <Link to="/profile" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-6 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Profile
            </Link>

            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Change Password</h2>
              <p className="text-gray-500">Ensure your account stays secure with a strong password.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div>
                <label htmlFor="oldPassword" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Current Password
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  required
                  className="w-full border-b-2 border-gray-200 py-3 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                  placeholder="••••••••"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="newPassword" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  className="w-full border-b-2 border-gray-200 py-3 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirmNewPassword" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  required
                  className="w-full border-b-2 border-gray-200 py-3 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                  placeholder="••••••••"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 shadow-lg"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                    {!loading && <Lock className="w-4 h-4" />}
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;

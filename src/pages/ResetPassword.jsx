import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { resetPassword, clearError } from '../features/auth/authSlice';
import { selectAuthLoading, selectAuthError } from '../features/auth/selectors';
import { validatePassword } from '../utils/validators';
import toast from 'react-hot-toast';
import { ArrowRight, Check } from 'lucide-react';

function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const stateEmail = location.state?.email;
  const stateOtp = location.state?.otp;

  // Extract query params (if link is like /reset-password?email=...&otp=...)
  const initialEmail = stateEmail || searchParams.get('email') || '';
  const initialOtp = stateOtp || searchParams.get('otp') || '';

  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [formData, setFormData] = useState({
    email: initialEmail,
    otp: initialOtp,
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (error) {
      toast.error(error.error || 'Reset failed');
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
      toast.error('Passwords do not match');
      return;
    }

    const result = await dispatch(resetPassword({
      email: formData.email,
      otp: formData.otp,
      new_password: formData.newPassword,
    }));

    if (!result.error) {
      toast.success('Password has been reset successfully');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden h-[85vh]">
        
        {/* Left Side - Image & Branding (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1770&auto=format&fit=crop" 
            alt="Men's Watch Detail" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10 flex flex-col justify-between p-12 h-full text-white">
             <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">SHOP.CO</h1>
             </div>
             <div className="max-w-md">
                <p className="text-2xl font-light leading-relaxed">
                  "Fashion is about dressing according to what’s fashionable. Style is more about being yourself."
                </p>
                <p className="mt-4 text-sm font-bold uppercase tracking-widest opacity-70">— Oscar de la Renta</p>
             </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative bg-white">
          <div className="max-w-md w-full">
            
            <div className="mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Reset Password</h2>
              <p className="text-gray-500">Create a new, strong password for your account.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              
               {/* Show Email and OTP only if NOT provided via state (e.g. direct link access) */}
               {!stateEmail && (
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full border-b-2 border-gray-200 py-3 text-lg font-medium focus:outline-none focus:border-black transition-colors"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                    />
                  </div>
               )}
               {!stateOtp && (
                  <div>
                    <label htmlFor="otp" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">OTP / Code</label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      className="w-full border-b-2 border-gray-200 py-3 text-lg font-medium focus:outline-none focus:border-black transition-colors"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter verification code"
                    />
                  </div>
               )}

              <div>
                <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  className="w-full border-b-2 border-gray-200 py-3 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  required
                  className="w-full border-b-2 border-gray-200 py-3 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent"
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
                    {loading ? 'Reseting...' : 'Reset Password'}
                    {!loading && <Check className="w-5 h-5" />}
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

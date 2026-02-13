import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { forgotPassword, clearError } from '../features/auth/authSlice';
import { selectAuthLoading, selectAuthError } from '../features/auth/selectors';
import { isValidEmail } from '../utils/validators';
import toast from 'react-hot-toast';
import { ArrowRight, ChevronLeft } from 'lucide-react';

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(error.error || 'Request failed');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const result = await dispatch(forgotPassword({ email }));
    
    if (!result.error) {
      toast.success('OTP sent to your email');
      navigate('/verify-otp', { state: { email } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden h-[85vh]">
        
        {/* Left Side - Image & Branding (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1512353087810-25dfcd100962?q=80&w=1974&auto=format&fit=crop" 
            alt="Men's Minimalist Style" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10 flex flex-col justify-between p-12 h-full text-white">
             <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">SHOP.CO</h1>
             </div>
             <div className="max-w-md">
                <p className="text-2xl font-light leading-relaxed">
                  "Style is a way to say who you are without having to speak."
                </p>
                <p className="mt-4 text-sm font-bold uppercase tracking-widest opacity-70">— Rachel Zoe</p>
             </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative bg-white">
          <div className="max-w-md w-full">
            
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-8 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Login
            </Link>

            <div className="mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Forgot Password?</h2>
              <p className="text-gray-500">Enter your email and we'll send you instructions to reset your password.</p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full border-b-2 border-gray-200 py-3 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 shadow-lg"
                  >
                    {loading ? 'Sending Link...' : 'Send Reset Link'}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

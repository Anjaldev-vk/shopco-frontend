import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { login, clearError } from '../features/auth/authSlice';
import { selectCurrentUser, selectAuthLoading, selectAuthError, selectIsAdmin } from '../features/auth/selectors';
import toast from 'react-hot-toast';
import { ArrowRight, Loader2 } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const currentUser = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const isAdmin = useAppSelector(selectIsAdmin);

  useEffect(() => {
    if (currentUser) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [currentUser, isAdmin, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error.error || 'Login failed');
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
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden h-[85vh]">
        
        {/* Left Side - Image & Branding (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
            alt="Men's Fashion" 
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="relative z-10 flex flex-col justify-between p-12 h-full text-white">
             <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">SHOP.CO</h1>
             </div>
             <div className="max-w-md">
                <p className="text-2xl font-light leading-relaxed">
                  "Fashion is the armor to survive the reality of everyday life."
                </p>
                <p className="mt-4 text-sm font-bold uppercase tracking-widest opacity-70">— Bill Cunningham</p>
             </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
          <div className="max-w-md w-full">
            
            <div className="mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Welcome Back</h2>
              <p className="text-gray-500">Please enter your details to sign in.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full border-b-2 border-gray-200 py-3 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full border-b-2 border-gray-200 py-3 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                 <div className="flex items-center">
                   <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
                   <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                 </div>
                 <Link to="/forgot-password" className="text-sm font-medium text-black hover:underline">
                   Forgot password?
                 </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
              >
                Sign In
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-center mt-8">
                <p className="text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-black hover:underline">
                    Sign up for free
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { signup, verifyOtp, resendOtp, clearError } from '../features/auth/authSlice';
import { selectCurrentUser, selectAuthLoading, selectAuthError } from '../features/auth/selectors';
import { isValidEmail, validatePassword } from '../utils/validators';
import toast from 'react-hot-toast';
import { ArrowRight, Loader2, Mail } from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const currentUser = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error.error || 'Registration failed');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.message);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const result = await dispatch(signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      re_password: formData.confirmPassword,
    }));

    if (!result.error) {
      toast.success('OTP sent to your email!');
      setStep('verify');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const result = await dispatch(verifyOtp({
      email: formData.email,
      otp,
    }));

    if (!result.error) {
      toast.success('Account verified! Please login.');
      navigate('/login');
    }
  };

  const handleResendOtp = async () => {
    const result = await dispatch(resendOtp({ email: formData.email }));
    if (!result.error) {
      toast.success('OTP resent to your email!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden h-[85vh]">
        
        {/* Left Side - Image & Branding (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop" 
            alt="Men's Fashion" 
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

        {/* Right Side - Form Container */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-10 relative">
          <div className="max-w-md w-full">
            
            {step === 'register' ? (
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Create Account</h2>
                  <p className="text-gray-500">Sign up to get started with SHOP.CO.</p>
                </div>

                <form className="space-y-4" onSubmit={handleRegister}>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Full Name</label>
                      <input
                        name="name"
                        type="text"
                        required
                        className="w-full border-b-2 border-gray-200 py-2 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full border-b-2 border-gray-200 py-2 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Password</label>
                      <input
                        name="password"
                        type="password"
                        required
                        className="w-full border-b-2 border-gray-200 py-2 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                        placeholder="Obtuse123"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Confirm Password</label>
                      <input
                        name="confirmPassword"
                        type="password"
                        required
                        className="w-full border-b-2 border-gray-200 py-2 text-lg font-medium focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                        placeholder="Obtuse123"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    Sign Up
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="text-center mt-6">
                    <p className="text-gray-500">
                      Already have an account?{' '}
                      <Link to="/login" className="font-bold text-black hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              // Verify Step
              <>
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="p-3 bg-black rounded-full text-white">
                        <Mail className="w-6 h-6" />
                     </div>
                     <h2 className="text-3xl font-black uppercase tracking-tighter">Check Your Email</h2>
                  </div>
                  <p className="text-gray-500">
                    We've sent a verification code to <span className="font-bold text-black">{formData.email}</span>.
                  </p>
                </div>

                <form className="space-y-8" onSubmit={handleVerifyOtp}>
                  <div>
                    <label htmlFor="otp" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 text-center">
                      Enter Verification Code
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      className="w-full border-2 border-gray-200 py-4 text-center text-3xl font-bold tracking-[1em] rounded-xl focus:outline-none focus:border-black transition-colors bg-transparent"
                      placeholder="000000"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    Verify Account
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-sm font-bold text-gray-400 hover:text-black transition-colors underline mb-4"
                    >
                      Resend Code
                    </button>
                    <br/>
                    <button
                      type="button"
                      onClick={() => setStep('register')}
                      className="text-xs font-bold text-gray-400 hover:text-black transition-colors"
                    >
                      Wrong email? Go back
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

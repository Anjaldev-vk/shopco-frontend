import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight, ChevronLeft } from 'lucide-react';

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState('');

  if (!email) {
    // If no email in state, redirect back to forgot password
    navigate('/forgot-password');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    // Navigate to Reset Password page with email and OTP
    navigate('/reset-password', { state: { email, otp } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden h-[85vh]">
        
        {/* Left Side - Image & Branding (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1506950794625-b44c207b9e73?q=80&w=1770&auto=format&fit=crop" 
            alt="Men's Casual Style" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10 flex flex-col justify-between p-12 h-full text-white">
             <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">SHOP.CO</h1>
             </div>
             <div className="max-w-md">
                <p className="text-2xl font-light leading-relaxed">
                  "Elegance is not standing out, but being remembered."
                </p>
                <p className="mt-4 text-sm font-bold uppercase tracking-widest opacity-70">— Giorgio Armani</p>
             </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative bg-white">
          <div className="max-w-md w-full">
            
            <Link to="/forgot-password" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-8 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
            </Link>

            <div className="mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Verify Code</h2>
              <p className="text-gray-500">
                Please enter the 6-digit code sent to <br/>
                <span className="font-bold text-black">{email}</span>
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="otp" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="w-full border-b-2 border-gray-200 py-3 text-3xl font-black tracking-[0.5em] text-center focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-200"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                      // Only allow numbers and max 6 chars
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length <= 6) setOtp(val);
                  }}
                  maxLength={6}
                />
              </div>

              <div className="space-y-4">
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
                  >
                    Verify Code
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-400">Didn't receive code?</p>
                    <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="mt-1 text-sm font-bold uppercase tracking-widest text-black hover:underline"
                    >
                        Resend Code
                    </button>
                  </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;

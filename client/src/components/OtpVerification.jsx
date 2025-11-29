import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../api';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear any existing errors when user starts typing
    if (error) setError('');

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    // Enhanced validation for empty fields
    if (!otpString || otpString.trim() === '') {
      setError('Please enter the OTP');
      return;
    }
    
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    // Check if OTP contains only digits
    if (!/^\d{6}$/.test(otpString)) {
      setError('OTP must contain only numbers');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const verifyToast = toast.loading('Verifying OTP...');

    try {
      const response = await verifyOtp({ 
        email, 
        otp: otpString 
      });

      if (response.statusCode === 200) {
        // Use the backend message
        const successMessage = response.message || 'OTP verified successfully! Welcome!';
        toast.success(successMessage, {
          id: verifyToast,
        });
        setSuccess(successMessage);
        
        // Store user data in Redux store - include both user object and userId hex string
        dispatch(login({
          user: response.data.user,
          userId: response.data.userId,
          token: response.data.jwt
        }));

        // Navigate to home page
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      
      // Handle different error response structures from backend
      let errorMessage = 'Failed to verify OTP. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        // Handle cases where backend returns plain string error
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || errorMessage;
      }
      
      toast.error(errorMessage, {
        id: verifyToast,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendOtpHandler = async () => {
    if (!canResend) return;
    
    try {
      setError('');
      const loadingToast = toast.loading('Resending OTP...');
      const response = await resendOtp({ email });
      
      // Use backend response message
      const successMessage = response.message || 'OTP resent successfully! Please check your email.';
      toast.success(successMessage, {
        id: loadingToast,
      });
      setSuccess(successMessage);
      setTimer(300); // Reset timer
      setCanResend(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-4 text-center text-sm text-gray-600">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-blue-400">
              {email}
            </span>
            <br />
            {timer > 0 && (
              <span className="text-gray-500">
                Code expires in: <span className="font-medium">{formatTime(timer)}</span>
              </span>
            )}
          </p>
        
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="sr-only">OTP</label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-xl font-semibold bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-900/50 border border-red-500/50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-300">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-green-900/50 border border-green-500/50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-300">
                      {success}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-sm">
                <span className="text-gray-500">Didn't receive the code? </span>
                <button
                  type="button"
                  onClick={resendOtpHandler}
                  disabled={!canResend}
                  className={`font-medium transition-colors ${
                    canResend 
                      ? 'text-blue-400 hover:text-blue-300 cursor-pointer' 
                      : 'text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canResend ? 'Resend OTP' : `Resend in ${formatTime(timer)}`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;

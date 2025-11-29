import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../features/auth/authSlice";
import { Container } from "./index";
import { loginUser } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const dispacth = useDispatch();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let errors = { ...fieldErrors };
    
    switch (name) {
      case 'email':
        if (!value || !value.trim()) {
          errors.email = 'Email is required';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (!value || !value.trim()) {
          errors.password = 'Password is required';
        } else {
          delete errors.password;
        }
        break;
    }
    
    setFieldErrors(errors);
    return !errors[name]; // Return true if this specific field has no errors
  };

  const validateAllFields = () => {
    let errors = {};
    
    // Validate email - only required field check
    if (!email || !email.trim()) {
      errors.email = 'Email is required';
    }
    
    // Validate password - only required field check
    if (!password || !password.trim()) {
      errors.password = 'Password is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields on submit
    const isFormValid = validateAllFields();
    
    if (!isFormValid) {
      return;
    }

    setError(null);
    setLoading(true);

    const loginUserToast = toast.loading("Logging in...");

    try {
      const response = await loginUser({ email, password });

      toast.success(response.message || "Login successful!", {
        id: loginUserToast,
      });

      // Navigate to OTP verification page with email
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      setError(error.response?.data?.message || error.response?.data || "Login failed");

      const errorMessage = error.response?.data?.message || error.response?.data || "Login failed";
      toast.error(errorMessage, {
        id: loginUserToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container>
        <section className="min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-md">
            <div className="card">
              <div className="flex flex-col gap-8">
                <h1 className="text-3xl font-bold transition-colors duration-300 text-gray-900">
                  Sign in to your account
                </h1>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={"email"}
                      className="text-base font-medium transition-colors duration-300 text-gray-700"
                    >
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="example@mail.com"
                      className={`input ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      id={"email"}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateField('email', e.target.value);
                      }}
                      onBlur={() => validateField('email', email)}
                      
                    />
                    {fieldErrors.email && (
                      <span className="text-sm text-red-400">{fieldErrors.email}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="password"
                      className="text-base font-medium transition-colors duration-300 text-gray-700"
                    >
                      Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`input ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                      id={"password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        validateField('password', e.target.value);
                      }}
                      onBlur={() => validateField('password', password)}
                      
                    />
                    {fieldErrors.password && (
                      <span className="text-sm text-red-400">{fieldErrors.password}</span>
                    )}
                  </div>
                  {error && (
                    <div className="rounded-xl border px-4 py-3 transition-colors duration-300 border-red-300 bg-red-50 text-red-700">
                      {error}
                    </div>
                  )}
                  <button
                    className="btn-primary w-full"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-e-blue-700"></div>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                  <p className="text-sm font-light transition-colors duration-300 text-gray-600">
                    Don't have an account yet?{" "}
                    <Link
                      to="/register"
                      className="font-medium transition-colors duration-300 text-blue-600 hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default Login;
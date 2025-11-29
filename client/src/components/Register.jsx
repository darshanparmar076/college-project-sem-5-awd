import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../features/auth/authSlice";
import { Container } from "./index";
import { registerUser } from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const dispacth = useDispatch();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let errors = { ...fieldErrors };
    
    switch (name) {
      case 'name':
        if (!value || !value.trim()) {
          errors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters long';
        } else {
          delete errors.name;
        }
        break;
      case 'email':
        if (!value || !value.trim()) {
          errors.email = 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) {
            errors.email = 'Please enter a valid email address';
          } else {
            delete errors.email;
          }
        }
        break;
      case 'userName':
        if (!value || !value.trim()) {
          errors.userName = 'Username is required';
        } else if (value.trim().length < 3) {
          errors.userName = 'Username must be at least 3 characters long';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) {
          errors.userName = 'Username can only contain letters, numbers, and underscores';
        } else {
          delete errors.userName;
        }
        break;
      case 'password':
        if (!value || !value.trim()) {
          errors.password = 'Password is required';
        } else if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain uppercase, lowercase, and number';
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
    
    // Validate name
    if (!name || !name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    // Validate email
    if (!email || !email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    // Validate username
    if (!userName || !userName.trim()) {
      errors.userName = 'Username is required';
    } else if (userName.trim().length < 3) {
      errors.userName = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(userName.trim())) {
      errors.userName = 'Username can only contain letters, numbers, and underscores';
    }
    
    // Validate password
    if (!password || !password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
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

    setError("");
    setLoading(true);

    const registerUserToast = toast.loading("Registering user...");

    try {
      const response = await registerUser({ name, email, userName, password });

      // Use the actual backend message which includes the email
      const successMessage = response.message || "Registration successful! Please check your email for OTP verification.";
      
      toast.success(successMessage, {
        id: registerUserToast,
      });

      // Navigate to OTP verification page with email
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.response?.data || "Registration failed. Please try again.";
      setError(errorMessage);

      toast.error(errorMessage, {
        id: registerUserToast,
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
                  Create new account
                </h1>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={"name"}
                      className="text-base font-medium text-gray-700"
                    >
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Your Name"
                      className={`input ${fieldErrors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                      id="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        validateField('name', e.target.value);
                      }}
                      onBlur={() => validateField('name', name)}
                      
                    />
                    {fieldErrors.name && (
                      <span className="text-sm text-red-400">{fieldErrors.name}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={"email"}
                      className="text-base font-medium text-gray-700"
                    >
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="example@mail.com"
                      className={`input ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      id="email"
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
                      htmlFor={"userName"}
                      className="text-base font-medium text-gray-700"
                    >
                      Username <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="username123"
                      className={`input ${fieldErrors.userName ? 'border-red-500 focus:ring-red-500' : ''}`}
                      id="userName"
                      value={userName}
                      onChange={(e) => {
                        setuserName(e.target.value);
                        validateField('userName', e.target.value);
                      }}
                      onBlur={() => validateField('userName', userName)}
                      
                    />
                    {fieldErrors.userName && (
                      <span className="text-sm text-red-400">{fieldErrors.userName}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={"password"}
                      className="text-base font-medium text-gray-700"
                    >
                      Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`input ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                      id="password"
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
                  {error ? (
                    <div className="rounded-xl border border-red-500/50 bg-red-900/50 px-4 py-3 text-red-300">
                      {error}
                    </div>
                  ) : null}

                  <button
                    className="btn-primary w-full"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-e-blue-700"></div>
                    ) : (
                      "Register"
                    )}
                  </button>
                  <p className="text-sm text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Log in
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

export default Register;

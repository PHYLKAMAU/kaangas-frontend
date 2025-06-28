import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, getDashboardRoute } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${response.user.first_name}!`);
      
      // Role-based redirection
      const dashboardRoute = getDashboardRoute(response.user.role);
      navigate(dashboardRoute);
      
    } catch (error) {
      // Error is already handled by the interceptor
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-vh-100 gradient-bg d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg card-modern glass-effect">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <Link to="/" className="text-decoration-none">
                    <h2 className="fw-bold text-white mb-3">Kaanagas</h2>
                  </Link>
                  <h4 className="text-white mb-2">Welcome Back</h4>
                  <p className="text-white opacity-75">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-white">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{borderRadius: '12px'}}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-white">Password</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="form-control form-control-lg"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{borderRadius: '12px', paddingRight: '50px'}}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{border: 'none', background: 'none'}}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-lg w-100 fw-medium mb-3"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(45deg, #20B2AA, #FF6347)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '12px'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <LogIn size={20} className="me-2" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-white opacity-75 mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-white fw-medium text-decoration-none">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
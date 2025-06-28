import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState([]);
  const [vendorTypes, setVendorTypes] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    username: '',
    role: '',
    vendor_type: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Fetch registration options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await apiClient.get('/accounts/registration-options/');
        setRoles(response.data.userRoles);
        setVendorTypes(response.data.vendorTypes);
      } catch (error) {
        console.error('Failed to fetch registration options:', error);
        // Fallback data if API fails
        setRoles([
          { value: 'customer', label: 'Customer', description: 'Order gas for home delivery' },
          { value: 'vendor', label: 'Vendor', description: 'Sell gas products and manage inventory' },
          { value: 'rider', label: 'Rider', description: 'Deliver gas orders to customers' }
        ]);
        setVendorTypes([
          { value: 'retailer', label: 'Retailer', description: 'Sell packaged gas cylinders' },
          { value: 'refill_station', label: 'Refill Station', description: 'Refill customer gas cylinders' }
        ]);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission
      const submitData = { ...formData };
      if (formData.role !== 'vendor') {
        delete submitData.vendor_type;
      }

      await register(submitData);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      Object.values(error.response?.data || {}).flat().join(', ') ||
                      'Registration failed';
      toast.error(errorMsg);
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

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-vh-100 gradient-bg d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg card-modern glass-effect">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <Link to="/" className="text-decoration-none">
                    <h2 className="fw-bold text-white mb-3">Kaanagas</h2>
                  </Link>
                  <h4 className="text-white mb-2">Create Account</h4>
                  <p className="text-white opacity-75">Step {step} of 2</p>
                </div>

                {/* Progress Bar */}
                <div className="progress mb-4" style={{height: '4px'}}>
                  <div 
                    className="progress-bar" 
                    style={{
                      width: `${(step / 2) * 100}%`,
                      background: 'linear-gradient(45deg, #20B2AA, #FF6347)'
                    }}
                  ></div>
                </div>

                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <>
                      <div className="row mb-3">
                        <div className="col-6">
                          <label className="form-label text-white">First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            className="form-control"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            style={{borderRadius: '8px'}}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-white">Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            className="form-control"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            style={{borderRadius: '8px'}}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-white">Username</label>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          style={{borderRadius: '8px'}}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-white">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{borderRadius: '8px'}}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-white">Phone Number</label>
                        <input
                          type="tel"
                          name="phone_number"
                          className="form-control"
                          value={formData.phone_number}
                          onChange={handleChange}
                          placeholder="+254712345678"
                          required
                          style={{borderRadius: '8px'}}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn btn-lg w-100 fw-medium"
                        style={{
                          background: 'linear-gradient(45deg, #20B2AA, #FF6347)',
                          border: 'none',
                          color: 'white',
                          borderRadius: '12px'
                        }}
                      >
                        Next Step
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="mb-3">
                        <label className="form-label text-white">Select Your Role</label>
                        <select
                          name="role"
                          className="form-select"
                          value={formData.role}
                          onChange={handleChange}
                          required
                          style={{borderRadius: '8px'}}
                        >
                          <option value="">Choose your role...</option>
                          {roles.map(role => (
                            <option key={role.value} value={role.value}>
                              {role.label} - {role.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      {formData.role === 'vendor' && (
                        <div className="mb-3">
                          <label className="form-label text-white">Vendor Type</label>
                          <select
                            name="vendor_type"
                            className="form-select"
                            value={formData.vendor_type}
                            onChange={handleChange}
                            required
                            style={{borderRadius: '8px'}}
                          >
                            <option value="">Choose vendor type...</option>
                            {vendorTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label} - {type.description}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label text-white">Password</label>
                        <div className="position-relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{borderRadius: '8px', paddingRight: '50px'}}
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

                      <div className="mb-3">
                        <label className="form-label text-white">Confirm Password</label>
                        <input
                          type="password"
                          name="password_confirm"
                          className="form-control"
                          value={formData.password_confirm}
                          onChange={handleChange}
                          required
                          style={{borderRadius: '8px'}}
                        />
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="btn btn-outline-light flex-fill"
                          style={{borderRadius: '12px'}}
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="btn flex-fill fw-medium"
                          disabled={loading}
                          style={{
                            background: 'linear-gradient(45deg, #20B2AA, #FF6347)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '12px'
                          }}
                        >
                          {loading ? (
                            <span className="spinner-border spinner-border-sm me-2" />
                          ) : (
                            <UserPlus size={20} className="me-2" />
                          )}
                          Create Account
                        </button>
                      </div>
                    </>
                  )}
                </form>

                <div className="text-center mt-3">
                  <p className="text-white opacity-75 mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-white fw-medium text-decoration-none">
                      Sign in here
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

export default RegisterPage;
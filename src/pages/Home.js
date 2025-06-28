import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Truck, Users, Shield, Star, MapPin, Clock, CreditCard } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: MapPin,
      title: "Find Nearby Vendors",
      description: "Locate gas vendors and refill stations in your area with real-time availability"
    },
    {
      icon: Truck,
      title: "Home Delivery", 
      description: "Get your gas cylinders delivered safely to your doorstep"
    },
    {
      icon: Shield,
      title: "Verified Vendors",
      description: "All vendors are verified and meet safety standards"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Pay safely with M-Pesa, cards, or bank transfers"
    }
  ];

  return (
    <div className="min-vh-100">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{
        background: 'rgba(32, 178, 170, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="container">
          <Link className="navbar-brand fw-bold fs-2" to="/">
            Kaanagas
          </Link>
          
          <div className="navbar-nav ms-auto d-flex flex-row gap-2">
            <Link className="btn btn-outline-light rounded-pill px-4" to="/login">
              Sign In
            </Link>
            <Link className="btn btn-light rounded-pill px-4 fw-medium" to="/register" style={{color: '#20B2AA'}}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg" style={{paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh'}}>
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold text-white mb-4">
                Gas Delivery Made <span style={{color: '#FFD700'}}>Simple</span>
              </h1>
              <p className="lead text-white mb-4 opacity-90">
                Connect with verified gas vendors and get your cylinders delivered safely to your doorstep. 
                Track your order in real-time and pay securely.
              </p>
              <div className="d-flex gap-3 mb-5">
                <Link className="btn btn-lg btn-light rounded-pill px-5 py-3 fw-medium" to="/register" style={{color: '#20B2AA'}}>
                  <ShoppingCart size={20} className="me-2" />
                  Order Now
                </Link>
                <button className="btn btn-lg btn-outline-light rounded-pill px-5 py-3">
                  Watch Demo
                </button>
              </div>
              
              {/* Stats */}
              <div className="row text-center text-white">
                <div className="col-4">
                  <h3 className="fw-bold mb-1">500+</h3>
                  <small className="opacity-75">Vendors</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold mb-1">10K+</h3>
                  <small className="opacity-75">Deliveries</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold mb-1">4.9★</h3>
                  <small className="opacity-75">Rating</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{background: '#f8f9fa'}}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{color: '#2c3e50'}}>Why Choose Kaanagas?</h2>
            <p className="lead text-muted">Everything you need for convenient gas delivery</p>
          </div>
          
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card border-0 h-100 shadow-sm card-modern">
                  <div className="card-body p-4 text-center">
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                      width: '70px',
                      height: '70px',
                      background: 'linear-gradient(45deg, #20B2AA, #FF6347)'
                    }}>
                      <feature.icon size={28} className="text-white" />
                    </div>
                    <h5 className="fw-bold mb-3" style={{color: '#2c3e50'}}>{feature.title}</h5>
                    <p className="text-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
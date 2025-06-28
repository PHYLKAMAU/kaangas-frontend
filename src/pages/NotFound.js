import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-vh-100 gradient-bg d-flex align-items-center">
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h1 className="display-1 fw-bold text-white mb-4">404</h1>
            <h2 className="text-white mb-3">Page Not Found</h2>
            <p className="text-white opacity-75 mb-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link 
              to="/" 
              className="btn btn-light btn-lg rounded-pill px-5"
              style={{color: '#20B2AA'}}
            >
              <Home size={20} className="me-2" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
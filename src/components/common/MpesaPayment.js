import React, { useState } from 'react';
import { apiClient } from '../../services/api';
import toast from 'react-hot-toast';
import { CreditCard, Phone, CheckCircle, Clock } from 'lucide-react';

const MpesaPayment = ({ order, onPaymentSuccess, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed

  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      const response = await apiClient.post('/orders/mpesa-payment/', {
        order_id: order.id,
        phone_number: phoneNumber.replace(/^0/, '254') // Convert 07xx to 2547xx
      });

      toast.success('Payment request sent! Please check your phone.');
      
      // Poll for payment status
      pollPaymentStatus(response.data.checkout_request_id);
      
    } catch (error) {
      console.error('M-Pesa payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
      setPaymentStatus('failed');
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestId) => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)

    const poll = async () => {
      try {
        const response = await apiClient.get(`/orders/mpesa-status/${checkoutRequestId}/`);
        
        if (response.data.status === 'completed') {
          setPaymentStatus('success');
          setLoading(false);
          toast.success('Payment successful!');
          onPaymentSuccess(response.data);
          return;
        } else if (response.data.status === 'failed') {
          setPaymentStatus('failed');
          setLoading(false);
          toast.error('Payment failed or cancelled');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setPaymentStatus('failed');
          setLoading(false);
          toast.error('Payment timeout. Please try again.');
        }
      } catch (error) {
        console.error('Payment status check error:', error);
        setPaymentStatus('failed');
        setLoading(false);
      }
    };

    setTimeout(poll, 5000); // Start polling after 5 seconds
  };

  return (
    <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{borderRadius: '20px'}}>
          <div className="modal-header border-0 text-center">
            <h5 className="modal-title w-100 fw-bold" style={{color: '#2c3e50'}}>
              <CreditCard size={24} className="me-2" style={{color: '#20B2AA'}} />
              M-Pesa Payment
            </h5>
          </div>
          
          <div className="modal-body p-4">
            {/* Order Summary */}
            <div className="card border-0 mb-4" style={{background: 'rgba(32, 178, 170, 0.1)'}}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">Order #{order.id}</div>
                    <div className="text-muted small">{order.items}</div>
                  </div>
                  <div className="fw-bold fs-5" style={{color: '#20B2AA'}}>
                    KES {order.amount?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {paymentStatus === 'pending' && (
              <>
                {/* Phone Number Input */}
                <div className="mb-4">
                  <label className="form-label fw-medium">M-Pesa Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Phone size={16} />
                    </span>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      placeholder="0712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      style={{borderRadius: '0 12px 12px 0'}}
                    />
                  </div>
                  <small className="text-muted">
                    Enter the phone number registered with M-Pesa
                  </small>
                </div>

                {/* Payment Button */}
                <button
                  className="btn btn-lg w-100 fw-medium mb-3"
                  onClick={handleMpesaPayment}
                  disabled={loading || !phoneNumber}
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} className="me-2" />
                      Pay KES {order.amount?.toLocaleString()}
                    </>
                  )}
                </button>
              </>
            )}

            {paymentStatus === 'processing' && (
              <div className="text-center py-4">
                <div className="spinner-border mb-3" style={{color: '#20B2AA'}}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h6 className="fw-bold mb-2">Payment Request Sent</h6>
                <p className="text-muted mb-0">
                  Please check your phone and enter your M-Pesa PIN to complete the payment.
                </p>
                <div className="mt-3">
                  <Clock size={16} className="me-1" />
                  <small className="text-muted">Waiting for confirmation...</small>
                </div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center py-4">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(45deg, #32CD32, #20B2AA)'
                }}>
                  <CheckCircle size={24} className="text-white" />
                </div>
                <h6 className="fw-bold mb-2">Payment Successful!</h6>
                <p className="text-muted">
                  Your payment has been processed successfully. Your order will be confirmed shortly.
                </p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="text-center py-4">
                <div className="text-danger mb-3">
                  <CreditCard size={48} />
                </div>
                <h6 className="fw-bold mb-2">Payment Failed</h6>
                <p className="text-muted mb-3">
                  The payment could not be processed. Please try again.
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setPaymentStatus('pending');
                    setPhoneNumber('');
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
          
          <div className="modal-footer border-0">
            <button
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={loading && paymentStatus === 'processing'}
            >
              {paymentStatus === 'success' ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MpesaPayment;
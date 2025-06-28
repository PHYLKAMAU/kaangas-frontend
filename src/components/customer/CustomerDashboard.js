 import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import GoogleMap from '../common/GoogleMap';
import MpesaPayment from '../common/MpesaPayment';
import { 
  ShoppingCart, MapPin, Star, Clock, Package, Heart, User, LogOut, 
  Search, Filter, Phone, Navigation, CreditCard, Home, Settings,
  Plus, Minus, Eye, Bell, Gift, Award, Map
} from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [nearbyVendors, setNearbyVendors] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGasType, setSelectedGasType] = useState('all');
  const [userLocation, setUserLocation] = useState({ lat: -1.2921, lng: 36.8219 });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    getUserLocation();
    fetchAllData();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get your location. Using default location.');
        }
      );
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchActiveOrders(),
        fetchNearbyVendors(),
        fetchOrderHistory(),
        fetchAddresses()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Some data could not be loaded');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get('/customers/dashboard/');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set minimal data structure if API fails
      setDashboardData({
        total_orders: 0,
        pending_orders: 0,
        completed_orders: 0,
        total_spent: 0,
        loyalty_points: 0,
        membership_tier: "Bronze",
        favorite_vendors_count: 0,
        active_complaints: 0
      });
    }
  };

  const fetchActiveOrders = async () => {
    try {
      const response = await apiClient.get('/customers/orders/?status=active');
      setActiveOrders(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch active orders:', error);
      setActiveOrders([]);
    }
  };

  const fetchNearbyVendors = async () => {
    try {
      const response = await apiClient.get(`/vendors/search/?latitude=${userLocation.lat}&longitude=${userLocation.lng}&radius=10`);
      setNearbyVendors(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch nearby vendors:', error);
      setNearbyVendors([]);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await apiClient.get('/customers/orders/history/');
      setOrderHistory(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch order history:', error);
      setOrderHistory([]);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await apiClient.get('/customers/addresses/');
      setAddresses(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setAddresses([]);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const toggleFavorite = async (vendorId) => {
    try {
      const vendor = nearbyVendors.find(v => v.id === vendorId);
      if (vendor.is_favorite) {
        await apiClient.delete(`/customers/favorites/${vendorId}/`);
        toast.success('Removed from favorites');
      } else {
        await apiClient.post('/customers/favorites/', { vendor: vendorId });
        toast.success('Added to favorites');
      }
      
      // Update local state
      setNearbyVendors(vendors => 
        vendors.map(v => 
          v.id === vendorId ? { ...v, is_favorite: !v.is_favorite } : v
        )
      );
    } catch (error) {
      console.error('Failed to update favorites:', error);
      toast.error('Failed to update favorites');
    }
  };

  const createOrder = async (vendor, gasType = '13kg') => {
    try {
      const orderData = {
        vendor: vendor.id,
        order_type: 'delivery',
        delivery_latitude: userLocation.lat,
        delivery_longitude: userLocation.lng,
        items: [
          {
            gas_product: 1, // This should be dynamic based on gas type
            quantity: 1,
            is_refill: false
          }
        ],
        requested_delivery_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
      };

      const response = await apiClient.post('/orders/create/', orderData);
      
      // Show payment modal
      setSelectedOrder(response.data);
      setShowPaymentModal(true);
      
      toast.success('Order created! Please complete payment.');
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error(error.response?.data?.message || 'Failed to create order');
    }
  };

  const trackOrder = async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/track/${orderId}/`);
      // Show order tracking modal or update UI
      toast.success(`Order status: ${response.data.status}`);
    } catch (error) {
      console.error('Failed to track order:', error);
      toast.error('Failed to track order');
    }
  };

  const reorderPrevious = async (orderId) => {
    try {
      await apiClient.post(`/orders/${orderId}/reorder/`);
      toast.success('Order placed successfully!');
      fetchActiveOrders(); // Refresh active orders
    } catch (error) {
      console.error('Failed to reorder:', error);
      toast.error('Failed to reorder');
    }
  };

  const onPaymentSuccess = (paymentData) => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
    fetchActiveOrders(); // Refresh active orders
    fetchDashboardData(); // Refresh dashboard stats
    toast.success('Order confirmed! You will receive updates via SMS.');
  };

  if (loading) {
    return (
      <div className="min-vh-100 gradient-bg d-flex align-items-center justify-content-center">
        <div className="spinner-border text-white" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const filteredVendors = nearbyVendors.filter(vendor => {
    const matchesSearch = vendor.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedGasType === 'all' || vendor.is_open;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-vh-100" style={{background: '#f8f9fa'}}>
      {/* Header */}
      <nav className="navbar navbar-dark sticky-top" style={{
        background: 'linear-gradient(135deg, #20B2AA 0%, #FF6347 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold fs-3">Kaanagas</span>
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <Bell size={24} className="text-white" style={{cursor: 'pointer'}} />
              {activeOrders.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.7rem'}}>
                  {activeOrders.length}
                </span>
              )}
            </div>
            <div className="d-flex align-items-center gap-2 text-white">
              <div className="rounded-circle bg-white bg-opacity-20 p-2">
                <User size={20} />
              </div>
              <div>
                <div className="fw-medium">{user?.first_name} {user?.last_name}</div>
                <small className="opacity-75">{dashboardData?.membership_tier} Member</small>
              </div>
            </div>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              <LogOut size={16} className="me-1" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-4 py-4">
        {/* Quick Stats */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 card-modern">
              <div className="card-body p-4 text-center">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(45deg, #20B2AA, #FF6347)'
                }}>
                  <Package size={24} className="text-white" />
                </div>
                <h4 className="fw-bold" style={{color: '#2c3e50'}}>{dashboardData?.total_orders || 0}</h4>
                <small className="text-muted">Total Orders</small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 card-modern">
              <div className="card-body p-4 text-center">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(45deg, #FFD700, #FF6347)'
                }}>
                  <Award size={24} className="text-white" />
                </div>
                <h4 className="fw-bold" style={{color: '#2c3e50'}}>{dashboardData?.loyalty_points || 0}</h4>
                <small className="text-muted">Loyalty Points</small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 card-modern">
              <div className="card-body p-4 text-center">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(45deg, #32CD32, #20B2AA)'
                }}>
                  <Clock size={24} className="text-white" />
                </div>
                <h4 className="fw-bold" style={{color: '#2c3e50'}}>{dashboardData?.pending_orders || 0}</h4>
                <small className="text-muted">Active Orders</small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 card-modern">
              <div className="card-body p-4 text-center">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(45deg, #9370DB, #FF6347)'
                }}>
                  <Heart size={24} className="text-white" />
                </div>
                <h4 className="fw-bold" style={{color: '#2c3e50'}}>{dashboardData?.favorite_vendors_count || 0}</h4>
                <small className="text-muted">Favorite Vendors</small>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card border-0 shadow-sm card-modern mb-4">
          <div className="card-body p-0">
            <nav className="nav nav-pills nav-fill">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'vendors', label: 'Find Vendors', icon: MapPin },
                { id: 'orders', label: 'My Orders', icon: Package },
                { id: 'history', label: 'Order History', icon: Clock },
                { id: 'profile', label: 'Profile', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`nav-link rounded-0 border-0 py-3 ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    backgroundColor: activeTab === tab.id ? '#20B2AA' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#6c757d'
                  }}
                >
                  <tab.icon size={18} className="me-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="row g-4">
            {/* Welcome Section */}
            <div className="col-12">
              <div className="card border-0 shadow-sm card-modern">
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h3 className="fw-bold mb-2" style={{color: '#2c3e50'}}>
                        Welcome back, {user?.first_name}! 👋
                      </h3>
                      <p className="text-muted mb-3">Ready to order fresh gas cylinders for your home?</p>
                      <button 
                        className="btn btn-primary-gradient btn-lg rounded-pill px-4 me-3"
                        onClick={() => setActiveTab('vendors')}
                      >
                        <ShoppingCart size={20} className="me-2" />
                        Order Now
                      </button>
                      <button 
                        className="btn btn-outline-primary btn-lg rounded-pill px-4"
                        onClick={() => setShowMap(!showMap)}
                      >
                        <Map size={20} className="me-2" />
                        View Map
                      </button>
                    </div>
                    <div className="col-md-4 text-center">
                      <div className="d-flex justify-content-around">
                        <div className="text-center">
                          <div className="fw-bold fs-4" style={{color: '#20B2AA'}}>
                            KES {((dashboardData?.total_spent || 0) / 1000).toFixed(0)}K
                          </div>
                          <small className="text-muted">Total Spent</small>
                        </div>
                        <div className="text-center">
                          <div className="fw-bold fs-4" style={{color: '#FF6347'}}>
                            {dashboardData?.completed_orders || 0}
                          </div>
                          <small className="text-muted">Completed</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map View */}
            {showMap && (
 <div className="col-12">
               <div className="card border-0 shadow-sm card-modern">
                 <div className="card-body p-4">
                   <div className="d-flex justify-content-between align-items-center mb-3">
                     <h5 className="fw-bold mb-0" style={{color: '#2c3e50'}}>
                       <MapPin size={20} className="me-2" style={{color: '#20B2AA'}} />
                       Nearby Vendors Map
                     </h5>
                     <button 
                       className="btn btn-sm btn-outline-secondary"
                       onClick={() => setShowMap(false)}
                     >
                       Hide Map
                     </button>
                   </div>
                   <GoogleMap
                     center={userLocation}
                     vendors={nearbyVendors}
                     onVendorSelect={(vendor) => {
                       toast.info(`Selected: ${vendor.name}`);
                       setActiveTab('vendors');
                     }}
                     height="400px"
                   />
                 </div>
               </div>
             </div>
           )}

           {/* Active Orders Preview */}
           {activeOrders.length > 0 && (
             <div className="col-12">
               <div className="card border-0 shadow-sm card-modern">
                 <div className="card-body p-4">
                   <div className="d-flex justify-content-between align-items-center mb-3">
                     <h5 className="fw-bold mb-0" style={{color: '#2c3e50'}}>
                       <Package size={20} className="me-2" style={{color: '#20B2AA'}} />
                       Active Orders
                     </h5>
                     <button 
                       className="btn btn-sm btn-outline-primary"
                       onClick={() => setActiveTab('orders')}
                     >
                       View All
                     </button>
                   </div>
                   <div className="row g-3">
                     {activeOrders.slice(0, 2).map(order => (
                       <div key={order.id} className="col-md-6">
                         <div className="border rounded-3 p-3" style={{
                           background: 'linear-gradient(45deg, rgba(32, 178, 170, 0.05), rgba(255, 99, 71, 0.05))',
                           border: '1px solid rgba(32, 178, 170, 0.2)'
                         }}>
                           <div className="d-flex justify-content-between align-items-start mb-2">
                             <div>
                               <div className="fw-bold" style={{color: '#2c3e50'}}>#{order.order_number || order.id}</div>
                               <div className="text-muted small">{order.vendor_name || 'Vendor'}</div>
                             </div>
                             <span className={`badge rounded-pill ${
                               order.status === 'out_for_delivery' ? 'bg-warning' : 
                               order.status === 'confirmed' ? 'bg-info' : 'bg-primary'
                             }`}>
                               {order.status?.replace('_', ' ') || 'Processing'}
                             </span>
                           </div>
                           <div className="fw-medium mb-2">{order.items_description || 'Gas order'}</div>
                           <div className="d-flex justify-content-between align-items-center">
                             <span className="fw-bold text-success">KES {(order.total_amount || 0).toLocaleString()}</span>
                             <button 
                               className="btn btn-sm btn-outline-primary"
                               onClick={() => trackOrder(order.order_number || order.id)}
                             >
                               <Eye size={14} className="me-1" />
                               Track
                             </button>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           )}
         </div>
       )}

       {/* Find Vendors Tab */}
       {activeTab === 'vendors' && (
         <div className="row g-4">
           {/* Search and Filter */}
           <div className="col-12">
             <div className="card border-0 shadow-sm card-modern">
               <div className="card-body p-4">
                 <div className="row g-3">
                   <div className="col-md-6">
                     <div className="position-relative">
                       <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                       <input
                         type="text"
                         className="form-control ps-5"
                         placeholder="Search vendors..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         style={{borderRadius: '12px'}}
                       />
                     </div>
                   </div>
                   <div className="col-md-3">
                     <select
                       className="form-select"
                       value={selectedGasType}
                       onChange={(e) => setSelectedGasType(e.target.value)}
                       style={{borderRadius: '12px'}}
                     >
                       <option value="all">All Vendors</option>
                       <option value="open">Open Now</option>
                       <option value="nearby">Nearby</option>
                     </select>
                   </div>
                   <div className="col-md-3">
                     <button 
                       className="btn btn-outline-primary w-100" 
                       style={{borderRadius: '12px'}}
                       onClick={() => setShowMap(!showMap)}
                     >
                       <Map size={16} className="me-2" />
                       {showMap ? 'Hide Map' : 'Show Map'}
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* Map View for Vendors */}
           {showMap && (
             <div className="col-12">
               <div className="card border-0 shadow-sm card-modern">
                 <div className="card-body p-4">
                   <h6 className="fw-bold mb-3" style={{color: '#2c3e50'}}>
                     Vendors Near You
                   </h6>
                   <GoogleMap
                     center={userLocation}
                     vendors={filteredVendors}
                     onVendorSelect={(vendor) => {
                       toast.info(`Selected: ${vendor.name}`);
                     }}
                     height="400px"
                   />
                 </div>
               </div>
             </div>
           )}

           {/* Vendors Grid */}
           <div className="col-12">
             {filteredVendors.length === 0 ? (
               <div className="card border-0 shadow-sm card-modern">
                 <div className="card-body p-5 text-center">
                   <MapPin size={48} className="text-muted mb-3" />
                   <h6 className="text-muted">No vendors found</h6>
                   <p className="text-muted">
                     {nearbyVendors.length === 0 
                       ? 'No vendors available in your area at the moment.'
                       : 'Try adjusting your search or filters.'
                     }
                   </p>
                   <button 
                     className="btn btn-outline-primary"
                     onClick={() => {
                       setSearchQuery('');
                       setSelectedGasType('all');
                       fetchNearbyVendors();
                     }}
                   >
                     Refresh
                   </button>
                 </div>
               </div>
             ) : (
               <div className="row g-3">
                 {filteredVendors.map(vendor => (
                   <div key={vendor.id} className="col-lg-4 col-md-6">
                     <div className="card border-0 shadow-sm h-100 card-modern">
                       <div className="card-body p-4">
                         <div className="d-flex align-items-start gap-3 mb-3">
                           <img
                             src={vendor.profile_picture || '/api/placeholder/60/60'}
                             alt={vendor.name || vendor.business_name}
                             className="rounded-circle"
                             style={{width: '60px', height: '60px', objectFit: 'cover'}}
                             onError={(e) => {
                               e.target.src = `data:image/svg+xml;base64,${btoa(`
                                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="#20B2AA">
                                   <circle cx="12" cy="12" r="10"/>
                                   <text x="12" y="16" text-anchor="middle" fill="white" font-size="12">
                                     ${(vendor.name || vendor.business_name || 'V').charAt(0)}
                                   </text>
                                 </svg>
                               `)}`;
                             }}
                           />
                           <div className="flex-grow-1">
                             <div className="d-flex align-items-center gap-2 mb-1">
                               <h6 className="fw-bold mb-0" style={{color: '#2c3e50'}}>
                                 {vendor.name || vendor.business_name || 'Vendor'}
                               </h6>
                               <button
                                 className="btn btn-sm p-0"
                                 onClick={() => toggleFavorite(vendor.id)}
                                 style={{border: 'none', background: 'none'}}
                               >
                                 <Heart
                                   size={16}
                                   className={vendor.is_favorite ? 'text-danger' : 'text-muted'}
                                   fill={vendor.is_favorite ? 'currentColor' : 'none'}
                                 />
                               </button>
                             </div>
                             
                             <div className="d-flex align-items-center gap-3 mb-2">
                               <div className="d-flex align-items-center gap-1">
                                 <Star size={14} style={{color: '#FFD700'}} fill="#FFD700" />
                                 <span className="small fw-medium">{vendor.average_rating || '4.5'}</span>
                               </div>
                               <div className="d-flex align-items-center gap-1 text-muted">
                                 <MapPin size={14} />
                                 <span className="small">{vendor.distance || 'Nearby'}</span>
                               </div>
                               <span className={`badge rounded-pill ${vendor.is_operating ? 'bg-success' : 'bg-danger'}`}>
                                 {vendor.is_operating ? 'Open' : 'Closed'}
                               </span>
                             </div>
                             
                             <div className="small text-muted mb-2">{vendor.address || 'Address not available'}</div>
                             <div className="small text-muted mb-3">
                               <Clock size={12} className="me-1" />
                               Delivery: {vendor.delivery_time || '30-45 mins'}
                             </div>
                           </div>
                         </div>

                         {/* Gas Prices */}
                         <div className="border-top pt-3">
                           <div className="row g-2 mb-3">
                             <div className="col-6">
                               <div className="text-center p-2 rounded" style={{background: 'rgba(32, 178, 170, 0.1)'}}>
                                 <div className="fw-bold" style={{color: '#20B2AA'}}>
                                   KES {(vendor.price_13kg || 2400).toLocaleString()}
                                 </div>
                                 <small className="text-muted">13kg Cylinder</small>
                               </div>
                             </div>
                             <div className="col-6">
                               <div className="text-center p-2 rounded" style={{background: 'rgba(255, 99, 71, 0.1)'}}>
                                 <div className="fw-bold" style={{color: '#FF6347'}}>
                                   KES {(vendor.price_6kg || 1200).toLocaleString()}
                                 </div>
                                 <small className="text-muted">6kg Cylinder</small>
                               </div>
                             </div>
                           </div>

                           {/* Action Buttons */}
                           <div className="d-flex gap-2">
                             <button
                               className="btn btn-sm btn-outline-primary flex-fill"
                               onClick={() => window.open(`tel:${vendor.phone_number || vendor.phone}`)}
                             >
                               <Phone size={14} className="me-1" />
                               Call
                             </button>
                             <button
                               className="btn btn-sm flex-fill"
                               onClick={() => createOrder(vendor, '13kg')}
                               disabled={!vendor.is_operating}
                               style={{
                                 background: vendor.is_operating ? 'linear-gradient(45deg, #20B2AA, #FF6347)' : '#6c757d',
                                 border: 'none',
                                 color: 'white'
                               }}
                             >
                               <ShoppingCart size={14} className="me-1" />
                               Order
                             </button>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
         </div>
       )}

       {/* Active Orders Tab */}
       {activeTab === 'orders' && (
         <div className="row g-4">
           <div className="col-12">
             <div className="card border-0 shadow-sm card-modern">
               <div className="card-body p-4">
                 <h5 className="fw-bold mb-4" style={{color: '#2c3e50'}}>
                   <Package size={20} className="me-2" style={{color: '#20B2AA'}} />
                   Active Orders ({activeOrders.length})
                 </h5>

                 {activeOrders.length === 0 ? (
                   <div className="text-center py-5">
                     <Package size={48} className="text-muted mb-3" />
                     <h6 className="text-muted">No active orders</h6>
                     <p className="text-muted mb-3">You don't have any active orders at the moment.</p>
                     <button 
                       className="btn btn-primary-gradient rounded-pill px-4"
                       onClick={() => setActiveTab('vendors')}
                     >
                       <ShoppingCart size={16} className="me-2" />
                       Place Order
                     </button>
                   </div>
                 ) : (
                   <div className="row g-3">
                     {activeOrders.map(order => (
                       <div key={order.id} className="col-12">
                         <div className="card border-0" style={{
                           background: 'linear-gradient(45deg, rgba(32, 178, 170, 0.05), rgba(255, 99, 71, 0.05))',
                           border: '1px solid rgba(32, 178, 170, 0.2)'
                         }}>
                           <div className="card-body p-4">
                             <div className="row align-items-center">
                               <div className="col-md-6">
                                 <div className="d-flex align-items-center gap-3">
                                   <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                                     width: '50px',
                                     height: '50px',
                                     background: 'linear-gradient(45deg, #20B2AA, #FF6347)'
                                   }}>
                                     <Package size={20} className="text-white" />
                                   </div>
                                   <div>
                                     <div className="fw-bold" style={{color: '#2c3e50'}}>
                                       Order #{order.order_number || order.id}
                                     </div>
                                     <div className="text-muted">{order.vendor_name || 'Vendor'}</div>
                                     <div className="fw-medium">{order.items_description || 'Gas order'}</div>
                                   </div>
                                 </div>
                               </div>
                               
                               <div className="col-md-3">
                                 <div className="text-center">
                                   <span className={`badge rounded-pill mb-2 ${
                                     order.status === 'out_for_delivery' ? 'bg-warning' :
                                     order.status === 'confirmed' ? 'bg-info' :
                                     order.status === 'preparing' ? 'bg-primary' : 'bg-success'
                                   }`}>
                                     {(order.status || 'processing').replace('_', ' ').toUpperCase()}
                                   </span>
                                   <div className="fw-bold text-success">
                                     KES {(order.total_amount || 0).toLocaleString()}
                                   </div>
                                   <div className="small text-muted">
                                     <Clock size={12} className="me-1" />
                                     ETA: {order.estimated_delivery_time ? 
                                       new Date(order.estimated_delivery_time).toLocaleTimeString() : 
                                       'Calculating...'
                                     }
                                   </div>
                                 </div>
                               </div>

                               <div className="col-md-3">
                                 <div className="d-flex flex-column gap-2">
                                   <button 
                                     className="btn btn-sm btn-outline-primary"
                                     onClick={() => trackOrder(order.order_number || order.id)}
                                   >
                                     <Eye size={14} className="me-1" />
                                     Track Order
                                   </button>
                                   {order.rider_phone && (
                                     <button 
                                       className="btn btn-sm btn-outline-success"
                                       onClick={() => window.open(`tel:${order.rider_phone}`)}
                                     >
                                       <Phone size={14} className="me-1" />
                                       Call Rider
                                     </button>
                                   )}
                                   <button 
                                     className="btn btn-sm btn-outline-secondary"
                                     onClick={() => window.open(`tel:${order.vendor_phone}`)}
                                   >
                                     <Phone size={14} className="me-1" />
                                     Call Vendor
                                   </button>
                                 </div>
                               </div>
                             </div>

                             {/* Order Progress */}
                             <div className="mt-3">
                               <div className="d-flex justify-content-between align-items-center mb-2">
                                 <small className="text-muted">Order Progress</small>
                                 <small className="text-muted">
                                   {order.status === 'confirmed' ? '25%' :
                                    order.status === 'preparing' ? '50%' :
                                    order.status === 'out_for_delivery' ? '75%' : '100%'}
                                 </small>
                               </div>
                               <div className="progress" style={{height: '6px'}}>
                                 <div 
                                   className="progress-bar"
                                   style={{
                                     width: order.status === 'confirmed' ? '25%' :
                                           order.status === 'preparing' ? '50%' :
                                           order.status === 'out_for_delivery' ? '75%' : '100%',
                                     background: 'linear-gradient(45deg, #20B2AA, #FF6347)'
                                   }}
                                 ></div>
                               </div>
                             </div>

                             {order.rider_name && (
                               <div className="mt-3 p-2 rounded" style={{background: 'rgba(32, 178, 170, 0.1)'}}>
                                 <small className="text-muted d-block">Rider:</small>
                                 <div className="fw-medium">{order.rider_name}</div>
                               </div>
                             )}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Order History Tab */}
       {activeTab === 'history' && (
         <div className="row g-4">
           <div className="col-12">
             <div className="card border-0 shadow-sm card-modern">
               <div className="card-body p-4">
                 <h5 className="fw-bold mb-4" style={{color: '#2c3e50'}}>
                   <Clock size={20} className="me-2" style={{color: '#20B2AA'}} />
                   Order History ({orderHistory.length})
                 </h5>

                 {orderHistory.length === 0 ? (
                   <div className="text-center py-5">
                     <Clock size={48} className="text-muted mb-3" />
                     <h6 className="text-muted">No order history</h6>
                     <p className="text-muted">Your completed orders will appear here.</p>
                   </div>
                 ) : (
                   <div className="row g-3">
                     {orderHistory.map(order => (
                       <div key={order.id} className="col-12">
                         <div className="card border-0" style={{
                           background: '#f8f9fa',
                           border: '1px solid #dee2e6'
                         }}>
                           <div className="card-body p-3">
                             <div className="row align-items-center">
                               <div className="col-md-6">
                                 <div className="d-flex align-items-center gap-3">
                                   <div className="rounded-circle d-flex align-items-center justify-content-center bg-success" style={{
                                     width: '40px', 
                                     height: '40px'
                                   }}>
                                     <Package size={16} className="text-white" />
                                   </div>
                                   <div>
                                     <div className="fw-bold" style={{color: '#2c3e50'}}>
                                       #{order.order_number || order.id}
                                     </div>
                                     <div className="text-muted small">{order.vendor_name || 'Vendor'}</div>
                                     <div className="fw-medium">{order.items_description || 'Gas order'}</div>
                                   </div>
                                 </div>
                               </div>
                               
                               <div className="col-md-3">
                                 <div className="text-center">
                                   <div className="fw-bold text-success mb-1">
                                     KES {(order.total_amount || 0).toLocaleString()}
                                   </div>
                                   <div className="small text-muted">
                                     {order.delivered_at ? 
                                       new Date(order.delivered_at).toLocaleDateString() :
                                       order.created_at ? 
                                       new Date(order.created_at).toLocaleDateString() :
                                       'N/A'
                                     }
                                   </div>
                                   {order.rating && (
                                     <div className="d-flex align-items-center justify-content-center gap-1 mt-1">
                                       {[...Array(5)].map((_, i) => (
                                         <Star
                                           key={i}
                                           size={12}
                                           className={i < order.rating ? 'text-warning' : 'text-muted'}
                                           fill={i < order.rating ? 'currentColor' : 'none'}
                                         />
                                       ))}
                                     </div>
                                   )}
                                 </div>
                               </div>

                               <div className="col-md-3">
                                 <div className="d-flex flex-column gap-2">
                                   <button 
                                     className="btn btn-sm btn-outline-primary"
                                     onClick={() => reorderPrevious(order.id)}
                                   >
                                     <Plus size={14} className="me-1" />
                                     Reorder
                                   </button>
                                   <button className="btn btn-sm btn-outline-secondary">
                                     <Eye size={14} className="me-1" />
                                     View Details
                                   </button>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Profile Tab */}
       {activeTab === 'profile' && (
         <div className="row g-4">
           {/* Profile Information */}
           <div className="col-md-6">
             <div className="card border-0 shadow-sm card-modern">
               <div className="card-body p-4">
                 <h5 className="fw-bold mb-4" style={{color: '#2c3e50'}}>
                   <User size={20} className="me-2" style={{color: '#20B2AA'}} />
                   Profile Information
                 </h5>
                 
                 <div className="text-center mb-4">
                   <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                     width: '80px',
                     height: '80px',
                     background: 'linear-gradient(45deg, #20B2AA, #FF6347)'
                   }}>
                     <User size={32} className="text-white" />
                   </div>
                   <h6 className="fw-bold">{user?.first_name} {user?.last_name}</h6>
                   <span className="badge bg-success rounded-pill">{dashboardData?.membership_tier} Member</span>
                 </div>

                 <div className="row g-3">
                   <div className="col-12">
                     <label className="form-label text-muted">Email</label>
                     <input
                       type="email"
                       className="form-control"
                       value={user?.email || ''}
                       readOnly
                       style={{borderRadius: '8px'}}
                     />
                   </div>
                   <div className="col-12">
                     <label className="form-label text-muted">Phone</label>
                     <input
                       type="tel"
                       className="form-control"
                       value={user?.phone_number || ''}
                       readOnly
                       style={{borderRadius: '8px'}}
                     />
                   </div>
                   <div className="col-6">
                     <label className="form-label text-muted">City</label>
                     <input
                       type="text"
                       className="form-control"
                       value={user?.city || 'Nairobi'}
                       readOnly
                       style={{borderRadius: '8px'}}
                     />
                   </div>
                   <div className="col-6">
                     <label className="form-label text-muted">County</label>
                     <input
                       type="text"
                       className="form-control"
                       value={user?.county || 'Nairobi'}
                       readOnly
                       style={{borderRadius: '8px'}}
                     />
                   </div>
                 </div>

                 <button className="btn btn-primary-gradient w-100 mt-4 rounded-pill">
                   <Settings size={16} className="me-2" />
                   Edit Profile
                 </button>
               </div>
             </div>
           </div>

           {/* Delivery Addresses */}
           <div className="col-md-6">
             <div className="card border-0 shadow-sm card-modern">
               <div className="card-body p-4">
                 <div className="d-flex justify-content-between align-items-center mb-4">
                   <h5 className="fw-bold mb-0" style={{color: '#2c3e50'}}>
                     <Home size={20} className="me-2" style={{color: '#20B2AA'}} />
                     Delivery Addresses
                   </h5>
                   <button className="btn btn-sm btn-outline-primary rounded-pill">
                     <Plus size={16} className="me-1" />
                     Add
                   </button>
                 </div>

                 {addresses.length === 0 ? (
                   <div className="text-center py-4">
                     <Home size={32} className="text-muted mb-2" />
                     <p className="text-muted">No addresses saved</p>
                     <button className="btn btn-outline-primary btn-sm">
                       <Plus size={14} className="me-1" />
                       Add Address
                     </button>
                   </div>
                 ) : (
                   <div className="d-flex flex-column gap-3">
                     {addresses.map(address => (
                       <div key={address.id} className="border rounded-3 p-3" style={{
                         background: address.is_default ? 'rgba(32, 178, 170, 0.1)' : '#f8f9fa',
                         border: address.is_default ? '2px solid #20B2AA' : '1px solid #dee2e6'
                       }}>
                         <div className="d-flex justify-content-between align-items-start">
                           <div>
                             <div className="fw-bold d-flex align-items-center gap-2">
                               {address.label || address.address_type}
                               {address.is_default && (
                                 <span className="badge bg-success rounded-pill">Default</span>
                               )}
                             </div>
                             <div className="text-muted">{address.address_line_1}</div>
                             <div className="text-muted">{address.city}, {address.county}</div>
                           </div>
                           <div className="d-flex gap-1">
                             <button className="btn btn-sm btn-outline-primary">
                               <Settings size={12} />
                             </button>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>
           </div>

           {/* Loyalty Program */}
           <div className="col-12">
             <div className="card border-0 shadow-sm card-modern">
               <div className="card-body p-4">
                 <h5 className="fw-bold mb-4" style={{color: '#2c3e50'}}>
                   <Gift size={20} className="me-2" style={{color: '#20B2AA'}} />
                   Loyalty Program
                 </h5>

                 <div className="row g-4">
 <div className="col-md-4">
                     <div className="text-center p-4 rounded-3" style={{background: 'linear-gradient(45deg, rgba(32, 178, 170, 0.1), rgba(255, 99, 71, 0.1))'}}>
                       <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                         width: '60px',
                         height: '60px',
                         background: 'linear-gradient(45deg, #FFD700, #FF6347)'
                       }}>
                         <Award size={24} className="text-white" />
                       </div>
                       <h4 className="fw-bold" style={{color: '#2c3e50'}}>{dashboardData?.loyalty_points || 0}</h4>
                       <div className="text-muted">Available Points</div>
                     </div>
                   </div>
                   
                   <div className="col-md-4">
                     <div className="text-center p-4 rounded-3" style={{background: 'rgba(50, 205, 50, 0.1)'}}>
                       <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                         width: '60px',
                         height: '60px',
                         background: 'linear-gradient(45deg, #32CD32, #20B2AA)'
                       }}>
                         <Star size={24} className="text-white" />
                       </div>
                       <h4 className="fw-bold" style={{color: '#2c3e50'}}>{dashboardData?.membership_tier || 'Bronze'}</h4>
                       <div className="text-muted">Membership Tier</div>
                     </div>
                   </div>

                   <div className="col-md-4">
                     <div className="text-center p-4 rounded-3" style={{background: 'rgba(138, 43, 226, 0.1)'}}>
                       <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                         width: '60px',
                         height: '60px',
                         background: 'linear-gradient(45deg, #9370DB, #FF6347)'
                       }}>
                         <Gift size={24} className="text-white" />
                       </div>
                       <h4 className="fw-bold" style={{color: '#2c3e50'}}>
                         {Math.max(0, 500 - (dashboardData?.loyalty_points || 0))}
                       </h4>
                       <div className="text-muted">Points to Next Tier</div>
                     </div>
                   </div>
                 </div>

                 <div className="mt-4">
                   <div className="d-flex justify-content-between align-items-center mb-2">
                     <span className="text-muted">Progress to Next Tier</span>
                     <span className="text-muted">
                       {Math.min(100, ((dashboardData?.loyalty_points || 0) / 500) * 100).toFixed(0)}%
                     </span>
                   </div>
                   <div className="progress" style={{height: '8px'}}>
                     <div 
                       className="progress-bar"
                       style={{
                         width: `${Math.min(100, ((dashboardData?.loyalty_points || 0) / 500) * 100)}%`,
                         background: 'linear-gradient(45deg, #20B2AA, #FF6347)'
                       }}
                     ></div>
                   </div>
                   <div className="mt-2 text-center">
                     <small className="text-muted">
                       {dashboardData?.loyalty_points >= 500 
                         ? 'Congratulations! You\'ve reached the next tier!' 
                         : `Spend KES ${((500 - (dashboardData?.loyalty_points || 0)) * 10).toLocaleString()} more to reach the next tier!`
                       }
                     </small>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>

     {/* M-Pesa Payment Modal */}
     {showPaymentModal && selectedOrder && (
       <MpesaPayment
         order={selectedOrder}
         onPaymentSuccess={onPaymentSuccess}
         onCancel={() => {
           setShowPaymentModal(false);
           setSelectedOrder(null);
         }}
       />
     )}
   </div>
 );
};

export default CustomerDashboard;
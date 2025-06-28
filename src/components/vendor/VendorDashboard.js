import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import { 
  Package, TrendingUp, Star, AlertTriangle, Users, DollarSign, Clock, 
  CheckCircle, XCircle, Eye, Settings, BarChart3, Plus, Minus, Phone,
  MapPin, User, LogOut, Bell, Filter, Search, Calendar, Download,
  Truck, Home, CreditCard, Edit, Trash2, RefreshCw, Wrench
} from 'lucide-react';
import toast from 'react-hot-toast';

// Product Categories and Brands Data
const PRODUCT_CATEGORIES = {
  gas_cylinders: {
    name: 'Gas Cylinders',
    icon: Package,
    subcategories: ['3kg', '6kg', '13kg', '35kg', '50kg']
  },
  gas_accessories: {
    name: 'Gas Accessories',
    icon: Wrench,
    subcategories: ['regulators', 'grills', 'burners', 'hoses', 'connectors', 'gauges', 'valves', 'thermometers']
  }
};

const GAS_BRANDS = {
  hashi: {
    name: 'Hashi Gas',
    color: '#FF6B35',
    logo: '/images/brands/hashi-logo.png'
  },
  kgas: {
    name: 'K-Gas',
    color: '#2ECC71',
    logo: '/images/brands/kgas-logo.png'
  },
  progas: {
    name: 'ProGas',
    color: '#3498DB',
    logo: '/images/brands/progas-logo.png'
  },
  total: {
    name: 'Total Gas',
    color: '#E74C3C',
    logo: '/images/brands/total-logo.png'
  },
  oryx: {
    name: 'Oryx Gas',
    color: '#9B59B6',
    logo: '/images/brands/oryx-logo.png'
  },
  universal: {
    name: 'Universal',
    color: '#34495E',
    logo: '/images/brands/universal-logo.png'
  }
};

const PRODUCT_IMAGES = {
  // Gas Cylinders by brand and size
  'hashi_3kg': '/images/products/cylinders/hashi-3kg.jpg',
  'hashi_6kg': '/images/products/cylinders/hashi-6kg.jpg',
  'hashi_13kg': '/images/products/cylinders/hashi-13kg.jpg',
  'hashi_35kg': '/images/products/cylinders/hashi-35kg.jpg',
  'hashi_50kg': '/images/products/cylinders/hashi-50kg.jpg',
  
  'kgas_3kg': '/images/products/cylinders/kgas-3kg.jpg',
  'kgas_6kg': '/images/products/cylinders/kgas-6kg.jpg',
  'kgas_13kg': '/images/products/cylinders/kgas-13kg.jpg',
  'kgas_35kg': '/images/products/cylinders/kgas-35kg.jpg',
  'kgas_50kg': '/images/products/cylinders/kgas-50kg.jpg',
  
  'progas_3kg': '/images/products/cylinders/progas-3kg.jpg',
  'progas_6kg': '/images/products/cylinders/progas-6kg.jpg',
  'progas_13kg': '/images/products/cylinders/progas-13kg.jpg',
  'progas_35kg': '/images/products/cylinders/progas-35kg.jpg',
  'progas_50kg': '/images/products/cylinders/progas-50kg.jpg',
  
  'total_3kg': '/images/products/cylinders/total-3kg.jpg',
  'total_6kg': '/images/products/cylinders/total-6kg.jpg',
  'total_13kg': '/images/products/cylinders/total-13kg.jpg',
  'total_35kg': '/images/products/cylinders/total-35kg.jpg',
  'total_50kg': '/images/products/cylinders/total-50kg.jpg',
  
  'oryx_3kg': '/images/products/cylinders/oryx-3kg.jpg',
  'oryx_6kg': '/images/products/cylinders/oryx-6kg.jpg',
  'oryx_13kg': '/images/products/cylinders/oryx-13kg.jpg',
  'oryx_35kg': '/images/products/cylinders/oryx-35kg.jpg',
  'oryx_50kg': '/images/products/cylinders/oryx-50kg.jpg',
  
  // Gas Accessories
  'regulators': '/images/products/accessories/gas-regulator.jpg',
  'grills': '/images/products/accessories/gas-grill.jpg',
  'burners': '/images/products/accessories/gas-burner.jpg',
  'hoses': '/images/products/accessories/gas-hose.jpg',
  'connectors': '/images/products/accessories/gas-connector.jpg',
  'gauges': '/images/products/accessories/pressure-gauge.jpg',
  'valves': '/images/products/accessories/gas-valve.jpg',
  'thermometers': '/images/products/accessories/gas-thermometer.jpg'
};

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [vendorStats, setVendorStats] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [availableRiders, setAvailableRiders] = useState([]);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Product Modal States
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    stock: '',
    min_stock: '5',
    description: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchVendorStats(),
        fetchPendingOrders(),
        fetchActiveOrders(),
        fetchInventory(),
        fetchAvailableRiders(),
        fetchBusinessProfile(),
        fetchAnalytics()
      ]);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      toast.error('Some data could not be loaded');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorStats = async () => {
    try {
      const response = await apiClient.get('/vendors/dashboard/');
      setVendorStats(response.data);
    } catch (error) {
      console.error('Failed to fetch vendor stats:', error);
      setVendorStats({
        total_orders: 156,
        pending_orders: 8,
        completed_orders: 142,
        total_revenue: 2500000.00,
        average_rating: 4.8,
        low_stock_items: 3,
        active_promotions: 2
      });
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const response = await apiClient.get('/vendors/orders/?status=pending');
      setPendingOrders(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch pending orders:', error);
      setPendingOrders([
        {
          id: 1,
          order_number: 'KAA20240628001',
          customer_name: 'John Doe',
          customer_phone: '+254712345678',
          items_description: '13kg Hashi Gas Cylinder',
          total_amount: 2400,
          delivery_address: 'Nairobi CBD',
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const fetchActiveOrders = async () => {
    try {
      const response = await apiClient.get('/vendors/orders/?status=active');
      setActiveOrders(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch active orders:', error);
      setActiveOrders([
        {
          id: 2,
          order_number: 'KAA20240628002',
          customer_name: 'Jane Smith',
          customer_phone: '+254723456789',
          items_description: '6kg K-Gas Cylinder + Regulator',
          total_amount: 1800,
          delivery_address: 'Westlands',
          status: 'confirmed',
          estimated_delivery_time: new Date(Date.now() + 3600000).toISOString()
        }
      ]);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await apiClient.get('/vendors/inventory/');
      setInventory(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      // Mock data for demonstration
      setInventory([
        {
          id: 1,
          name: 'Hashi 13kg Cylinder',
          brand: 'hashi',
          category: 'gas_cylinders',
          subcategory: '13kg',
          price: 2400,
          stock: 25,
          min_stock: 5,
          image: PRODUCT_IMAGES['hashi_13kg'],
          description: 'High-quality LPG cylinder from Hashi Gas'
        },
        {
          id: 2,
          name: 'K-Gas 6kg Cylinder',
          brand: 'kgas',
          category: 'gas_cylinders',
          subcategory: '6kg',
          price: 1600,
          stock: 3,
          min_stock: 5,
          image: PRODUCT_IMAGES['kgas_6kg'],
          description: 'Compact 6kg cylinder perfect for small households'
        },
        {
          id: 3,
          name: 'Gas Regulator',
          brand: 'universal',
          category: 'gas_accessories',
          subcategory: 'regulators',
          price: 800,
          stock: 12,
          min_stock: 3,
          image: PRODUCT_IMAGES['regulators'],
          description: 'Universal gas regulator compatible with all cylinder brands'
        }
      ]);
    }
  };

  const fetchAvailableRiders = async () => {
    try {
      const response = await apiClient.get('/riders/available/');
      setAvailableRiders(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch available riders:', error);
      setAvailableRiders([
        { id: 1, name: 'Michael Ochieng', rating: 4.8 },
        { id: 2, name: 'Grace Wanjiku', rating: 4.9 },
        { id: 3, name: 'David Mwangi', rating: 4.7 }
      ]);
    }
  };

  const fetchBusinessProfile = async () => {
    try {
      const response = await apiClient.get('/vendors/profile/');
      setBusinessProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch business profile:', error);
      setBusinessProfile({
        business_name: user?.username || 'My Gas Business',
        business_type: user?.vendor_type || 'retailer',
        is_verified: user?.is_verified || false,
        operating_hours: {},
        delivery_radius: 10
      });
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await apiClient.get('/vendors/analytics/?days=30');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setAnalytics({
        daily_sales: [],
        top_products: [],
        customer_ratings: [],
        revenue_trend: []
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await apiClient.post(`/vendors/orders/${orderId}/accept/`);
      toast.success('Order accepted successfully!');
      
      const order = pendingOrders.find(o => o.id === orderId);
      if (order) {
        setPendingOrders(orders => orders.filter(o => o.id !== orderId));
        setActiveOrders(orders => [...orders, { ...order, status: 'confirmed' }]);
      }
      
      fetchVendorStats();
    } catch (error) {
      console.error('Failed to accept order:', error);
      toast.error('Failed to accept order');
    }
  };

  const handleDeclineOrder = async (orderId, reason = '') => {
    try {
      await apiClient.post(`/vendors/orders/${orderId}/decline/`, { reason });
      toast.success('Order declined');
      
      setPendingOrders(orders => orders.filter(o => o.id !== orderId));
      fetchVendorStats();
    } catch (error) {
      console.error('Failed to decline order:', error);
      toast.error('Failed to decline order');
    }
  };

  const handleAssignRider = async (orderId, riderId) => {
    try {
      await apiClient.post(`/vendors/orders/${orderId}/assign-rider/`, { rider: riderId });
      toast.success('Rider assigned successfully!');
      
      setActiveOrders(orders => 
        orders.map(o => 
          o.id === orderId 
            ? { ...o, status: 'out_for_delivery', rider_id: riderId }
            : o
        )
      );
    } catch (error) {
      console.error('Failed to assign rider:', error);
      toast.error('Failed to assign rider');
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await apiClient.post(`/vendors/inventory/${productId}/restock/`, { 
        quantity: newStock 
      });
      toast.success('Stock updated successfully!');
      
      setInventory(items => 
        items.map(item => 
          item.id === productId 
            ? { ...item, stock: newStock }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to update stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const handleUpdatePrice = async (productId, newPrice) => {
    try {
      await apiClient.patch(`/vendors/inventory/${productId}/`, { 
        price: newPrice 
      });
      toast.success('Price updated successfully!');
      
      setInventory(items => 
        items.map(item => 
          item.id === productId 
            ? { ...item, price: newPrice }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to update price:', error);
      toast.error('Failed to update price');
    }
  };

  const getProductImage = (brand, category, subcategory) => {
    if (category === 'gas_cylinders') {
      return PRODUCT_IMAGES[`${brand}_${subcategory}`] || '/images/products/default-cylinder.jpg';
    } else {
      return PRODUCT_IMAGES[subcategory] || '/images/accessories/default-accessory.jpg';
    }
  };

  const generateProductName = (brand, category, subcategory) => {
    if (category === 'gas_cylinders') {
      return `${GAS_BRANDS[brand]?.name || brand} ${subcategory} Cylinder`;
    } else {
      const accessoryName = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
      return accessoryName.replace(/s$/, ''); // Remove trailing 's' for singular
    }
  };

  const resetProductForm = () => {
    setShowInventoryModal(false);
    setSelectedProduct(null);
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedSubcategory('');
    setProductData({
      name: '',
      price: '',
      stock: '',
      min_stock: '5',
      description: ''
    });
  };

  const openEditProduct = (product) => {
    setSelectedProduct(product);
    setSelectedCategory(product.category);
    setSelectedBrand(product.brand);
    setSelectedSubcategory(product.subcategory);
    setProductData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      min_stock: product.min_stock.toString(),
      description: product.description || ''
    });
    setShowInventoryModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/vendors/inventory/${productId}/`);
        setInventory(items => items.filter(item => item.id !== productId));
        toast.success('Product deleted successfully!');
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!selectedCategory || !selectedSubcategory || !productData.price || !productData.stock) {
        toast.error('Please fill in all required fields');
        return;
      }

      const productImage = getProductImage(selectedBrand, selectedCategory, selectedSubcategory);
      const productName = generateProductName(selectedBrand, selectedCategory, selectedSubcategory);
      
      const newProduct = {
        name: productName,
        brand: selectedBrand,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        min_stock: parseInt(productData.min_stock),
        description: productData.description,
        image: productImage
      };

      if (selectedProduct) {
        // Update existing product
        await apiClient.patch(`/vendors/inventory/${selectedProduct.id}/`, newProduct);
        setInventory(items => 
          items.map(item => 
            item.id === selectedProduct.id 
              ? { ...item, ...newProduct }
              : item
          )
        );
        toast.success('Product updated successfully!');
      } else {
        // Add new product
        const response = await apiClient.post('/vendors/inventory/', newProduct);
        setInventory(items => [...items, { ...newProduct, id: response.data.id || Date.now() }]);
        toast.success('Product added successfully!');
      }

      resetProductForm();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    }
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

  const filteredPendingOrders = pendingOrders.filter(order => {
    const matchesSearch = order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.order_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-vh-100" style={{background: '#f8f9fa'}}>
      {/* Header */}
      <nav className="navbar navbar-dark sticky-top" style={{
        background: 'linear-gradient(135deg, #20B2AA 0%, #FF6347 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold fs-3">Kaanagas Vendor</span>
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <Bell size={24} className="text-white" style={{cursor: 'pointer'}} />
              {pendingOrders.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.7rem'}}>
                  {pendingOrders.length}
                </span>
              )}
            </div>
            <div className="d-flex align-items-center gap-2 text-white">
              <div className="rounded-circle bg-white bg-opacity-20 p-2">
                <Users size={20} />
              </div>
              <div>
                <div className="fw-medium">{businessProfile?.business_name || user?.username}</div>
                <small className="opacity-75">
                  {businessProfile?.is_verified ? '✅ Verified' : '⏳ Pending Verification'}
                </small>
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
                <h4 className="fw-bold" style={{color: '#2c3e50'}}>{vendorStats?.total_orders || 0}</h4>
                <small className="text-muted">Total Orders</small>
                <div className="small text-success mt-1">↗ +12% this month</div>
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
                  <DollarSign size={24} className="text-white" />
                </div>
                <h4 className="fw-bold" style={{color: '#2c3e50'}}>
                  KES {((vendorStats?.total_revenue || 0) / 1000).toFixed(0)}K
                </h4>
                <small className="text-muted">Total Revenue</small>
                <div className="small text-success mt-1">↗ +8% this week</div>
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
                  <Star size={24} className="text-white" />
                </div>
                <h4 className="fw-bold" style={{color: '#2c3e50'}}>
                  {(vendorStats?.average_rating || 0).toFixed(1)}
                </h4>
                <small className="text-muted">Average Rating</small>
                <div className="small text-warning mt-1">★★★★★ Excellent</div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 card-modern">
              <div className="card-body p-4 text-center">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(45deg, #e74c3c, #FF6347)'
                }}>
                  <AlertTriangle size={24} className="text-white" />
                </div>
                <h4 className="fw-bold" style={{color: '#e74c3c'}}>{vendorStats?.low_stock_items || 0}</h4>
                <small className="text-muted">Low Stock Items</small>
                <div className="small text-danger mt-1">Needs attention</div>
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
                { id: 'orders', label: 'Orders', icon: Package },
                { id: 'inventory', label: 'Inventory', icon: Settings },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'profile', label: 'Business', icon: User }
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
                  {tab.id === 'orders' && pendingOrders.length > 0 && (
                    <span className="badge bg-danger rounded-pill ms-2">
                      {pendingOrders.length}
                    </span>
                  )}
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
                        Welcome back, {businessProfile?.business_name || user?.first_name}! 👋
                      </h3>
                      <p className="text-muted mb-3">
                        Manage your orders, inventory, and grow your business with Kaanagas.
                      </p>
                      <div className="d-flex gap-3">
                        <button 
                          className="btn btn-primary-gradient rounded-pill px-4"
                          onClick={() => setActiveTab('orders')}
                        >
                          <Package size={16} className="me-2" />
                          View Orders ({pendingOrders.length})
                        </button>
                        <button 
                          className="btn btn-outline-primary rounded-pill px-4"
                          onClick={() => setActiveTab('inventory')}
                        >
                          <Settings size={16} className="me-2" />
                          Manage Inventory
                        </button>
                      </div>
                    </div>
                    <div className="col-md-4 text-center">
                      <div className="d-flex justify-content-around">
                        <div className="text-center">
                          <div className="fw-bold fs-4" style={{color: '#20B2AA'}}>
                            {vendorStats?.pending_orders || 0}
                          </div>
                          <small className="text-muted">Pending</small>
                        </div>
                        <div className="text-center">
                          <div className="fw-bold fs-4" style={{color: '#FF6347'}}>
                            {activeOrders.length || 0}
                          </div>
                          <small className="text-muted">Active</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Orders Alert */}
            {pendingOrders.length > 0 && (
              <div className="col-12">
                <div className="alert alert-warning border-0 shadow-sm" style={{borderRadius: '15px'}}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                        width: '40px',
                        height: '40px',
                        background: '#fff3cd'
                      }}>
                        <Clock size={20} style={{color: '#856404'}} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1" style={{color: '#856404'}}>
                          {pendingOrders.length} order{pendingOrders.length !== 1 ? 's' : ''} waiting for your response
                        </h6>
                        <p className="mb-0 small" style={{color: '#856404'}}>
                         Respond quickly to maintain good customer service
                       </p>
                     </div>
                   </div>
                   <button 
                     className="btn btn-warning rounded-pill"
                     onClick={() => setActiveTab('orders')}
                   >
                     Review Orders
                   </button>
                 </div>
               </div>
             </div>
           )}

           {/* Quick Actions */}
           <div className="col-12">
             <div className="row g-3">
               <div className="col-md-3">
                 <div className="card border-0 shadow-sm card-modern h-100" style={{cursor: 'pointer'}}
                      onClick={() => setActiveTab('orders')}>
                   <div className="card-body p-4 text-center">
                     <Package size={32} className="mb-3" style={{color: '#20B2AA'}} />
                     <h6 className="fw-bold">Manage Orders</h6>
                     <small className="text-muted">Accept, decline & track orders</small>
                   </div>
                 </div>
               </div>
               <div className="col-md-3">
                 <div className="card border-0 shadow-sm card-modern h-100" style={{cursor: 'pointer'}}
                      onClick={() => setActiveTab('inventory')}>
                   <div className="card-body p-4 text-center">
                     <Settings size={32} className="mb-3" style={{color: '#FF6347'}} />
                     <h6 className="fw-bold">Update Inventory</h6>
                     <small className="text-muted">Manage stock & pricing</small>
                   </div>
                 </div>
               </div>
               <div className="col-md-3">
                 <div className="card border-0 shadow-sm card-modern h-100" style={{cursor: 'pointer'}}
                      onClick={() => setActiveTab('analytics')}>
                   <div className="card-body p-4 text-center">
                     <BarChart3 size={32} className="mb-3" style={{color: '#FFD700'}} />
                     <h6 className="fw-bold">View Analytics</h6>
                     <small className="text-muted">Sales reports & insights</small>
                   </div>
                 </div>
               </div>
               <div className="col-md-3">
                 <div className="card border-0 shadow-sm card-modern h-100" style={{cursor: 'pointer'}}
                      onClick={() => setActiveTab('profile')}>
                   <div className="card-body p-4 text-center">
                     <Users size={32} className="mb-3" style={{color: '#32CD32'}} />
                     <h6 className="fw-bold">Business Profile</h6>
                     <small className="text-muted">Update business info</small>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Orders Tab */}
       {activeTab === 'orders' && (
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
                         placeholder="Search orders by customer or order number..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         style={{borderRadius: '12px'}}
                       />
                     </div>
                   </div>
                   <div className="col-md-3">
                     <select
                       className="form-select"
                       value={statusFilter}
                       onChange={(e) => setStatusFilter(e.target.value)}
                       style={{borderRadius: '12px'}}
                     >
                       <option value="all">All Orders</option>
                       <option value="pending">Pending</option>
                       <option value="confirmed">Confirmed</option>
                       <option value="preparing">Preparing</option>
                       <option value="out_for_delivery">Out for Delivery</option>
                     </select>
                   </div>
                   <div className="col-md-3">
                     <button 
                       className="btn btn-outline-primary w-100" 
                       style={{borderRadius: '12px'}}
                       onClick={fetchAllData}
                     >
                       <RefreshCw size={16} className="me-2" />
                       Refresh
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* Pending Orders */}
           <div className="col-12">
             <div className="card border-0 shadow-sm card-modern">
               <div className="card-body p-4">
                 <div className="d-flex justify-content-between align-items-center mb-4">
                   <h5 className="fw-bold mb-0" style={{color: '#2c3e50'}}>
                     <Clock size={20} className="me-2" style={{color: '#20B2AA'}} />
                     Pending Orders ({filteredPendingOrders.length})
                   </h5>
                   {pendingOrders.length > 0 && (
                     <span className="badge bg-warning rounded-pill">Action Required</span>
                   )}
                 </div>

                 {filteredPendingOrders.length === 0 ? (
                   <div className="text-center py-5">
                     <Clock size={48} className="text-muted mb-3" />
                     <h6 className="text-muted">No pending orders</h6>
                     <p className="text-muted">
                       {pendingOrders.length === 0 
                         ? 'All caught up! New orders will appear here.'
                         : 'No orders match your current filters.'
                       }
                     </p>
                   </div>
                 ) : (
                   <div className="row g-3">
                     {filteredPendingOrders.map(order => (
                       <div key={order.id} className="col-12">
                         <div className="border rounded-3 p-3" style={{
                           background: 'linear-gradient(45deg, rgba(32, 178, 170, 0.05), rgba(255, 99, 71, 0.05))',
                           border: '1px solid rgba(32, 178, 170, 0.2)'
                         }}>
                           <div className="row align-items-center">
                             <div className="col-md-4">
                               <div className="fw-bold mb-1" style={{color: '#2c3e50'}}>
                                 #{order.order_number || order.id}
                               </div>
                               <div className="text-muted mb-1">{order.customer_name || 'Customer'}</div>
                               <div className="fw-medium">{order.items_description || 'Gas order'}</div>
                               <div className="small text-muted">
                                 <Clock size={12} className="me-1" />
                                 {order.created_at ? 
                                   `${Math.floor((Date.now() - new Date(order.created_at)) / (1000 * 60))} mins ago` :
                                   'Just now'
                                 }
                               </div>
                             </div>
                             
                             <div className="col-md-3">
                               <div className="fw-bold text-success mb-1">
                                 KES {(order.total_amount || 0).toLocaleString()}
                               </div>
                               <div className="small text-muted">{order.delivery_address || 'Pickup'}</div>
                               <div className="small text-muted">
                                 <Phone size={12} className="me-1" />
                                 {order.customer_phone || 'No phone'}
                               </div>
                             </div>
                             
                             <div className="col-md-2">
                               <button 
                                 className="btn btn-sm btn-outline-primary w-100 mb-2"
                                 onClick={() => console.log('View order details:', order)}
                               >
                                 <Eye size={14} className="me-1" />
                                 View Details
                               </button>
                             </div>
                             
                             <div className="col-md-3">
                               <div className="d-flex gap-2">
                                 <button 
                                   className="btn btn-success btn-sm flex-fill"
                                   onClick={() => handleAcceptOrder(order.id)}
                                 >
                                   <CheckCircle size={14} className="me-1" />
                                   Accept
                                 </button>
                                 <button 
                                   className="btn btn-danger btn-sm flex-fill"
                                   onClick={() => handleDeclineOrder(order.id)}
                                 >
                                   <XCircle size={14} className="me-1" />
                                   Decline
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
           </div>

           {/* Active Orders */}
           {activeOrders.length > 0 && (
             <div className="col-12">
               <div className="card border-0 shadow-sm card-modern">
                 <div className="card-body p-4">
                   <h5 className="fw-bold mb-4" style={{color: '#2c3e50'}}>
                     <Package size={20} className="me-2" style={{color: '#20B2AA'}} />
                     Active Orders ({activeOrders.length})
                   </h5>

                   <div className="row g-3">
                     {activeOrders.map(order => (
                       <div key={order.id} className="col-12">
                         <div className="card border-0" style={{
                           background: 'linear-gradient(45deg, rgba(50, 205, 50, 0.05), rgba(32, 178, 170, 0.05))',
                           border: '1px solid rgba(50, 205, 50, 0.2)'
                         }}>
                           <div className="card-body p-4">
                             <div className="row align-items-center">
                               <div className="col-md-4">
                                 <div className="d-flex align-items-center gap-3">
                                   <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                                     width: '50px',
                                     height: '50px',
                                     background: 'linear-gradient(45deg, #32CD32, #20B2AA)'
                                     }}>
                                    <Package size={20} className="text-white" />
                                  </div>
                                  <div>
                                    <div className="fw-bold" style={{color: '#2c3e50'}}>
                                      #{order.order_number || order.id}
                                    </div>
                                    <div className="text-muted">{order.customer_name || 'Customer'}</div>
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
                                    {(order.status || 'confirmed').replace('_', ' ').toUpperCase()}
                                  </span>
                                  <div className="fw-bold text-success">
                                    KES {(order.total_amount || 0).toLocaleString()}
                                  </div>
                                  <div className="small text-muted">
                                    ETA: {order.estimated_delivery_time ? 
                                      new Date(order.estimated_delivery_time).toLocaleTimeString() : 
                                      'Calculating...'
                                    }
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-2">
                                {order.rider_name ? (
                                  <div className="text-center">
                                    <div className="fw-medium text-success mb-1">
                                      <Truck size={14} className="me-1" />
                                      Assigned
                                    </div>
                                    <div className="small text-muted">{order.rider_name}</div>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <div className="fw-medium text-warning mb-1">
                                      <Clock size={14} className="me-1" />
                                      No Rider
                                    </div>
                                    <div className="small text-muted">Needs assignment</div>
                                  </div>
                                )}
                              </div>

                              <div className="col-md-3">
                                <div className="d-flex flex-column gap-2">
                                  {!order.rider_id && availableRiders.length > 0 && (
                                    <div className="dropdown">
                                      <button 
                                        className="btn btn-sm btn-outline-primary dropdown-toggle w-100"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                      >
                                        <Truck size={14} className="me-1" />
                                        Assign Rider
                                      </button>
                                      <ul className="dropdown-menu">
                                        {availableRiders.slice(0, 3).map(rider => (
                                          <li key={rider.id}>
                                            <button
                                              className="dropdown-item"
                                              onClick={() => handleAssignRider(order.id, rider.id)}
                                            >
                                              <div className="d-flex justify-content-between">
                                                <span>{rider.name || `Rider ${rider.id}`}</span>
                                                <small className="text-muted">
                                                  ⭐ {rider.rating || '4.5'}
                                                </small>
                                              </div>
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  <button 
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => window.open(`tel:${order.customer_phone}`)}
                                  >
                                    <Phone size={14} className="me-1" />
                                    Call Customer
                                  </button>
                                  
                                  <button className="btn btn-sm btn-outline-info">
                                    <Eye size={14} className="me-1" />
                                    Track Order
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
                                    background: 'linear-gradient(45deg, #32CD32, #20B2AA)'
                                  }}
                                ></div>
                              </div>
                            </div>
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

      {/* Enhanced Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="row g-4">
          {/* Inventory Header */}
          <div className="col-12">
            <div className="card border-0 shadow-sm card-modern">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0" style={{color: '#2c3e50'}}>
                    <Package size={20} className="me-2" style={{color: '#20B2AA'}} />
                    Inventory Management
                  </h5>
                  <button 
                    className="btn btn-primary-gradient rounded-pill px-4"
                    onClick={() => setShowInventoryModal(true)}
                  >
                    <Plus size={16} className="me-2" />
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-12">
            <div className="card border-0 shadow-sm card-modern">
              <div className="card-body p-3">
                <div className="row g-2">
                  <div className="col-md-4">
                    <select className="form-select" style={{borderRadius: '10px'}}>
                      <option value="">All Categories</option>
                      <option value="gas_cylinders">Gas Cylinders</option>
                      <option value="gas_accessories">Gas Accessories</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select" style={{borderRadius: '10px'}}>
                      <option value="">All Brands</option>
                      {Object.entries(GAS_BRANDS).map(([key, brand]) => (
                        <option key={key} value={key}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <Search size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search products..."
                        style={{borderRadius: '0 10px 10px 0'}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Items Grid */}
          <div className="col-12">
            <div className="card border-0 shadow-sm card-modern">
              <div className="card-body p-4">
                {inventory.length === 0 ? (
                  <div className="text-center py-5">
                    <Package size={48} className="text-muted mb-3" />
                    <h6 className="text-muted">No inventory items</h6>
                    <p className="text-muted mb-3">Add your first product to start selling</p>
                    <button 
                      className="btn btn-primary-gradient rounded-pill px-4"
                      onClick={() => setShowInventoryModal(true)}
                    >
                      <Plus size={16} className="me-2" />
                      Add Product
                    </button>
                  </div>
                ) : (
                  <div className="row g-4">
                    {inventory.map(item => (
                      <div key={item.id} className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                          <div className="position-relative">
                            <img 
                              src={item.image || '/images/products/default.jpg'} 
                              alt={item.name}
                              className="card-img-top"
                              style={{
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '15px 15px 0 0'
                              }}
                              onError={(e) => {
                                e.target.src = '/images/products/default.jpg';
                              }}
                            />
                            
                            {/* Stock Status Badge */}
                            <div className="position-absolute top-0 end-0 m-2">
                              <span className={`badge rounded-pill ${
                                (item.stock || 0) <= (item.min_stock || 5) ? 'bg-danger' : 
                                (item.stock || 0) <= (item.min_stock || 5) * 2 ? 'bg-warning' : 'bg-success'
                              }`}>
                                {(item.stock || 0) <= (item.min_stock || 5) ? 'Low Stock' :
                                 (item.stock || 0) <= (item.min_stock || 5) * 2 ? 'Medium' : 'In Stock'}
                              </span>
                            </div>
                            
                            {/* Brand Badge */}
                            {item.brand && GAS_BRANDS[item.brand] && (
                              <div className="position-absolute top-0 start-0 m-2">
                                <div 
                                  className="badge rounded-pill"
                                  style={{
                                    backgroundColor: GAS_BRANDS[item.brand].color,
                                    color: 'white'
                                  }}
                                >
                                  {GAS_BRANDS[item.brand].name}
                                </div>
                              </div>
                            )}

                            {/* Quick Actions */}
                            <div className="position-absolute bottom-0 end-0 m-2">
                              <div className="btn-group">
                                <button 
                                  className="btn btn-sm btn-light"
                                  onClick={() => openEditProduct(item)}
                                >
                                  <Edit size={12} />
                                </button>
                                <button 
                                  className="btn btn-sm btn-light text-danger"
                                  onClick={() => handleDeleteProduct(item.id)}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="card-body p-3">
                            <h6 className="fw-bold mb-2" style={{color: '#2c3e50'}}>
                              {item.name}
                            </h6>
                            
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div>
                                <div className="fw-bold text-success fs-5">
                                  KES {(item.price || 0).toLocaleString()}
                                </div>
                                <small className="text-muted">
                                  Stock: {item.stock || 0} units
                                </small>
                              </div>
                              <div className="text-end">
                                <div className="btn-group btn-group-sm">
                                  <button 
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleUpdateStock(item.id, Math.max(0, (item.stock || 0) - 1))}
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <button 
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleUpdateStock(item.id, (item.stock || 0) + 1)}
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Category and Description */}
                            <div className="mb-2">
                              <span className="badge bg-light text-dark me-2">
                                {PRODUCT_CATEGORIES[item.category]?.name || 'Product'}
                              </span>
                              {item.subcategory && (
                                <span className="badge bg-secondary">
                                  {item.subcategory}
                                </span>
                              )}
                            </div>

                            {item.description && (
                              <p className="small text-muted mb-3">
                                {item.description.length > 50 
                                  ? `${item.description.substring(0, 50)}...` 
                                  : item.description
                                }
                              </p>
                            )}

                            {/* Action Buttons */}
                            <div className="d-grid gap-2">
                              <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => openEditProduct(item)}
                              >
                                <Edit size={14} className="me-1" />
                                Edit Product
                              </button>
                              <div className="btn-group">
                                <button 
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => {
                                    const newStock = prompt('Enter restock quantity:', '10');
                                    if (newStock && !isNaN(newStock)) {
                                      handleUpdateStock(item.id, (item.stock || 0) + parseInt(newStock));
                                    }
                                  }}
                                >
                                  <Plus size={12} className="me-1" />
                                  Restock
                                </button>
                                <button 
                                  className="btn btn-outline-info btn-sm"
                                  onClick={() => {
                                    const newPrice = prompt('Enter new price:', item.price);
                                    if (newPrice && !isNaN(newPrice)) {
                                      handleUpdatePrice(item.id, parseFloat(newPrice));
                                    }
                                  }}
                                >
                                  <DollarSign size={12} className="me-1" />
                                  Price
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
          </div>

          {/* Low Stock Alert */}
          {inventory.some(item => (item.stock || 0) <= (item.min_stock || 5)) && (
            <div className="col-12">
              <div className="alert alert-danger border-0 shadow-sm" style={{borderRadius: '15px'}}>
                <div className="d-flex align-items-center gap-3">
                  <AlertTriangle size={24} />
                  <div>
                    <h6 className="fw-bold mb-1">Low Stock Alert!</h6>
                    <p className="mb-0">
                      {inventory.filter(item => (item.stock || 0) <= (item.min_stock || 5)).length} item(s) 
                      running low on stock. Restock soon to avoid missing sales.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="row g-4">
          {/* Analytics Overview */}
          <div className="col-12">
            <div className="card border-0 shadow-sm card-modern">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0" style={{color: '#2c3e50'}}>
                    <BarChart3 size={20} className="me-2" style={{color: '#20B2AA'}} />
                    Business Analytics
                  </h5>
                  <div className="d-flex gap-2">
                    <select className="form-select form-select-sm" style={{borderRadius: '8px'}}>
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 3 months</option>
                    </select>
                    <button className="btn btn-sm btn-outline-primary">
                      <Download size={14} className="me-1" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Sales Metrics */}
                  <div className="col-md-3">
                    <div className="text-center p-3 rounded-3" style={{background: 'rgba(32, 178, 170, 0.1)'}}>
                      <h4 className="fw-bold" style={{color: '#20B2AA'}}>
                        KES {((vendorStats?.total_revenue || 0) / 1000).toFixed(0)}K
                      </h4>
                      <div className="text-muted">Total Revenue</div>
                      <div className="small text-success mt-1">↗ +15% from last month</div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="text-center p-3 rounded-3" style={{background: 'rgba(255, 99, 71, 0.1)'}}>
                      <h4 className="fw-bold" style={{color: '#FF6347'}}>
                        {vendorStats?.total_orders || 0}
                      </h4>
                      <div className="text-muted">Total Orders</div>
                      <div className="small text-success mt-1">↗ +22% from last month</div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="text-center p-3 rounded-3" style={{background: 'rgba(255, 215, 0, 0.1)'}}>
                      <h4 className="fw-bold" style={{color: '#FFD700'}}>
                        KES {(((vendorStats?.total_revenue || 0) / (vendorStats?.total_orders || 1))).toFixed(0)}
                      </h4>
                      <div className="text-muted">Avg Order Value</div>
                      <div className="small text-success mt-1">↗ +8% from last month</div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="text-center p-3 rounded-3" style={{background: 'rgba(50, 205, 50, 0.1)'}}>
                      <h4 className="fw-bold" style={{color: '#32CD32'}}>
                        {(((vendorStats?.completed_orders || 0) / (vendorStats?.total_orders || 1)) * 100).toFixed(1)}%
                      </h4>
                      <div className="text-muted">Completion Rate</div>
                      <div className="small text-success mt-1">↗ +3% from last month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Placeholder */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm card-modern">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Sales Trend</h6>
                <div className="text-center py-5" style={{background: '#f8f9fa', borderRadius: '10px'}}>
                  <BarChart3 size={48} className="text-muted mb-3" />
                  <p className="text-muted">Sales chart will be displayed here</p>
                  <small className="text-muted">Integration with Chart.js coming soon</small>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm card-modern">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Top Products</h6>
                
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{background: '#f8f9fa'}}>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{width: '30px', height: '30px'}}>
                        <span className="text-white small fw-bold">1</span>
                      </div>
                      <div>
                        <div className="fw-medium">13kg LPG Cylinder</div>
                        <div className="small text-muted">156 sold</div>
                      </div>
                    </div>
                    <div className="text-success fw-bold">65%</div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{background: '#f8f9fa'}}>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{width: '30px', height: '30px'}}>
                        <span className="text-white small fw-bold">2</span>
                      </div>
                      <div>
                        <div className="fw-medium">6kg LPG Cylinder</div>
                        <div className="small text-muted">89 sold</div>
                      </div>
                    </div>
                    <div className="text-success fw-bold">25%</div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{background: '#f8f9fa'}}>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-warning d-flex align-items-center justify-content-center" style={{width: '30px', height: '30px'}}>
                        <span className="text-white small fw-bold">3</span>
                      </div>
                      <div>
                        <div className="fw-medium">3kg LPG Cylinder</div>
                        <div className="small text-muted">34 sold</div>
                      </div>
                    </div>
                    <div className="text-success fw-bold">10%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="col-12">
            <div className="card border-0 shadow-sm card-modern">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Customer Satisfaction</h6>
                
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="text-center">
                      <div className="d-flex justify-content-center mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={24} className="text-warning" fill="currentColor" />
                        ))}
                      </div>
                      <h4 className="fw-bold">{(vendorStats?.average_rating || 4.8).toFixed(1)}</h4>
                      <div className="text-muted">Average Rating</div>
                      <div className="small text-success">Based on {vendorStats?.total_orders || 0} reviews</div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="d-flex flex-column gap-2">
                      {[5, 4, 3, 2, 1].map(rating => {
                        const percentage = rating >= 4 ? 80 : rating === 3 ? 15 : 5;
                        return (
                          <div key={rating} className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-1">
                              <span className="small">{rating}</span>
                              <Star size={12} className="text-warning" fill="currentColor" />
                            </div>
                            <div className="flex-grow-1">
                              <div className="progress" style={{height: '8px'}}>
                                <div 
                                  className="progress-bar bg-warning"
                                  style={{width: `${percentage}%`}}
                                ></div>
                              </div>
                            </div>
                            <span className="small text-muted">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Profile Tab */}
      {activeTab === 'profile' && (
        <div className="row g-4">
          {/* Business Information */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm card-modern">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4" style={{color: '#2c3e50'}}>
                  <Users size={20} className="me-2" style={{color: '#20B2AA'}} />
                  Business Information
                </h5>
                
                <div className="text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(45deg, #20B2AA, #FF6347)'
                  }}>
                    <Users size={32} className="text-white" />
                  </div>
                  <h6 className="fw-bold">{businessProfile?.business_name || user?.username}</h6>
                  <span className={`badge rounded-pill ${businessProfile?.is_verified ? 'bg-success' : 'bg-warning'}`}>
                    {businessProfile?.is_verified ? 'Verified Business' : 'Pending Verification'}
                  </span>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-muted">Business Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={businessProfile?.business_name || user?.username || ''}
                      readOnly
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted">Business Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={businessProfile?.business_type === 'retailer' ? 'Gas Retailer' : 'Gas Refill Station'}
                      readOnly
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  <div className="col-6">
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
                    <label className="form-label text-muted">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={user?.email || ''}
                      readOnly
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                </div>

                <button className="btn btn-primary-gradient w-100 mt-4 rounded-pill">
                  <Edit size={16} className="me-2" />
                  Edit Business Profile
                </button>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm card-modern">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0" style={{color: '#2c3e50'}}>
                    <Clock size={20} className="me-2" style={{color: '#20B2AA'}} />
                    Operating Hours
                  </h5>
                  <button className="btn btn-sm btn-outline-primary rounded-pill">
                    <Edit size={16} className="me-1" />
                    Edit
                  </button>
                </div>

                <div className="d-flex flex-column gap-3">
                  {[
                    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
                    'Friday', 'Saturday', 'Sunday'
                  ].map(day => (
                    <div key={day} className="d-flex justify-content-between align-items-center p-2 rounded" style={{background: '#f8f9fa'}}>
                      <div className="fw-medium">{day}</div>
                      <div className="text-muted">
                        {day === 'Sunday' ? 'Closed' : '8:00 AM - 6:00 PM'}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-3" style={{background: 'rgba(32, 178, 170, 0.1)'}}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <MapPin size={16} style={{color: '#20B2AA'}} />
                    <span className="fw-medium">Delivery Radius</span>
                  </div>
                  <div className="text-muted">
                    Currently delivering within {businessProfile?.delivery_radius || 10}km radius
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="col-12">
            <div className="card border-0 shadow-sm card-modern">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4" style={{color: '#2c3e50'}}>
                  <CreditCard size={20} className="me-2" style={{color: '#20B2AA'}} />
                  Payment & Financial Information
                </h5>

                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="text-center p-4 rounded-3" style={{background: 'linear-gradient(45deg, rgba(32, 178, 170, 0.1), rgba(255, 99, 71, 0.1))'}}>
                      <DollarSign size={32} className="mb-3" style={{color: '#20B2AA'}} />
                      <h4 className="fw-bold" style={{color: '#2c3e50'}}>
                        KES {((vendorStats?.total_revenue || 0) / 1000).toFixed(0)}K
                      </h4>
                      <div className="text-muted">Total Earnings</div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="text-center p-4 rounded-3" style={{background: 'rgba(50, 205, 50, 0.1)'}}>
                      <Calendar size={32} className="mb-3" style={{color: '#32CD32'}} />
                      <h4 className="fw-bold" style={{color: '#2c3e50'}}>
                        KES {(((vendorStats?.total_revenue || 0) / 30)).toFixed(0)}
                      </h4>
                      <div className="text-muted">Daily Average</div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="text-center p-4 rounded-3" style={{background: 'rgba(138, 43, 226, 0.1)'}}>
                      <TrendingUp size={32} className="mb-3" style={{color: '#9370DB'}} />
                      <h4 className="fw-bold" style={{color: '#2c3e50'}}>
                        15%
                      </h4>
                      <div className="text-muted">Commission Rate</div>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mt-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted">Bank Account Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your bank account number"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Bank Name</label>
                    <select className="form-select" style={{borderRadius: '8px'}}>
                      <option value="">Select your bank</option>
                      <option value="kcb">KCB Bank</option>
                      <option value="equity">Equity Bank</option>
                      <option value="cooperative">Co-operative Bank</option>
                      <option value="absa">Absa Bank</option>
                      <option value="ncba">NCBA Bank</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Account Holder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter account holder name"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">M-Pesa Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+254712345678"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                </div>

                <button className="btn btn-primary-gradient rounded-pill px-4 mt-4">
                  <CreditCard size={16} className="me-2" />
                  Update Payment Information
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Enhanced Inventory Modal */}
    {showInventoryModal && (
      <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg" style={{borderRadius: '20px'}}>
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold" style={{color: '#2c3e50'}}>
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </h5>
              <button 
                type="button" 
                className="btn-close"
                onClick={resetProductForm}
              ></button>
            </div>
            
            <div className="modal-body p-4">
              <form>
                {/* Product Category Selection */}
                <div className="mb-4">
                  <label className="form-label fw-medium">Product Category *</label>
                  <div className="row g-3">
                    {Object.entries(PRODUCT_CATEGORIES).map(([key, category]) => (
                      <div key={key} className="col-6">
                        <div 
                          className={`card border-2 h-100 ${selectedCategory === key ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                          style={{cursor: 'pointer', borderRadius: '12px'}}
                          onClick={() => {
                            setSelectedCategory(key);
                            setSelectedSubcategory('');
                            setSelectedBrand('');
                          }}
                        >
                          <div className="card-body text-center p-3">
                            <category.icon size={32} className={selectedCategory === key ? 'text-primary' : 'text-muted'} />
                            <h6 className="mt-2 mb-0">{category.name}</h6>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brand Selection (for cylinders) */}
                {selectedCategory === 'gas_cylinders' && (
                  <div className="mb-4">
                    <label className="form-label fw-medium">Gas Brand *</label>
                    <div className="row g-2">
                      {Object.entries(GAS_BRANDS).map(([key, brand]) => (
                        <div key={key} className="col-4">
                          <div 
                            className={`card border-2 ${selectedBrand === key ? 'border-primary' : 'border-light'}`}
                            style={{cursor: 'pointer', borderRadius: '10px'}}
                            onClick={() => setSelectedBrand(key)}
                          >
                            <div className="card-body text-center p-2">
                              <div 
                                className="rounded-circle mx-auto mb-2"
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  backgroundColor: brand.color,
                                  opacity: selectedBrand === key ? 1 : 0.7
                                }}
                              ></div>
                              <small className="fw-medium">{brand.name}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subcategory Selection */}
                {selectedCategory && (
                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      {selectedCategory === 'gas_cylinders' ? 'Cylinder Size *' : 'Accessory Type *'}
                    </label>
                    <div className="row g-2">
                      {PRODUCT_CATEGORIES[selectedCategory].subcategories.map(subcat => (
                        <div key={subcat} className="col-md-3 col-6">
                          <button
                            type="button"
                            className={`btn btn-outline-primary w-100 ${selectedSubcategory === subcat ? 'active' : ''}`}
                            style={{borderRadius: '10px'}}
                            onClick={() => setSelectedSubcategory(subcat)}
                          >
                            {subcat}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Preview */}
                {selectedCategory && selectedSubcategory && (
                  <div className="mb-4">
                    <label className="form-label fw-medium">Product Preview</label>
                    <div className="card border-light" style={{borderRadius: '12px'}}>
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-auto">
                            <img 
                              src={getProductImage(selectedBrand, selectedCategory, selectedSubcategory)}
                              alt="Product preview"
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                              onError={(e) => {
                                e.target.src = '/images/products/default.jpg';
                              }}
                            />
                          </div>
                          <div className="col">
                            <h6 className="mb-1">
                              {generateProductName(selectedBrand, selectedCategory, selectedSubcategory)}
                            </h6>
                            <small className="text-muted">
                              {PRODUCT_CATEGORIES[selectedCategory]?.name} • {selectedSubcategory}
                              {selectedBrand && GAS_BRANDS[selectedBrand] && ` • ${GAS_BRANDS[selectedBrand].name}`}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Details */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Price (KES) *</label>
                    <div className="input-group">
                      <span className="input-group-text">KES</span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        value={productData.price}
                        onChange={(e) => setProductData({...productData, price: e.target.value})}
                        style={{borderRadius: '0 8px 8px 0'}}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Initial Stock *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={productData.stock}
                      onChange={(e) => setProductData({...productData, stock: e.target.value})}
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Minimum Stock Alert</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="5"
                      value={productData.min_stock}
                      onChange={(e) => setProductData({...productData, min_stock: e.target.value})}
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedCategory ? PRODUCT_CATEGORIES[selectedCategory].name : ''}
                      readOnly
                      style={{borderRadius: '8px', backgroundColor: '#f8f9fa'}}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Product Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Brief description of the product (optional)..."
                      value={productData.description}
                      onChange={(e) => setProductData({...productData, description: e.target.value})}
                      style={{borderRadius: '8px'}}
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="modal-footer border-0 pt-0">
              <button 
                type="button" 
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={resetProductForm}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary-gradient rounded-pill px-4"
                onClick={handleAddProduct}
                disabled={!selectedCategory || !selectedSubcategory || !productData.price || !productData.stock}
              >
                {selectedProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default VendorDashboard;
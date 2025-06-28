import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { 
  Package, Plus, Edit, Trash2, Search, Filter, AlertTriangle, 
  Upload, Eye, Star, TrendingUp, ShoppingCart, DollarSign,
  RefreshCw, Settings, Image, Tag, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [gasCategories, setGasCategories] = useState({
    brands: [],
    sizes: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    gas_product: '',
    stock_quantity: 0,
    price: 0,
    min_stock_alert: 5,
    is_available: true
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchInventory(),
        fetchAvailableProducts(),
        fetchGasCategories()
      ]);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await apiClient.get('/vendors/inventory/');
      setInventory(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setInventory([]);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      const response = await apiClient.get('/core/gas-products/');
      setAvailableProducts(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch available products:', error);
      // Fallback data with realistic LPG products only
      setAvailableProducts([
        {
          id: 1,
          name: "LPG Cylinder",
          brand: "K-Gas",
          size: "13kg",
          category: "cylinder",
          image: "/api/placeholder/200/200",
          base_price: 2400,
          description: "Standard 13kg LPG cylinder from K-Gas"
        },
        {
          id: 2,
          name: "LPG Cylinder",
          brand: "K-Gas",
          size: "6kg",
          category: "cylinder",
          image: "/api/placeholder/200/200",
          base_price: 1200,
          description: "Compact 6kg LPG cylinder from K-Gas"
        },
        {
          id: 3,
          name: "LPG Cylinder",
          brand: "K-Gas",
          size: "3kg",
          category: "cylinder",
          image: "/api/placeholder/200/200",
          base_price: 800,
          description: "Portable 3kg LPG cylinder from K-Gas"
        },
        {
          id: 4,
          name: "LPG Cylinder",
          brand: "ProGas",
          size: "13kg",
          category: "cylinder",
          image: "/api/placeholder/200/200",
          base_price: 2350,
          description: "Standard 13kg LPG cylinder from ProGas"
        },
        {
          id: 5,
          name: "LPG Cylinder",
          brand: "ProGas",
          size: "6kg",
          category: "cylinder",
          image: "/api/placeholder/200/200",
          base_price: 1150,
          description: "Compact 6kg LPG cylinder from ProGas"
        },
        {
          id: 6,
          name: "LPG Cylinder",
          brand: "Total Gas",
          size: "13kg",
          category: "cylinder",
          image: "/api/placeholder/200/200",
          base_price: 2500,
          description: "Premium 13kg LPG cylinder from Total Gas"
        },
        {
          id: 7,
          name: "LPG Cylinder",
          brand: "Total Gas",
          size: "6kg",
          category: "cylinder",
          image: "/api/placeholder/200/200",
          base_price: 1250,
          description: "Premium 6kg LPG cylinder from Total Gas"
        },
        {
          id: 8,
          name: "LPG Cylinder",
          brand: "Hashi Energy",
          size: "13kg",
          category: "cylinder",
          image: "/api/placeholder/200/200",
          base_price: 2380,
          description: "Quality 13kg LPG cylinder from Hashi Energy"
        },
        {
          id: 9,
          name: "LPG Cylinder",
          brand: "Lake Gas",
          size: "50kg",
          category: "commercial",
          image: "/api/placeholder/200/200",
          base_price: 8500,
          description: "Commercial 50kg LPG cylinder from Lake Gas"
        },
        {
          id: 10,
          name: "Gas Regulator",
          brand: "Universal",
          size: "Standard",
          category: "accessory",
          image: "/api/placeholder/200/200",
          base_price: 1500,
          description: "Universal LPG gas pressure regulator"
        },
        {
          id: 11,
          name: "Gas Hose",
          brand: "FlexiGas",
          size: "2m",
          category: "accessory",
          image: "/api/placeholder/200/200",
          base_price: 800,
          description: "High-quality flexible LPG gas hose - 2 meters"
        },
        {
          id: 12,
          name: "Gas Hose",
          brand: "FlexiGas",
          size: "1m",
          category: "accessory",
          image: "/api/placeholder/200/200",
          base_price: 500,
          description: "Compact flexible LPG gas hose - 1 meter"
        }
      ]);
    }
  };

  const fetchGasCategories = async () => {
    try {
      const response = await apiClient.get('/core/gas-categories/');
      setGasCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch gas categories:', error);
      // Fallback categories for LPG only
      setGasCategories({
        brands: ['K-Gas', 'ProGas', 'Total Gas', 'Hashi Energy', 'Lake Gas', 'Universal', 'FlexiGas'],
        sizes: ['3kg', '6kg', '13kg', '50kg', '1m', '2m', 'Standard'],
        categories: [
          { id: 'cylinder', name: 'LPG Cylinders', description: 'Standard LPG gas cylinders' },
          { id: 'commercial', name: 'Commercial LPG', description: 'Large commercial LPG cylinders' },
          { id: 'accessory', name: 'Gas Accessories', description: 'Regulators, hoses, and fittings' }
        ]
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await apiClient.post('/vendors/inventory/', newProduct);
      toast.success('Product added to inventory!');
      setInventory([...inventory, response.data]);
      setShowAddModal(false);
      setNewProduct({
        gas_product: '',
        stock_quantity: 0,
        price: 0,
        min_stock_alert: 5,
        is_available: true
      });
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error('Failed to add product to inventory');
    }
  };

  const handleUpdateProduct = async (productId, updates) => {
    try {
      const response = await apiClient.patch(`/vendors/inventory/${productId}/`, updates);
      toast.success('Product updated successfully!');
      setInventory(inventory.map(item => 
        item.id === productId ? { ...item, ...response.data } : item
      ));
      setShowEditModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to remove this product from your inventory?')) {
      try {
        await apiClient.delete(`/vendors/inventory/${productId}/`);
        toast.success('Product removed from inventory');
        setInventory(inventory.filter(item => item.id !== productId));
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error('Failed to remove product');
      }
    }
  };

  const handleRestockProduct = async (productId, quantity) => {
    try {
      await apiClient.post(`/vendors/inventory/${productId}/restock/`, { quantity });
      toast.success('Stock updated successfully!');
      setInventory(inventory.map(item => 
        item.id === productId 
          ? { ...item, stock_quantity: (item.stock_quantity || 0) + quantity }
          : item
      ));
    } catch (error) {
      console.error('Failed to restock:', error);
      toast.error('Failed to update stock');
    }
  };

  const getProductImage = (product) => {
    if (product.gas_product?.image) {
      return product.gas_product.image;
    }
    
    // Generate LPG-specific placeholder
    const brand = product.gas_product?.brand || 'Generic';
    const size = product.gas_product?.size || '';
    const category = product.gas_product?.category || 'cylinder';
    
    // Different colors for different brands
    const brandColors = {
      'K-Gas': '#FF6B35',
      'ProGas': '#4ECDC4', 
      'Total Gas': '#45B7D1',
      'Hashi Energy': '#96CEB4',
      'Lake Gas': '#FFEAA7',
      'Universal': '#DDA0DD',
      'FlexiGas': '#98D8C8'
    };
    
    const color = brandColors[brand] || '#20B2AA';
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#f8f9fa"/>
        ${category === 'cylinder' ? `
          <ellipse cx="100" cy="160" rx="30" ry="8" fill="${color}" opacity="0.3"/>
          <rect x="80" y="60" width="40" height="100" rx="20" fill="${color}" opacity="0.8"/>
          <circle cx="100" cy="50" r="15" fill="${color}"/>
          <rect x="95" y="35" width="10" height="20" fill="#333"/>
        ` : category === 'accessory' ? `
          <circle cx="100" cy="100" r="60" fill="${color}" opacity="0.2"/>
          <rect x="70" y="90" width="60" height="20" rx="10" fill="${color}" opacity="0.8"/>
          <circle cx="85" cy="100" r="8" fill="#333"/>
          <circle cx="115" cy="100" r="8" fill="#333"/>
        ` : `
          <ellipse cx="100" cy="170" rx="40" ry="10" fill="${color}" opacity="0.3"/>
          <rect x="70" y="50" width="60" height="120" rx="30" fill="${color}" opacity="0.8"/>
          <circle cx="100" cy="40" r="20" fill="${color}"/>
          <rect x="95" y="20" width="10" height="25" fill="#333"/>
        `}
        <text x="100" y="30" text-anchor="middle" fill="#2c3e50" font-size="12" font-weight="bold">${brand}</text>
        <text x="100" y="190" text-anchor="middle" fill="#6c757d" font-size="14" font-weight="bold">${size}</text>
      </svg>
    `)}`;
  };

  const getStockStatus = (item) => {
    const stock = item.stock_quantity || 0;
    const minStock = item.min_stock_alert || 5;
    
    if (stock === 0) return { status: 'out', color: 'danger', text: 'Out of Stock' };
    if (stock <= minStock) return { status: 'low', color: 'warning', text: 'Low Stock' };
    if (stock <= minStock * 2) return { status: 'medium', color: 'info', text: 'Medium Stock' };
    return { status: 'good', color: 'success', text: 'In Stock' };
  };

  const filteredInventory = inventory.filter(item => {
    const product = item.gas_product || {};
    const matchesSearch = 
      (product.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.brand?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.size?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;
    const matchesSize = sizeFilter === 'all' || product.size === sizeFilter;
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      const stockStatus = getStockStatus(item);
      matchesStatus = stockStatus.status === statusFilter;
    }
    
    return matchesSearch && matchesBrand && matchesSize && matchesStatus;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" style={{color: '#20B2AA'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {/* Header */}
      <div className="col-12">
        <div className="card border-0 shadow-sm card-modern">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0" style={{color: '#2c3e50'}}>
                <Package size={20} className="me-2" style={{color: '#20B2AA'}} />
                LPG Inventory Management
              </h5>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary rounded-pill"
                  onClick={fetchAllData}
                >
                  <RefreshCw size={16} className="me-2" />
                  Refresh
                </button>
                <button 
                  className="btn btn-primary-gradient rounded-pill px-4"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={16} className="me-2" />
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="col-12">
        <div className="card border-0 shadow-sm card-modern">
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="position-relative">
                  <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Search products, brands, sizes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{borderRadius: '12px'}}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  style={{borderRadius: '12px'}}
                >
                  <option value="all">All Brands</option>
                  {gasCategories.brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  style={{borderRadius: '12px'}}
                >
                  <option value="all">All Sizes</option>
                  {gasCategories.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{borderRadius: '12px'}}
                >
                  <option value="all">All Status</option>
                  <option value="good">In Stock</option>
                  <option value="medium">Medium Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
              <div className="col-md-2">
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-secondary w-100 dropdown-toggle" 
                    style={{borderRadius: '12px'}}
                    data-bs-toggle="dropdown"
                  >
                    <Filter size={16} className="me-2" />
                    Category
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">All Categories</a></li>
                    {gasCategories.categories.map(category => (
                      <li key={category.id}>
                        <a className="dropdown-item" href="#">{category.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="col-12">
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #20B2AA'}}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="fw-bold mb-1">{inventory.length}</h6>
                    <small className="text-muted">Total Products</small>
                  </div>
                  <Layers size={24} style={{color: '#20B2AA'}} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #28a745'}}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="fw-bold mb-1">
                      {inventory.filter(item => getStockStatus(item).status === 'good').length}
                    </h6>
                    <small className="text-muted">In Stock</small>
                  </div>
                  <Package size={24} style={{color: '#28a745'}} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #ffc107'}}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="fw-bold mb-1">
                      {inventory.filter(item => getStockStatus(item).status === 'low').length}
                    </h6>
                    <small className="text-muted">Low Stock</small>
                  </div>
                  <AlertTriangle size={24} style={{color: '#ffc107'}} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{borderLeft: '4px solid #dc3545'}}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="fw-bold mb-1">
                      {inventory.filter(item => getStockStatus(item).status === 'out').length}
                    </h6>
                    <small className="text-muted">Out of Stock</small>
                  </div>
                  <Package size={24} style={{color: '#dc3545'}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Brand Filter */}
      <div className="col-12">
        <div className="card border-0 shadow-sm card-modern">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">Popular Brands</h6>
            <div className="d-flex flex-wrap gap-2">
              <button 
                className={`btn btn-sm rounded-pill ${brandFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setBrandFilter('all')}
              >
                All Brands
              </button>
              {['K-Gas', 'ProGas', 'Total Gas', 'Hashi Energy'].map(brand => (
                <button 
                  key={brand}
                  className={`btn btn-sm rounded-pill ${brandFilter === brand ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setBrandFilter(brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="col-12">
        {filteredInventory.length === 0 ? (
          <div className="card border-0 shadow-sm card-modern">
            <div className="card-body p-5 text-center">
              <Package size={48} className="text-muted mb-3" />
              <h6 className="text-muted">
                {inventory.length === 0 ? 'No products in inventory' : 'No products match your filters'}
              </h6>
              <p className="text-muted mb-3">
                {inventory.length === 0 
                  ? 'Add your first LPG product to start managing inventory'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              <button 
                className="btn btn-primary-gradient rounded-pill px-4"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={16} className="me-2" />
                Add LPG Product
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {filteredInventory.map(item => {
              const stockStatus = getStockStatus(item);
              const product = item.gas_product || {};
              
              return (
                <div key={item.id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100 card-modern product-card">
                    <div className="position-relative">
                      <img
                        src={getProductImage(item)}
                        alt={product.name}
                        className="card-img-top product-image"
                        style={{height: '200px', objectFit: 'cover'}}
                        onError={(e) => {
                          e.target.src = getProductImage(item);
                        }}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className={`badge bg-${stockStatus.color} rounded-pill`}>
                          {stockStatus.text}
                        </span>
                      </div>
                      {product.brand && (
                        <div className="position-absolute top-0 start-0 m-2">
                          <span className="brand-badge">
                            {product.brand}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="fw-bold mb-1" style={{color: '#2c3e50'}}>
                            {product.name || 'LPG Product'}
                          </h6>
                          <div className="small text-muted">
                            {product.size && <span className="me-2 fw-medium">{product.size}</span>}
                            {product.category && (
                              <span className="badge bg-light text-dark rounded-pill">
                                {product.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                          >
                            <Settings size={14} />
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => {
                                  setSelectedProduct(item);
                                  setShowEditModal(true);
                                }}
                              >
                                <Edit size={14} className="me-2" />
                                Edit
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => {
                                  const quantity = prompt('Enter restock quantity:', '10');
                                  if (quantity && !isNaN(quantity)) {
                                    handleRestockProduct(item.id, parseInt(quantity));
                                  }
                                }}
                              >
                                <Plus size={14} className="me-2" />
                                Restock
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button 
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteProduct(item.id)}
                              >
                                <Trash2 size={14} className="me-2" />
                                Remove
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="small text-muted">Stock Level</span>
                          <span className="small fw-medium">
                            {item.stock_quantity || 0} units
                          </span>
                        </div>
                        <div className="progress stock-progress">
                          <div 
                            className={`progress-bar bg-${stockStatus.color}`}
                            style={{
                              width: `${Math.min(100, ((item.stock_quantity || 0) / ((item.min_stock_alert || 5) * 3)) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div className="fw-bold" style={{color: '#20B2AA'}}>
                            KES {(item.price || 0).toLocaleString()}
                          </div>
                          <div className="small text-muted">
                            Base: KES {(product.base_price || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="small text-muted">Min Alert</div>
                          <div className="fw-medium">{item.min_stock_alert || 5}</div>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-primary flex-fill"
                          onClick={() => {
                            const newPrice = prompt('Enter new price:', item.price);
                            if (newPrice && !isNaN(newPrice)) {
                              handleUpdateProduct(item.id, { price: parseFloat(newPrice) });
                            }
                          }}
                        >
                          <DollarSign size={14} className="me-1" />
                          Price
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-success flex-fill"
                          onClick={() => {
                            const quantity = prompt('Add stock quantity:', '5');
                            if (quantity && !isNaN(quantity)) {
                              handleRestockProduct(item.id, parseInt(quantity));
                            }
                          }}
                        >
                          <Plus size={14} className="me-1" />
                          Stock
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{borderRadius: '20px'}}>
             <div className="modal-header border-0">
               <h5 className="modal-title fw-bold" style={{color: '#2c3e50'}}>
                 Add LPG Product to Inventory
               </h5>
               <button 
                 type="button" 
                 className="btn-close"
                 onClick={() => setShowAddModal(false)}
               ></button>
             </div>
             
             <div className="modal-body p-4">
               <div className="row g-4">
                 {/* Available Products Grid */}
                 <div className="col-12">
                   <h6 className="fw-bold mb-3">Select LPG Product to Add</h6>
                   <div className="row g-3" style={{maxHeight: '400px', overflowY: 'auto'}}>
                     {availableProducts.map(product => (
                       <div key={product.id} className="col-lg-4 col-md-6">
                         <div 
                           className={`card border h-100 ${newProduct.gas_product === product.id ? 'border-primary' : ''}`}
                           style={{cursor: 'pointer'}}
                           onClick={() => setNewProduct({
                             ...newProduct,
                             gas_product: product.id,
                             price: product.base_price
                           })}
                         >
                           <img
                             src={product.image || getProductImage({gas_product: product})}
                             alt={product.name}
                             style={{height: '120px', objectFit: 'cover'}}
                             className="card-img-top"
                           />
                           <div className="card-body p-3">
                             <div className="d-flex justify-content-between align-items-start mb-2">
                               <div>
                                 <div className="fw-bold small">{product.name}</div>
                                 <div className="text-muted small">{product.brand}</div>
                               </div>
                               <span className="badge bg-primary">{product.size}</span>
                             </div>
                             <div className="small mb-2">
                               <span className="badge bg-light text-dark">
                                 {product.category}
                               </span>
                             </div>
                             <div className="fw-bold text-success small">
                               KES {product.base_price?.toLocaleString()}
                             </div>
                             {product.description && (
                               <div className="small text-muted mt-1">
                                 {product.description.substring(0, 50)}...
                               </div>
                             )}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Product Configuration */}
                 {newProduct.gas_product && (
                   <div className="col-12">
                     <div className="border-top pt-4">
                       <h6 className="fw-bold mb-3">Configure Inventory Settings</h6>
                       <div className="row g-3">
                         <div className="col-md-3">
                           <label className="form-label">Initial Stock Quantity</label>
                           <input
                             type="number"
                             className="form-control"
                             value={newProduct.stock_quantity}
                             onChange={(e) => setNewProduct({
                               ...newProduct,
                               stock_quantity: parseInt(e.target.value) || 0
                             })}
                             min="0"
                             placeholder="0"
                             style={{borderRadius: '8px'}}
                           />
                           <small className="text-muted">Number of units in stock</small>
                         </div>
                         <div className="col-md-3">
                           <label className="form-label">Selling Price (KES)</label>
                           <input
                             type="number"
                             className="form-control"
                             value={newProduct.price}
                             onChange={(e) => setNewProduct({
                               ...newProduct,
                               price: parseFloat(e.target.value) || 0
                             })}
                             min="0"
                             step="0.01"
                             placeholder="0.00"
                             style={{borderRadius: '8px'}}
                           />
                           <small className="text-muted">Your selling price</small>
                         </div>
                         <div className="col-md-3">
                           <label className="form-label">Low Stock Alert</label>
                           <input
                             type="number"
                             className="form-control"
                             value={newProduct.min_stock_alert}
                             onChange={(e) => setNewProduct({
                               ...newProduct,
                               min_stock_alert: parseInt(e.target.value) || 5
                             })}
                             min="1"
                             placeholder="5"
                             style={{borderRadius: '8px'}}
                           />
                           <small className="text-muted">Alert when stock reaches this level</small>
                         </div>
                         <div className="col-md-3 d-flex align-items-end">
                           <div className="form-check">
                             <input
                               className="form-check-input"
                               type="checkbox"
                               checked={newProduct.is_available}
                               onChange={(e) => setNewProduct({
                                 ...newProduct,
                                 is_available: e.target.checked
                               })}
                               id="newProductAvailable"
                             />
                             <label className="form-check-label" htmlFor="newProductAvailable">
                               <div className="fw-medium">Available for orders</div>
                               <small className="text-muted">Customers can order this product</small>
                             </label>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
               </div>
             </div>
             
             <div className="modal-footer border-0">
               <button 
                 type="button" 
                 className="btn btn-outline-secondary rounded-pill"
                 onClick={() => setShowAddModal(false)}
               >
                 Cancel
               </button>
               <button 
                 type="button" 
                 className="btn btn-primary-gradient rounded-pill px-4"
                 onClick={handleAddProduct}
                 disabled={!newProduct.gas_product}
               >
                 <Plus size={16} className="me-2" />
                 Add to Inventory
               </button>
             </div>
           </div>
         </div>
       </div>
     )}

     {/* Edit Product Modal */}
     {showEditModal && selectedProduct && (
       <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
         <div className="modal-dialog modal-dialog-centered">
           <div className="modal-content border-0 shadow-lg" style={{borderRadius: '20px'}}>
             <div className="modal-header border-0">
               <h5 className="modal-title fw-bold" style={{color: '#2c3e50'}}>
                 Edit Product
               </h5>
               <button 
                 type="button" 
                 className="btn-close"
                 onClick={() => {
                   setShowEditModal(false);
                   setSelectedProduct(null);
                 }}
               ></button>
             </div>
             
             <div className="modal-body p-4">
               {/* Product Info Display */}
               <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded" style={{background: '#f8f9fa'}}>
                 <img
                   src={getProductImage(selectedProduct)}
                   alt={selectedProduct.gas_product?.name}
                   style={{width: '80px', height: '80px', objectFit: 'cover'}}
                   className="rounded"
                 />
                 <div>
                   <div className="fw-bold">{selectedProduct.gas_product?.name}</div>
                   <div className="text-muted">
                     {selectedProduct.gas_product?.brand} - {selectedProduct.gas_product?.size}
                   </div>
                   <span className="badge bg-primary">
                     {selectedProduct.gas_product?.category}
                   </span>
                 </div>
               </div>

               <form>
                 <div className="row g-3">
                   <div className="col-6">
                     <label className="form-label">Current Stock</label>
                     <input
                       type="number"
                       className="form-control"
                       defaultValue={selectedProduct.stock_quantity}
                       min="0"
                       style={{borderRadius: '8px'}}
                       id="editStock"
                     />
                     <small className="text-muted">Units in stock</small>
                   </div>
                   <div className="col-6">
                     <label className="form-label">Selling Price (KES)</label>
                     <input
                       type="number"
                       className="form-control"
                       defaultValue={selectedProduct.price}
                       min="0"
                       step="0.01"
                       style={{borderRadius: '8px'}}
                       id="editPrice"
                     />
                     <small className="text-muted">Your selling price</small>
                   </div>
                   <div className="col-6">
                     <label className="form-label">Low Stock Alert</label>
                     <input
                       type="number"
                       className="form-control"
                       defaultValue={selectedProduct.min_stock_alert}
                       min="1"
                       style={{borderRadius: '8px'}}
                       id="editMinStock"
                     />
                     <small className="text-muted">Alert threshold</small>
                   </div>
                   <div className="col-6 d-flex align-items-end">
                     <div className="form-check">
                       <input
                         className="form-check-input"
                         type="checkbox"
                         defaultChecked={selectedProduct.is_available}
                         id="editAvailable"
                       />
                       <label className="form-check-label" htmlFor="editAvailable">
                         <div>Available for orders</div>
                         <small className="text-muted">Customers can order</small>
                       </label>
                     </div>
                   </div>
                 </div>
               </form>
             </div>
             
             <div className="modal-footer border-0">
               <button 
                 type="button" 
                 className="btn btn-outline-secondary rounded-pill"
                 onClick={() => {
                   setShowEditModal(false);
                   setSelectedProduct(null);
                 }}
               >
                 Cancel
               </button>
               <button 
                 type="button" 
                 className="btn btn-primary-gradient rounded-pill px-4"
                 onClick={() => {
                   const updates = {
                     stock_quantity: parseInt(document.getElementById('editStock').value) || 0,
                     price: parseFloat(document.getElementById('editPrice').value) || 0,
                     min_stock_alert: parseInt(document.getElementById('editMinStock').value) || 5,
                     is_available: document.getElementById('editAvailable').checked
                   };
                   handleUpdateProduct(selectedProduct.id, updates);
                 }}
               >
                 <Edit size={16} className="me-2" />
                 Update Product
               </button>
             </div>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default InventoryManager;
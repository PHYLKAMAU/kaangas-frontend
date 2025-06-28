export const USER_ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor', 
  RIDER: 'rider',
  ADMIN: 'admin'
};

export const VENDOR_TYPES = {
  RETAILER: 'retailer',
  REFILL_STATION: 'refill_station'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// LPG-focused product categories
export const LPG_CATEGORIES = {
  CYLINDER: 'cylinder',
  COMMERCIAL: 'commercial', 
  ACCESSORY: 'accessory'
};

export const LPG_SIZES = {
  SMALL: '3kg',
  MEDIUM: '6kg', 
  STANDARD: '13kg',
  COMMERCIAL: '50kg'
};

export const LPG_BRANDS = [
  'K-Gas',
  'ProGas', 
  'Total Gas',
  'Hashi Energy',
  'Lake Gas',
  'Universal',
  'FlexiGas'
];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  VENDOR_DASHBOARD: '/vendor/dashboard',
  RIDER_DASHBOARD: '/rider/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/accounts/login/',
    REGISTER: '/accounts/register/',
    LOGOUT: '/accounts/logout/',
    PROFILE: '/accounts/profile/',
    CHANGE_PASSWORD: '/accounts/change-password/',
    VERIFY_ACCOUNT: '/accounts/verify-account/',
    REGISTRATION_OPTIONS: '/accounts/registration-options/'
  },
  CUSTOMERS: {
    DASHBOARD: '/customers/dashboard/',
    ADDRESSES: '/customers/addresses/',
    ORDERS: '/customers/orders/',
    FAVORITES: '/customers/favorites/',
    PROFILE: '/customers/profile/'
  },
  VENDORS: {
    SEARCH: '/vendors/search/',
    DASHBOARD: '/vendors/dashboard/',
    INVENTORY: '/vendors/inventory/',
    ORDERS: '/vendors/orders/',
    ANALYTICS: '/vendors/analytics/'
  },
  RIDERS: {
    DASHBOARD: '/riders/dashboard/',
    JOBS: '/riders/available-jobs/',
    EARNINGS: '/riders/earnings/',
    LOCATION: '/riders/update-location/'
  },
  ORDERS: {
    CREATE: '/orders/create/',
    TRACK: '/orders/track/',
    ESTIMATE: '/orders/estimate/',
    HISTORY: '/orders/history/',
    MPESA_PAYMENT: '/orders/mpesa-payment/',
    MPESA_STATUS: '/orders/mpesa-status/'
  },
  CORE: {
    GAS_PRODUCTS: '/core/gas-products/',
    GAS_CATEGORIES: '/core/gas-categories/',
    MAPS: {
      GEOCODE: '/core/maps/geocode/',
      DIRECTIONS: '/core/maps/directions/'
    }
  }
};
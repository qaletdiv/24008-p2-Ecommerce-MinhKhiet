const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Product name is required and must be a non-empty string');
  }

  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    errors.push('Price is required and must be a positive number');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }

  if (req.body.offerPrice && (isNaN(req.body.offerPrice) || parseFloat(req.body.offerPrice) <= 0)) {
    errors.push('Offer price must be a positive number');
  }

  if (req.body.quantity && (isNaN(req.body.quantity) || parseInt(req.body.quantity) < 0)) {
    errors.push('Quantity must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Please check the following errors',
      details: errors
    });
  }

  next();
};

const validateUser = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    errors.push('Valid email address is required');
  }

  if (req.method === 'POST' && (!password || typeof password !== 'string' || password.length < 6)) {
    errors.push('Password is required and must be at least 6 characters long');
  }

  if (req.body.role && !['admin', 'customer', 'seller'].includes(req.body.role)) {
    errors.push('Role must be one of: admin, customer, seller');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Please check the following errors',
      details: errors
    });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { userId, items, shippingAddress, paymentMethod } = req.body;
  const errors = [];

  if (!userId || isNaN(userId) || parseInt(userId) <= 0) {
    errors.push('Valid user ID is required');
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Order items are required and must be a non-empty array');
  } else {
    items.forEach((item, index) => {
      if (!item.productId || isNaN(item.productId)) {
        errors.push(`Item ${index + 1}: Product ID is required`);
      }
      if (!item.productName || typeof item.productName !== 'string') {
        errors.push(`Item ${index + 1}: Product name is required`);
      }
      if (!item.price || isNaN(item.price) || parseFloat(item.price) <= 0) {
        errors.push(`Item ${index + 1}: Valid price is required`);
      }
      if (!item.quantity || isNaN(item.quantity) || parseInt(item.quantity) <= 0) {
        errors.push(`Item ${index + 1}: Valid quantity is required`);
      }
    });
  }

  if (!shippingAddress || typeof shippingAddress !== 'object') {
    errors.push('Shipping address is required');
  } else {
    const requiredAddressFields = ['fullName', 'street', 'city', 'state', 'zipCode', 'country'];
    requiredAddressFields.forEach(field => {
      if (!shippingAddress[field] || typeof shippingAddress[field] !== 'string' || shippingAddress[field].trim().length === 0) {
        errors.push(`Shipping address ${field} is required`);
      }
    });
  }

  if (!paymentMethod || !['credit_card', 'debit_card', 'paypal', 'bank_transfer'].includes(paymentMethod)) {
    errors.push('Valid payment method is required (credit_card, debit_card, paypal, bank_transfer)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Please check the following errors',
      details: errors
    });
  }

  next();
};

const validateCategory = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Category name is required and must be a non-empty string');
  }

  if (req.body.parentId && (isNaN(req.body.parentId) || parseInt(req.body.parentId) <= 0)) {
    errors.push('Parent ID must be a valid positive number');
  }

  if (req.body.sortOrder && (isNaN(req.body.sortOrder) || parseInt(req.body.sortOrder) < 0)) {
    errors.push('Sort order must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Please check the following errors',
      details: errors
    });
  }

  next();
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID',
      message: 'ID must be a valid positive number'
    });
  }
  
  next();
};

const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  
  if (page && (isNaN(page) || parseInt(page) <= 0)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid pagination',
      message: 'Page must be a positive number'
    });
  }
  
  if (limit && (isNaN(limit) || parseInt(limit) <= 0 || parseInt(limit) > 100)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid pagination',
      message: 'Limit must be a positive number between 1 and 100'
    });
  }
  
  next();
};

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  
  next();
};

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
   
    const userRequests = requests.get(key) || [];
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: `Rate limit exceeded. Maximum ${max} requests per ${windowMs / 1000} seconds.`,
        retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
      });
    }
    
    validRequests.push(now);
    requests.set(key, validRequests);
    
    next();
  };
};

const globalErrorHandler = (err, req, res, next) => {
  console.error('Global Error Handler:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
      details: err.errors
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID',
      message: 'Invalid ID format provided'
    });
  }
  
  if (err.code === 'ENOENT') {
    return res.status(404).json({
      success: false,
      error: 'Resource not found',
      message: 'The requested resource could not be found'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders',
      categories: '/api/categories'
    }
  });
};

const healthCheck = (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime)} seconds`,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
    },
    environment: process.env.NODE_ENV || 'development'
  });
};

module.exports = {
  validateProduct,
  validateUser,
  validateOrder,
  validateCategory,
  validateId,
  validatePagination,
  requestLogger,
  createRateLimiter,
  globalErrorHandler,
  notFoundHandler,
  healthCheck
};
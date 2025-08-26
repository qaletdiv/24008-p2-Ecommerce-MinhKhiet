const express = require('express');
const cors = require('cors');
const path = require('path');
const {
  requestLogger,
  createRateLimiter,
  globalErrorHandler,
  notFoundHandler,
  healthCheck
} = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 4000;
app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:3000', 'https://your-frontend-domain.com']
    : true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(requestLogger);

app.use(createRateLimiter(15 * 60 * 1000, 1000)); 

app.use('/images', express.static(path.join(__dirname, 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/health', healthCheck);

app.get('/', (req, res) => {
  res.json({
    message: 'E-commerce API Server is running!',
    version: '1.0.0',
    documentation: {
      products: {
        'GET /api/products': 'Get all products with filtering, sorting, pagination',
        'GET /api/products/:id': 'Get single product by ID',
        'POST /api/products': 'Create new product',
        'PUT /api/products/:id': 'Update product by ID',
        'DELETE /api/products/:id': 'Delete product by ID',
        'GET /api/products/category/:categoryId': 'Get products by category'
      },
      users: {
        'GET /api/users': 'Get all users with filtering and pagination',
        'GET /api/users/:id': 'Get single user by ID',
        'POST /api/users': 'Create new user',
        'PUT /api/users/:id': 'Update user by ID', 
        'DELETE /api/users/:id': 'Delete user by ID',
        'POST /api/users/login': 'User authentication',
        'GET /api/users/role/:role': 'Get users by role'
      },
      orders: {
        'GET /api/orders': 'Get all orders with filtering, sorting, pagination',
        'GET /api/orders/:id': 'Get single order by ID',
        'POST /api/orders': 'Create new order',
        'PUT /api/orders/:id': 'Update order by ID',
        'DELETE /api/orders/:id': 'Delete order by ID (pending only)',
        'GET /api/orders/user/:userId': 'Get orders by user ID',
        'GET /api/orders/stats/summary': 'Get order statistics'
      },
      categories: {
        'GET /api/categories': 'Get all categories with optional tree structure',
        'GET /api/categories/:id': 'Get single category by ID',
        'POST /api/categories': 'Create new category',
        'PUT /api/categories/:id': 'Update category by ID',
        'DELETE /api/categories/:id': 'Delete category by ID',
        'GET /api/categories/slug/:slug': 'Get category by slug',
        'GET /api/categories/parent/:parentId': 'Get child categories'
      },
      images: {
        'GET /images/:filename': 'Serve static image files (PNG, JPG, SVG, etc.)',
        'GET /assets/:filename': 'Serve static asset files (images, icons, etc.)'
      }
    },
    examples: {
      'Filter products by category': 'GET /api/products?category=Electronics',
      'Search products': 'GET /api/products?search=headphones',
      'Get products with pagination': 'GET /api/products?page=1&limit=10',
      'Sort products by price': 'GET /api/products?sortBy=price&sortOrder=asc',
      'User login': 'POST /api/users/login with { email, password }',
      'Create order': 'POST /api/orders with order details',
      'Get category tree': 'GET /api/categories?tree=true'
    }
  });
});

const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

app.use(globalErrorHandler);

app.use('*', notFoundHandler);

app.listen(PORT, () => {
  console.log(`🚀 E-commerce API Server is running on port ${PORT}`);
  console.log(`📋 API Documentation available at http://localhost:${PORT}`);
});
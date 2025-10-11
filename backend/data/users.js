const usersData = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@ecommerce.com",
    password: "admin123", 
    role: "admin",
    avatar: "/images/admin-avatar.jpg",
    phone: "+1234567890",
    address: {
      street: "123 Admin Street",
      city: "Tech City",
      state: "California",
      zipCode: "90210",
      country: "USA"
    },
    isActive: true,
    isEmailVerified: true,
    preferences: {
      newsletter: true,
      notifications: true,
      language: "en"
    },
    cart: [],
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-25T10:30:00Z"
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@email.com",
    password: "user123", 
    role: "customer",
    avatar: "/images/user-avatar-1.jpg",
    phone: "+1987654321",
    address: {
      street: "456 Oak Avenue",
      city: "Springfield",
      state: "Illinois",
      zipCode: "62701",
      country: "USA"
    },
    isActive: true,
    isEmailVerified: true,
    preferences: {
      newsletter: true,
      notifications: false,
      language: "en"
    },
    cart: [],
    createdAt: "2024-01-10T08:15:00Z",
    lastLogin: "2024-01-24T16:45:00Z"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    password: "user456", 
    role: "customer",
    avatar: "/images/user-avatar-2.jpg",
    phone: "+1555123456",
    address: {
      street: "789 Pine Street",
      city: "Portland",
      state: "Oregon",
      zipCode: "97201",
      country: "USA"
    },
    isActive: true,
    isEmailVerified: false,
    preferences: {
      newsletter: false,
      notifications: true,
      language: "en"
    },
    cart: [],
    createdAt: "2024-01-15T12:30:00Z",
    lastLogin: "2024-01-23T14:20:00Z"
  },
  {
    id: 4,
    name: "Seller Pro",
    email: "seller@marketplace.com",
    password: "seller123",
    role: "seller",
    avatar: "/images/seller-avatar.jpg",
    phone: "+1444555666",
    address: {
      street: "321 Business Blvd",
      city: "Commerce City",
      state: "Colorado",
      zipCode: "80022",
      country: "USA"
    },
    isActive: true,
    isEmailVerified: true,
    preferences: {
      newsletter: true,
      notifications: true,
      language: "en"
    },
    businessInfo: {
      businessName: "Pro Electronics Store",
      businessType: "Electronics Retailer",
      taxId: "123456789",
      website: "https://proelectronics.com"
    },
    cart: [],
    createdAt: "2024-01-05T14:00:00Z",
    lastLogin: "2024-01-25T09:15:00Z"
  }
];

module.exports = { usersData };
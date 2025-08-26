const ordersData = [
  {
    id: 1,
    userId: 2,
    orderNumber: "ORD-2024-001",
    status: "delivered",
    totalAmount: 359.98,
    subtotal: 329.98,
    tax: 26.40,
    shippingFee: 0,
    discount: 0,
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    shippingAddress: {
      fullName: "John Smith",
      street: "456 Oak Avenue",
      city: "Springfield",
      state: "Illinois",
      zipCode: "62701",
      country: "USA",
      phone: "+1987654321"
    },
    billingAddress: {
      fullName: "John Smith",
      street: "456 Oak Avenue",
      city: "Springfield",
      state: "Illinois",
      zipCode: "62701",
      country: "USA",
      phone: "+1987654321"
    },
    items: [
      {
        productId: 1,
        productName: "Premium Wireless Headphones",
        price: 249.99,
        quantity: 1,
        total: 249.99
      },
      {
        productId: 4,
        productName: "4K Webcam Ultra",
        price: 119.99,
        quantity: 1,
        total: 119.99
      }
    ],
    orderDate: "2024-01-20T10:30:00Z",
    expectedDelivery: "2024-01-25T00:00:00Z",
    deliveredDate: "2024-01-24T14:20:00Z",
    trackingNumber: "TRK123456789",
    notes: "Leave at front door if not home"
  },
  {
    id: 2,
    userId: 3,
    orderNumber: "ORD-2024-002",
    status: "shipped",
    totalAmount: 1279.98,
    subtotal: 1199.99,
    tax: 96.00,
    shippingFee: 15.99,
    discount: 32.00,
    paymentMethod: "paypal",
    paymentStatus: "paid",
    shippingAddress: {
      fullName: "Sarah Johnson",
      street: "789 Pine Street",
      city: "Portland",
      state: "Oregon",
      zipCode: "97201",
      country: "USA",
      phone: "+1555123456"
    },
    billingAddress: {
      fullName: "Sarah Johnson",
      street: "789 Pine Street",
      city: "Portland",
      state: "Oregon",
      zipCode: "97201",
      country: "USA",
      phone: "+1555123456"
    },
    items: [
      {
        productId: 2,
        productName: "Gaming Laptop Pro",
        price: 1199.99,
        quantity: 1,
        total: 1199.99
      }
    ],
    orderDate: "2024-01-22T16:45:00Z",
    expectedDelivery: "2024-01-28T00:00:00Z",
    deliveredDate: null,
    trackingNumber: "TRK987654321",
    notes: "Signature required upon delivery"
  },
  {
    id: 3,
    userId: 2,
    orderNumber: "ORD-2024-003",
    status: "processing",
    totalAmount: 219.98,
    subtotal: 219.98,
    tax: 17.60,
    shippingFee: 0,
    discount: 17.60,
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    shippingAddress: {
      fullName: "John Smith",
      street: "456 Oak Avenue",
      city: "Springfield",
      state: "Illinois",
      zipCode: "62701",
      country: "USA",
      phone: "+1987654321"
    },
    billingAddress: {
      fullName: "John Smith",
      street: "456 Oak Avenue",
      city: "Springfield",
      state: "Illinois",
      zipCode: "62701",
      country: "USA",
      phone: "+1987654321"
    },
    items: [
      {
        productId: 3,
        productName: "Wireless Gaming Controller",
        price: 59.99,
        quantity: 2,
        total: 119.98
      },
      {
        productId: 5,
        productName: "Mechanical Keyboard RGB",
        price: 159.99,
        quantity: 1,
        total: 159.99
      }
    ],
    orderDate: "2024-01-24T09:15:00Z",
    expectedDelivery: "2024-01-30T00:00:00Z",
    deliveredDate: null,
    trackingNumber: null,
    notes: ""
  },
  {
    id: 4,
    userId: 3,
    orderNumber: "ORD-2024-004",
    status: "pending",
    totalAmount: 79.99,
    subtotal: 59.99,
    tax: 4.80,
    shippingFee: 15.20,
    discount: 0,
    paymentMethod: "bank_transfer",
    paymentStatus: "pending",
    shippingAddress: {
      fullName: "Sarah Johnson",
      street: "789 Pine Street",
      city: "Portland",
      state: "Oregon",
      zipCode: "97201",
      country: "USA",
      phone: "+1555123456"
    },
    billingAddress: {
      fullName: "Sarah Johnson",
      street: "789 Pine Street",
      city: "Portland",
      state: "Oregon",
      zipCode: "97201",
      country: "USA",
      phone: "+1555123456"
    },
    items: [
      {
        productId: 3,
        productName: "Wireless Gaming Controller",
        price: 59.99,
        quantity: 1,
        total: 59.99
      }
    ],
    orderDate: "2024-01-25T11:30:00Z",
    expectedDelivery: "2024-02-01T00:00:00Z",
    deliveredDate: null,
    trackingNumber: null,
    notes: "Please call before delivery"
  }
];

module.exports = { ordersData };
const express = require('express');
const router = express.Router();
const { ordersData } = require('../data/orders');

let orders = [...ordersData];
let nextId = Math.max(...orders.map(o => o.id)) + 1;
let orderCounter = 5; 
const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const orderNum = String(orderCounter++).padStart(3, '0');
  return `ORD-${year}-${orderNum}`;
};

router.get('/', (req, res) => {
  try {
    const { 
      userId, status, paymentStatus, paymentMethod,
      startDate, endDate, search, sortBy = 'orderDate', sortOrder = 'desc',
      page = 1, limit = 10 
    } = req.query;
    
    let filteredOrders = [...orders];
    if (userId) {
      filteredOrders = filteredOrders.filter(o => o.userId === parseInt(userId));
    }
    
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status);
    }
    
    if (paymentStatus) {
      filteredOrders = filteredOrders.filter(o => o.paymentStatus === paymentStatus);
    }
    
    if (paymentMethod) {
      filteredOrders = filteredOrders.filter(o => o.paymentMethod === paymentMethod);
    }
    
    if (startDate) {
      filteredOrders = filteredOrders.filter(o => new Date(o.orderDate) >= new Date(startDate));
    }
    if (endDate) {
      filteredOrders = filteredOrders.filter(o => new Date(o.orderDate) <= new Date(endDate));
    }
   
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredOrders = filteredOrders.filter(o => 
        o.orderNumber.toLowerCase().includes(searchTerm) ||
        o.shippingAddress.fullName.toLowerCase().includes(searchTerm) ||
        o.trackingNumber?.toLowerCase().includes(searchTerm)
      );
    }
    
    filteredOrders.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'orderDate' || sortBy === 'deliveredDate') {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      }
      
      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    });
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredOrders.length / limit),
        totalItems: filteredOrders.length,
        itemsPerPage: parseInt(limit)
      },
      message: 'Orders retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve orders',
      message: error.message
    });
  }
});

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = orders.find(o => o.id === parseInt(id));
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        message: `Order with ID ${id} does not exist`
      });
    }
    
    res.json({
      success: true,
      data: order,
      message: 'Order retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve order',
      message: error.message
    });
  }
});

router.post('/', (req, res) => {
  try {
    const {
      userId, items, shippingAddress, billingAddress, 
      paymentMethod, notes, subtotal, tax, shippingFee, discount
    } = req.body;

    if (!userId || !items || items.length === 0 || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'UserId, items, shippingAddress, and paymentMethod are required'
      });
    }

    const calculatedSubtotal = subtotal || items.reduce((sum, item) => sum + item.total, 0);
    const calculatedTax = tax || Math.floor(calculatedSubtotal * 0.08);
    const calculatedShipping = shippingFee || (calculatedSubtotal > 100 ? 0 : 15.99);
    const calculatedDiscount = discount || 0;
    const totalAmount = calculatedSubtotal + calculatedTax + calculatedShipping - calculatedDiscount;

    const newOrder = {
      id: nextId++,
      userId: parseInt(userId),
      orderNumber: generateOrderNumber(),
      status: 'pending',
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      subtotal: parseFloat(calculatedSubtotal.toFixed(2)),
      tax: parseFloat(calculatedTax.toFixed(2)),
      shippingFee: parseFloat(calculatedShipping.toFixed(2)),
      discount: parseFloat(calculatedDiscount.toFixed(2)),
      paymentMethod,
      paymentStatus: 'pending',
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        total: parseFloat(item.total || (item.price * item.quantity))
      })),
      orderDate: new Date().toISOString(),
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
      deliveredDate: null,
      trackingNumber: null,
      notes: notes || ''
    };

    orders.push(newOrder);

    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const orderIndex = orders.findIndex(o => o.id === parseInt(id));
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        message: `Order with ID ${id} does not exist`
      });
    }

    const updatedData = { ...req.body };
    
    if (updatedData.status === 'shipped' && !orders[orderIndex].trackingNumber) {
      updatedData.trackingNumber = `TRK${Date.now()}`;
    }
    
    if (updatedData.status === 'delivered' && !orders[orderIndex].deliveredDate) {
      updatedData.deliveredDate = new Date().toISOString();
    }

    const updatedOrder = {
      ...orders[orderIndex],
      ...updatedData,
      id: parseInt(id)  
    };

    orders[orderIndex] = updatedOrder;

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update order',
      message: error.message
    });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const orderIndex = orders.findIndex(o => o.id === parseInt(id));
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        message: `Order with ID ${id} does not exist`
      });
    }

    const order = orders[orderIndex];
    
  
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete order',
        message: 'Only pending orders can be deleted'
      });
    }

    const deletedOrder = orders.splice(orderIndex, 1)[0];

    res.json({
      success: true,
      data: deletedOrder,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete order',
      message: error.message
    });
  }
});

router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    let userOrders = orders.filter(o => o.userId === parseInt(userId));
    
    if (status) {
      userOrders = userOrders.filter(o => o.status === status);
    }
    
    userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = userOrders.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(userOrders.length / limit),
        totalItems: userOrders.length,
        itemsPerPage: parseInt(limit)
      },
      message: 'User orders retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user orders',
      message: error.message
    });
  }
});

router.get('/stats/summary', (req, res) => {
  try {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    const paymentStatusCount = orders.reduce((acc, order) => {
      acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        statusBreakdown: statusCount,
        paymentStatusBreakdown: paymentStatusCount,
        averageOrderValue: totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0
      },
      message: 'Order statistics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve order statistics',
      message: error.message
    });
  }
});

module.exports = router;
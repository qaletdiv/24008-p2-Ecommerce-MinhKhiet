const express = require('express');
const router = express.Router();
const userStore = require('../data/userStore');

router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a valid number'
      });
    }
    
    const user = userStore.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }

    const cart = user.cart || [];
    
    res.json({
      success: true,
      data: cart,
      message: 'Cart retrieved successfully'
    });
  } catch (error) {
    console.error('Error in GET /cart/:userId:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cart',
      message: error.message
    });
  }
});


router.post('/:userId/items', (req, res) => {
  try {
    const { userId } = req.params;
    const { product, quantity = 1 } = req.body;
    
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a valid number'
      });
    }
    
    if (!product || !product.id) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product data',
        message: 'Product information with valid ID is required'
      });
    }
    
    if (quantity < 1 || isNaN(parseInt(quantity))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quantity',
        message: 'Quantity must be a positive number'
      });
    }

    const user = userStore.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const existingItemIndex = user.cart.findIndex(
      item => item.id === product.id
    );

    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += parseInt(quantity);
    } else {
      user.cart.push({ 
        ...product, 
        quantity: parseInt(quantity) 
      });
    }

    res.json({
      success: true,
      data: user.cart,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Error in POST /cart/:userId/items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart',
      message: error.message
    });
  }
});

router.put('/:userId/items/:productId', (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a valid number'
      });
    }
    
    if (!productId || isNaN(parseInt(productId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
        message: 'Product ID must be a valid number'
      });
    }
    
    if (quantity === undefined || quantity < 0 || isNaN(parseInt(quantity))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quantity',
        message: 'Quantity must be a non-negative number'
      });
    }

    const user = userStore.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const itemIndex = user.cart.findIndex(
      item => item.id === parseInt(productId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: 'Item not found in cart'
      });
    }

    if (parseInt(quantity) === 0) {
      user.cart.splice(itemIndex, 1);
    } else {
      user.cart[itemIndex].quantity = parseInt(quantity);
    }

    res.json({
      success: true,
      data: user.cart,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Error in PUT /cart/:userId/items/:productId:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart',
      message: error.message
    });
  }
});


router.delete('/:userId/items/:productId', (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a valid number'
      });
    }

    if (!productId || isNaN(parseInt(productId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
        message: 'Product ID must be a valid number'
      });
    }

    const user = userStore.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
      item => item.id !== parseInt(productId)
    );

    if (user.cart.length === initialLength) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: 'Item not found in cart'
      });
    }

    res.json({
      success: true,
      data: user.cart,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /cart/:userId/items/:productId:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart',
      message: error.message
    });
  }
});


router.delete('/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a valid number'
      });
    }

    const user = userStore.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }

    user.cart = [];

    res.json({
      success: true,
      data: [],
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /cart/:userId:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart',
      message: error.message
    });
  }
});

module.exports = router;

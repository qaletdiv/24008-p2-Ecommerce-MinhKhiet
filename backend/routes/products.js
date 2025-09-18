const express = require('express');
const router = express.Router();
const { productsData } = require('../data/products');
const { 
  validateProduct, 
  validateId, 
  validatePagination 
} = require('../middleware/validation');
let products = [...productsData];
let nextId = Math.max(...products.map(p => p.id)) + 1;

router.get('/', validatePagination, (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      inStock, 
      search, 
      sortBy, 
      sortOrder = 'asc',
      page = 1, 
      limit = 4 
    } = req.query;

    let filteredProducts = [...products];
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.offerPrice >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.offerPrice <= parseFloat(maxPrice));
    }

    if (inStock !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.inStock === (inStock === 'true'));
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (sortBy) {
      filteredProducts.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (sortOrder === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalItems: filteredProducts.length,
        itemsPerPage: parseInt(limit)
      },
      message: 'Products retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve products',
      message: error.message
    });
  }
});

router.get('/:id', validateId, (req, res) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === parseInt(id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with ID ${id} does not exist`
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Product retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve product',
      message: error.message
    });
  }
});

router.post('/', validateProduct, (req, res) => {
  try {
    const {
      name, description, price, offerPrice, category, categoryId,
      image, brand, quantity, tags, specifications
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, price, and category are required'
      });
    }

    const newProduct = {
      id: nextId++,
      name,
      description: description || '',
      price: parseFloat(price),
      offerPrice: offerPrice ? parseFloat(offerPrice) : parseFloat(price),
      category,
      categoryId: categoryId || null,
      image: image || [],
      brand: brand || '',
      inStock: true,
      quantity: quantity || 0,
      ratings: 0,
      reviews: 0,
      tags: tags || [],
      specifications: specifications || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message
    });
  }
});

router.put('/:id', validateId, (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with ID ${id} does not exist`
      });
    }

    const updatedProduct = {
      ...products[productIndex],
      ...req.body,
      id: parseInt(id), 
      updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;

    res.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: error.message
    });
  }
});

router.delete('/:id', validateId, (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with ID ${id} does not exist`
      });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    res.json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

router.get('/category/:categoryId', validateId, (req, res) => {
  try {
    const { categoryId } = req.params;
    const categoryProducts = products.filter(p => p.categoryId === parseInt(categoryId));
    
    res.json({
      success: true,
      data: categoryProducts,
      count: categoryProducts.length,
      message: 'Products by category retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve products by category',
      message: error.message
    });
  }
});

module.exports = router;
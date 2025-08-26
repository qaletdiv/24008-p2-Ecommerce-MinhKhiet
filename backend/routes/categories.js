const express = require('express');
const router = express.Router();
const { categoriesData } = require('../data/categories');

let categories = [...categoriesData];
let nextId = Math.max(...categories.map(c => c.id)) + 1;

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const buildCategoryTree = (parentId = null) => {
  return categories
    .filter(cat => cat.parentId === parentId)
    .map(cat => ({
      ...cat,
      children: buildCategoryTree(cat.id)
    }));
};

router.get('/', (req, res) => {
  try {
    const { 
      parentId, isActive, tree = 'false', search, 
      sortBy = 'sortOrder', sortOrder = 'asc',
      page = 1, limit = 50 
    } = req.query;
    
    let filteredCategories = [...categories];
    
    if (parentId !== undefined) {
      if (parentId === 'null' || parentId === '') {
        filteredCategories = filteredCategories.filter(c => c.parentId === null);
      } else {
        filteredCategories = filteredCategories.filter(c => c.parentId === parseInt(parentId));
      }
    }
    
    if (isActive !== undefined) {
      filteredCategories = filteredCategories.filter(c => c.isActive === (isActive === 'true'));
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredCategories = filteredCategories.filter(c => 
        c.name.toLowerCase().includes(searchTerm) || 
        c.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (tree === 'true') {
      const categoryTree = buildCategoryTree();
      return res.json({
        success: true,
        data: categoryTree,
        message: 'Category tree retrieved successfully'
      });
    }
    
    filteredCategories.sort((a, b) => {
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
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedCategories,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredCategories.length / limit),
        totalItems: filteredCategories.length,
        itemsPerPage: parseInt(limit)
      },
      message: 'Categories retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories',
      message: error.message
    });
  }
});

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const category = categories.find(c => c.id === parseInt(id));
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: `Category with ID ${id} does not exist`
      });
    }
    
    const children = categories.filter(c => c.parentId === category.id);
    
    res.json({
      success: true,
      data: {
        ...category,
        children
      },
      message: 'Category retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve category',
      message: error.message
    });
  }
});

router.post('/', (req, res) => {
  try {
    const {
      name, description, parentId, image, isActive = true, sortOrder
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Category name is required'
      });
    }

    if (parentId && !categories.find(c => c.id === parseInt(parentId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid parent category',
        message: 'Parent category does not exist'
      });
    }

    const slug = generateSlug(name);
    
    const existingCategory = categories.find(c => c.slug === slug);
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists',
        message: 'A category with this name already exists'
      });
    }

    const maxSortOrder = Math.max(
      ...categories
        .filter(c => c.parentId === (parentId ? parseInt(parentId) : null))
        .map(c => c.sortOrder || 0),
      0
    );

    const newCategory = {
      id: nextId++,
      name,
      description: description || '',
      slug,
      image: image || '/images/default-category.jpg',
      parentId: parentId ? parseInt(parentId) : null,
      isActive: Boolean(isActive),
      sortOrder: sortOrder ? parseInt(sortOrder) : maxSortOrder + 1,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    categories.push(newCategory);

    res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Category created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create category',
      message: error.message
    });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const categoryIndex = categories.findIndex(c => c.id === parseInt(id));
    
    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: `Category with ID ${id} does not exist`
      });
    }

    const currentCategory = categories[categoryIndex];

    let updatedData = { ...req.body };
    if (updatedData.name && updatedData.name !== currentCategory.name) {
      const newSlug = generateSlug(updatedData.name);
      
      const existingCategory = categories.find(c => c.slug === newSlug && c.id !== parseInt(id));
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          error: 'Category name already exists',
          message: 'A category with this name already exists'
        });
      }
      
      updatedData.slug = newSlug;
    }

    if (updatedData.parentId) {
      const parentId = parseInt(updatedData.parentId);
      
      if (parentId === parseInt(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid parent',
          message: 'Category cannot be parent of itself'
        });
      }
      
      if (!categories.find(c => c.id === parentId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid parent category',
          message: 'Parent category does not exist'
        });
      }
    }

    const updatedCategory = {
      ...currentCategory,
      ...updatedData,
      id: parseInt(id),
      updatedAt: new Date().toISOString()
    };

    categories[categoryIndex] = updatedCategory;

    res.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update category',
      message: error.message
    });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const categoryIndex = categories.findIndex(c => c.id === parseInt(id));
    
    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: `Category with ID ${id} does not exist`
      });
    }

    const category = categories[categoryIndex];
    
    const hasChildren = categories.some(c => c.parentId === parseInt(id));
    if (hasChildren) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category',
        message: 'Category has subcategories. Please delete or move subcategories first.'
      });
    }

    if (category.productCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category',
        message: 'Category has products. Please move or delete products first.'
      });
    }

    const deletedCategory = categories.splice(categoryIndex, 1)[0];

    res.json({
      success: true,
      data: deletedCategory,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete category',
      message: error.message
    });
  }
});

router.get('/slug/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const category = categories.find(c => c.slug === slug);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: `Category with slug '${slug}' does not exist`
      });
    }
    const children = categories.filter(c => c.parentId === category.id);
    
    res.json({
      success: true,
      data: {
        ...category,
        children
      },
      message: 'Category retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve category',
      message: error.message
    });
  }
});

router.get('/parent/:parentId', (req, res) => {
  try {
    const { parentId } = req.params;
    const parsedParentId = parentId === 'null' ? null : parseInt(parentId);
    
    const childCategories = categories.filter(c => c.parentId === parsedParentId);
    
    childCategories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    
    res.json({
      success: true,
      data: childCategories,
      count: childCategories.length,
      message: 'Child categories retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve child categories',
      message: error.message
    });
  }
});

module.exports = router;
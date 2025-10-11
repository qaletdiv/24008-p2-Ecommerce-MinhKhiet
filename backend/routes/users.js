const express = require('express');
const router = express.Router();
const userStore = require('../data/userStore');
const { 
  validateUser, 
  validateId, 
  validatePagination 
} = require('../middleware/validation');

router.get('/', validatePagination, (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 10 } = req.query;
    
    const users = userStore.getUsers();
    let filteredUsers = [...users];
    
    if (role) {
      filteredUsers = filteredUsers.filter(u => u.role === role);
    }
    
    if (isActive !== undefined) {
      filteredUsers = filteredUsers.filter(u => u.isActive === (isActive === 'true'));
    }
   
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm) || 
        u.email.toLowerCase().includes(searchTerm)
      );
    }
    
    const safeUsers = filteredUsers.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = safeUsers.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(safeUsers.length / limit),
        totalItems: safeUsers.length,
        itemsPerPage: parseInt(limit)
      },
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      message: error.message
    });
  }
});

router.get('/:id', validateId, (req, res) => {
  try {
    const { id } = req.params;
    const user = userStore.findUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${id} does not exist`
      });
    }

    const { password, ...safeUser } = user;
    
    res.json({
      success: true,
      data: safeUser,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user',
      message: error.message
    });
  }
});

router.post('/register', (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, email, password, and confirm password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Password mismatch',
        message: 'Password and confirm password do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password too short',
        message: 'Password must be at least 6 characters long'
      });
    }

    const existingUser = userStore.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
        message: 'A user with this email already exists'
      });
    }

    const newUser = {
      id: userStore.getNextId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, 
      role: 'customer', 
      avatar: '/images/default-avatar.jpg',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      isActive: true,
      isEmailVerified: false,
      preferences: {
        newsletter: true,
        notifications: true,
        language: 'en'
      },
      cart: [],
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    const users = userStore.getUsers();
    users.push(newUser);

    const { password: _, confirmPassword: __, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      data: safeUser,
      message: 'Registration successful! You can now log in.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message
    });
  }
});

router.post('/', validateUser, (req, res) => {
  try {
    const {
      name, email, password, role, phone, address, avatar
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, email, and password are required'
      });
    }

    const existingUser = userStore.getUsers().find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
        message: 'A user with this email already exists'
      });
    }

    const newUser = {
      id: userStore.getNextId(),
      name,
      email,
      password, 
      role: role || 'customer',
      avatar: avatar || '/images/default-avatar.jpg',
      phone: phone || '',
      address: address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      isActive: true,
      isEmailVerified: false,
      preferences: {
        newsletter: true,
        notifications: true,
        language: 'en'
      },
      cart: [],
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    const users = userStore.getUsers();
    users.push(newUser);

    const { password: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      data: safeUser,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error.message
    });
  }
});

router.put('/:id', validateId, (req, res) => {
  try {
    const { id } = req.params;
    const users = userStore.getUsers();
    const userIndex = userStore.findUserIndex(id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${id} does not exist`
      });
    }
    if (req.body.email && req.body.email !== users[userIndex].email) {
      const existingUser = users.find(u => u.email === req.body.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists',
          message: 'A user with this email already exists'
        });
      }
    }

    const updatedUser = {
      ...users[userIndex],
      ...req.body,
      id: parseInt(id),
    };

    users[userIndex] = updatedUser;

    const { password: _, ...safeUser } = updatedUser;

    res.json({
      success: true,
      data: safeUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
});

router.delete('/:id', validateId, (req, res) => {
  try {
    const { id } = req.params;
    const users = userStore.getUsers();
    const userIndex = userStore.findUserIndex(id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${id} does not exist`
      });
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    
    const { password: _, ...safeUser } = deletedUser;

    res.json({
      success: true,
      data: safeUser,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    const user = userStore.getUsers().find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account disabled',
        message: 'Your account has been disabled'
      });
    }
    const users = userStore.getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex].lastLogin = new Date().toISOString();

    const { password: _, ...safeUser } = users[userIndex];

    res.json({
      success: true,
      data: safeUser,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

router.get('/role/:role', (req, res) => {
  try {
    const { role } = req.params;
    const users = userStore.getUsers();
    const roleUsers = users.filter(u => u.role === role);

    const safeUsers = roleUsers.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    res.json({
      success: true,
      data: safeUsers,
      count: safeUsers.length,
      message: `Users with role '${role}' retrieved successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users by role',
      message: error.message
    });
  }
});

module.exports = router;
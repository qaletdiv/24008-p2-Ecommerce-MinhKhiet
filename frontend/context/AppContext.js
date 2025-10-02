"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const AppContext = createContext();

const apiService = {
  async apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        if (endpoint === '/users/login' && (response.status === 401 || response.status === 400)) {
          return {
            success: false,
            error: data.error || 'Authentication failed',
            message: data.message || 'Invalid credentials'
          };
        }
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      if (endpoint === '/users/login' && error.name === 'TypeError') {
        return {
          success: false,
          error: 'Network error',
          message: 'Unable to connect to server. Please check your connection.'
        };
      }
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  },

  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  },

  async getProduct(id) {
    return this.apiCall(`/products/${id}`);
  },

  async createProduct(productData) {
    return this.apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id, productData) {
    return this.apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  async deleteProduct(id) {
    return this.apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  },

  async getCategory(id) {
    return this.apiCall(`/categories/${id}`);
  },

  async createCategory(categoryData) {
    return this.apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  async updateCategory(id, categoryData) {
    return this.apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  async deleteCategory(id) {
    return this.apiCall(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  },

  async getUser(id) {
    return this.apiCall(`/users/${id}`);
  },

  async createUser(userData) {
    return this.apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async updateUser(id, userData) {
    return this.apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async deleteUser(id) {
    return this.apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  async loginUser(email, password) {
    return this.apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  },

  async getOrder(id) {
    return this.apiCall(`/orders/${id}`);
  },

  async createOrder(orderData) {
    return this.apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async updateOrder(id, orderData) {
    return this.apiCall(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },

  async deleteOrder(id) {
    return this.apiCall(`/orders/${id}`, {
      method: 'DELETE',
    });
  },

  async getUserOrders(userId) {
    return this.apiCall(`/orders/user/${userId}`);
  },

  async getOrderStats() {
    return this.apiCall('/orders/stats/summary');
  },
};

export const AppContextProvider = ({ children }) => {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currency, setCurrency] = useState('$');
  const [isSeller, setIsSeller] = useState(false);

  const [loadingStates, setLoadingStates] = useState({
    products: false,
    categories: false,
    orders: false,
    users: false,
  });

  const handleError = useCallback((error, context = '') => {
    console.error(`Error in ${context}:`, error);
    setError(error.message || 'An unexpected error occurred');
    setTimeout(() => setError(null), 5000); 
  }, []);

  const setLoadingState = useCallback((key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoadingState('products', true);
    try {
      const response = await apiService.getProducts(params);
      setProducts(response.data || []);
      return response;
    } catch (error) {
      handleError(error, 'fetchProducts');
      return { data: [] };
    } finally {
      setLoadingState('products', false);
    }
  }, [handleError, setLoadingState]);

  const fetchProduct = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await apiService.getProduct(id);
      return response.data;
    } catch (error) {
      handleError(error, 'fetchProduct');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const addProduct = async (productData) => {
    setLoading(true);
    try {
      const response = await apiService.createProduct(productData);
      if (response.success) {
        await fetchProducts(); 
      }
      return response;
    } catch (error) {
      handleError(error, 'addProduct');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    setLoading(true);
    try {
      const response = await apiService.updateProduct(id, productData);
      if (response.success) {
        await fetchProducts(); 
      }
      return response;
    } catch (error) {
      handleError(error, 'updateProduct');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    setLoading(true);
    try {
      const response = await apiService.deleteProduct(id);
      if (response.success) {
        await fetchProducts(); 
      }
      return response;
    } catch (error) {
      handleError(error, 'removeProduct');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = useCallback(async (params = {}) => {
    setLoadingState('categories', true);
    try {
      const response = await apiService.getCategories(params);
      setCategories(response.data || []);
      return response;
    } catch (error) {
      handleError(error, 'fetchCategories');
      return { data: [] };
    } finally {
      setLoadingState('categories', false);
    }
  }, [handleError, setLoadingState]);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiService.loginUser(email, password);
      if (response.success) {
        setUser(response.data);
        setIsSeller(response.data.role === 'seller' || response.data.role === 'admin');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response;
      }
      return response;
    } catch (error) {
      handleError(error, 'loginUser');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setIsSeller(false);
    setCart([]);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    router.push('/');
  };

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartAmount = () => {
    return cart.reduce((total, item) => total + (item.offerPrice || item.price) * item.quantity, 0);
  };

  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      const response = await apiService.createOrder(orderData);
      if (response.success) {
        clearCart(); 
        await fetchOrders(); 
      }
      return response;
    } catch (error) {
      handleError(error, 'createOrder');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (params = {}) => {
    setLoadingState('orders', true);
    try {
      const response = await apiService.getOrders(params);
      setOrders(response.data || []);
      return response;
    } catch (error) {
      handleError(error, 'fetchOrders');
      return { data: [] };
    } finally {
      setLoadingState('orders', false);
    }
  };

  const fetchUserOrders = async (userId) => {
    setLoadingState('orders', true);
    try {
      const response = await apiService.getUserOrders(userId);
      return response.data || [];
    } catch (error) {
      handleError(error, 'fetchUserOrders');
      return [];
    } finally {
      setLoadingState('orders', false);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.removeItem('user');
      localStorage.removeItem('cart'); 
      setUser(null);
      setIsSeller(false);
      setCart([]);
    } else {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsSeller(userData.role === 'seller' || userData.role === 'admin');
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('user');
        }
      }
      
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing saved cart data:', error);
          localStorage.removeItem('cart');
        }
      }
    }
    fetchProducts({ limit: 100 });
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const contextValue = {
    products,
    categories,
    user,
    cart,
    orders,
    loading,
    error,
    loadingStates,
    currency,
    isSeller,
    router,

    apiService,

    fetchProducts,
    fetchProduct,
    addProduct,
    updateProduct,
    removeProduct,

    fetchCategories,

    loginUser,
    logoutUser,

    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartCount,
    getCartAmount,

    createOrder,
    fetchOrders,
    fetchUserOrders,

    setError,
    setCurrency,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export default AppContext;
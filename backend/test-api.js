const testAPIs = async () => {
  const BASE_URL = 'http://localhost:4000';
  
  console.log('🚀 Starting E-commerce API Tests');
  console.log('=' .repeat(50));

  const makeRequest = async (method, endpoint, data = null) => {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      return {
        status: response.status,
        success: response.ok,
        data: result
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        error: error.message
      };
    }
  };
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  const runTest = async (testName, testFunction) => {
    try {
      console.log(`\\n🧪 Testing: ${testName}`);
      const result = await testFunction();
      
      if (result.success) {
        console.log(`✅ PASSED: ${testName}`);
        results.passed++;
      } else {
        console.log(`❌ FAILED: ${testName}`);
        console.log(`   Error: ${result.error || result.data?.message || 'Unknown error'}`);
        results.failed++;
      }
      
      results.tests.push({
        name: testName,
        success: result.success,
        details: result
      });
    } catch (error) {
      console.log(`❌ FAILED: ${testName}`);
      console.log(`   Error: ${error.message}`);
      results.failed++;
      results.tests.push({
        name: testName,
        success: false,
        error: error.message
      });
    }
  };

  await runTest('Server Health Check', async () => {
    const response = await makeRequest('GET', '/health');
    return {
      success: response.status === 200 && response.data.status === 'OK',
      data: response.data
    };
  });
  
  await runTest('API Documentation', async () => {
    const response = await makeRequest('GET', '/');
    return {
      success: response.status === 200 && response.data.message,
      data: response.data
    };
  });
  
  console.log('\\n📦 PRODUCTS API TESTS');
  console.log('-'.repeat(30));
  
  await runTest('Get All Products', async () => {
    const response = await makeRequest('GET', '/api/products');
    return {
      success: response.status === 200 && Array.isArray(response.data.data),
      data: response.data
    };
  });
  
  await runTest('Get Products with Pagination', async () => {
    const response = await makeRequest('GET', '/api/products?page=1&limit=2');
    return {
      success: response.status === 200 && 
               response.data.pagination && 
               response.data.pagination.itemsPerPage === 2,
      data: response.data
    };
  });
  
  await runTest('Get Products with Filtering', async () => {
    const response = await makeRequest('GET', '/api/products?category=Electronics');
    return {
      success: response.status === 200 && Array.isArray(response.data.data),
      data: response.data
    };
  });
  
  await runTest('Get Single Product', async () => {
    const response = await makeRequest('GET', '/api/products/1');
    return {
      success: response.status === 200 && response.data.data.id === 1,
      data: response.data
    };
  });
  
  await runTest('Create New Product', async () => {
    const newProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      offerPrice: 89.99,
      category: 'Test Category',
      brand: 'Test Brand',
      quantity: 10
    };
    const response = await makeRequest('POST', '/api/products', newProduct);
    return {
      success: response.status === 201 && response.data.data.name === 'Test Product',
      data: response.data
    };
  });
  
  await runTest('Update Product', async () => {
    const updateData = { name: 'Updated Test Product' };
    const response = await makeRequest('PUT', '/api/products/1', updateData);
    return {
      success: response.status === 200 && response.data.data.name === 'Updated Test Product',
      data: response.data
    };
  });

  console.log('\\n👥 USERS API TESTS');
  console.log('-'.repeat(30));
  
  await runTest('Get All Users', async () => {
    const response = await makeRequest('GET', '/api/users');
    return {
      success: response.status === 200 && Array.isArray(response.data.data),
      data: response.data
    };
  });
  
  await runTest('Get Single User', async () => {
    const response = await makeRequest('GET', '/api/users/1');
    return {
      success: response.status === 200 && 
               response.data.data.id === 1 && 
               !response.data.data.password,
      data: response.data
    };
  });
  
  await runTest('User Login', async () => {
    const loginData = {
      email: 'admin@ecommerce.com',
      password: 'admin123'
    };
    const response = await makeRequest('POST', '/api/users/login', loginData);
    return {
      success: response.status === 200 && 
               response.data.data.email === 'admin@ecommerce.com' &&
               !response.data.data.password,
      data: response.data
    };
  });
  
  await runTest('Create New User', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer'
    };
    const response = await makeRequest('POST', '/api/users', newUser);
    return {
      success: response.status === 201 && 
               response.data.data.email === 'test@example.com' &&
               !response.data.data.password,
      data: response.data
    };
  });
  
  console.log('\\n📂 CATEGORIES API TESTS');
  console.log('-'.repeat(30));
  
  await runTest('Get All Categories', async () => {
    const response = await makeRequest('GET', '/api/categories');
    return {
      success: response.status === 200 && Array.isArray(response.data.data),
      data: response.data
    };
  });
  
  await runTest('Get Category Tree', async () => {
    const response = await makeRequest('GET', '/api/categories?tree=true');
    return {
      success: response.status === 200 && Array.isArray(response.data.data),
      data: response.data
    };
  });
  
  await runTest('Get Single Category', async () => {
    const response = await makeRequest('GET', '/api/categories/1');
    return {
      success: response.status === 200 && response.data.data.id === 1,
      data: response.data
    };
  });
  
  await runTest('Create New Category', async () => {
    const newCategory = {
      name: 'Test Category',
      description: 'Test Description'
    };
    const response = await makeRequest('POST', '/api/categories', newCategory);
    return {
      success: response.status === 201 && response.data.data.name === 'Test Category',
      data: response.data
    };
  });
  
  console.log('\\n🛒 ORDERS API TESTS');
  console.log('-'.repeat(30));
  
  await runTest('Get All Orders', async () => {
    const response = await makeRequest('GET', '/api/orders');
    return {
      success: response.status === 200 && Array.isArray(response.data.data),
      data: response.data
    };
  });
  
  await runTest('Get Single Order', async () => {
    const response = await makeRequest('GET', '/api/orders/1');
    return {
      success: response.status === 200 && response.data.data.id === 1,
      data: response.data
    };
  });
  
  await runTest('Get Orders by User', async () => {
    const response = await makeRequest('GET', '/api/orders/user/2');
    return {
      success: response.status === 200 && Array.isArray(response.data.data),
      data: response.data
    };
  });
  
  await runTest('Get Order Statistics', async () => {
    const response = await makeRequest('GET', '/api/orders/stats/summary');
    return {
      success: response.status === 200 && 
               typeof response.data.data.totalOrders === 'number',
      data: response.data
    };
  });
  
  await runTest('Create New Order', async () => {
    const newOrder = {
      userId: 2,
      items: [
        {
          productId: 1,
          productName: 'Test Product',
          price: 99.99,
          quantity: 1,
          total: 99.99
        }
      ],
      shippingAddress: {
        fullName: 'Test User',
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country',
        phone: '1234567890'
      },
      paymentMethod: 'credit_card'
    };
    const response = await makeRequest('POST', '/api/orders', newOrder);
    return {
      success: response.status === 201 && response.data.data.userId === 2,
      data: response.data
    };
  });
  
  console.log('\\n🚨 ERROR HANDLING TESTS');
  console.log('-'.repeat(30));
  
  await runTest('404 Error - Invalid Endpoint', async () => {
    const response = await makeRequest('GET', '/api/invalid');
    return {
      success: response.status === 404,
      data: response.data
    };
  });
  
  await runTest('400 Error - Invalid Product Data', async () => {
    const invalidProduct = { name: '' };
    const response = await makeRequest('POST', '/api/products', invalidProduct);
    return {
      success: response.status === 400,
      data: response.data
    };
  });
  
  await runTest('400 Error - Invalid ID Format', async () => {
    const response = await makeRequest('GET', '/api/products/invalid-id');
    return {
      success: response.status === 400,
      data: response.data
    };
  });
  
  await runTest('404 Error - Product Not Found', async () => {
    const response = await makeRequest('GET', '/api/products/9999');
    return {
      success: response.status === 404,
      data: response.data
    };
  });
 
  console.log('\\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.failed > 0) {
    console.log('\\n🔍 Failed Tests:');
    results.tests
      .filter(test => !test.success)
      .forEach(test => {
        console.log(`   - ${test.name}: ${test.error || test.details?.data?.message || 'Unknown error'}`);
      });
  }
  
  console.log('\\n🎉 Testing completed!');
  
  return results;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testAPIs };
}

if (typeof window === 'undefined' && require.main === module) {
  if (typeof fetch === 'undefined') {
    console.log('❌ This test script requires Node.js 18+ or a fetch polyfill');
    console.log('💡 To run tests:');
    console.log('   1. Start the server: npm start');
    console.log('   2. In another terminal: node test-api.js');
    console.log('   Or use a tool like Postman/Insomnia to test the endpoints manually');
    process.exit(1);
  }
  
  testAPIs().catch(console.error);
}
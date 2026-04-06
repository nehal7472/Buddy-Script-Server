const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API connection...');
    
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check passed:', health.data);
    
    // Test 2: Register a user
    console.log('\n2. Testing registration...');
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: '123456'
    };
    console.log('Registering:', testUser.email);
    
    const register = await axios.post('http://localhost:5000/api/auth/register', testUser);
    console.log('✅ Registration successful!');
    console.log('User ID:', register.data.user._id);
    console.log('Token received:', register.data.token ? 'Yes' : 'No');
    
    // Test 3: Login
    console.log('\n3. Testing login...');
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful!');
    console.log('Welcome:', login.data.user.firstName, login.data.user.lastName);
    
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed!');
    if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to backend. Make sure backend is running on port 5000');
      console.error('Run: npm run dev in the backend directory');
    } else if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error message:', error.response.data.message || error.response.data);
      console.error('Full error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAPI();
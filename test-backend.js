const axios = require('axios');

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const health = await axios.get('http://localhost:5000/health');
    console.log('Health check:', health.data);
    
    // Test registration
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: '123456'
    };
    
    console.log('\nAttempting to register:', testUser.email);
    
    const register = await axios.post('http://localhost:5000/api/auth/register', testUser);
    console.log('Registration success:', register.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testBackend();
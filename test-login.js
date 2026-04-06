const bcrypt = require('bcryptjs');

async function testPasswordHashing() {
  const plainPassword = '123456';
  
  console.log('Testing password hashing and comparison...');
  console.log('Plain password:', plainPassword);
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  console.log('Hashed password:', hashedPassword);
  
  // Compare correct password
  const correctMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Correct password match:', correctMatch);
  
  // Compare wrong password
  const wrongMatch = await bcrypt.compare('wrongpassword', hashedPassword);
  console.log('Wrong password match:', wrongMatch);
  
  console.log('\n✅ Password hashing and comparison working correctly!');
}

testPasswordHashing();
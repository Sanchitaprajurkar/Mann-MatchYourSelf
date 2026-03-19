// Script to create and set admin token for testing
const createAdminToken = () => {
  // Create a mock admin token for testing
  const mockAdminToken = 'mock-admin-token-for-testing';
  
  // Set the token in localStorage
  localStorage.setItem('adminToken', mockAdminToken);
  
  // Create a mock admin user
  const mockAdmin = {
    id: '1',
    name: 'MANN Admin',
    email: 'admin@mann.com',
    role: 'admin'
  };
  
  console.log('Mock admin token set:', mockAdminToken);
  console.log('Mock admin user:', mockAdmin);
  console.log('You can now access the admin panel without authentication.');
  
  return { token: mockAdminToken, admin: mockAdmin };
};

// Auto-execute for testing
createAdminToken();

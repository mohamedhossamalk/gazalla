import { createUser } from '../lib/database';

async function createAdminUser() {
  try {
    // Create admin user directly in memory/database
    const adminUser = await createUser({
      name: 'Admin User',
      email: 'admin@gazalla.com',
      password: 'admin123', // In a real app, this should be hashed
      role: 'admin'
    });
    
    console.log('Admin user created successfully!');
    console.log('Email: admin@gazalla.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('User ID:', adminUser._id || 'N/A');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the function
createAdminUser().then(() => {
  console.log('Script completed');
  process.exit(0);
});
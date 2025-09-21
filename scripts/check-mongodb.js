const { spawn } = require('child_process');

console.log('Checking MongoDB installation and status...\n');

// Check if MongoDB is installed
const mongod = spawn('mongod', ['--version']);

mongod.on('error', (err) => {
  console.log('❌ MongoDB is not installed or not in PATH');
  console.log('\nTo install MongoDB:');
  console.log('1. Visit: https://www.mongodb.com/try/download/community');
  console.log('2. Download and install MongoDB Community Server');
  console.log('3. Make sure to add MongoDB to your system PATH during installation\n');
});

mongod.on('close', (code) => {
  if (code === 0) {
    console.log('✅ MongoDB is installed');
    
    // Check if MongoDB service is running by checking port usage
    console.log('\nChecking if MongoDB service is running...');
    
    const netstat = spawn('netstat', ['-an']);
    let output = '';
    
    netstat.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netstat.on('close', (code) => {
      if (output.includes('27017')) {
        console.log('✅ MongoDB service appears to be running (port 27017 is in use)');
        console.log('\nYour application should connect to MongoDB successfully!');
      } else {
        console.log('⚠️  MongoDB service does not appear to be running');
        console.log('\nTo start MongoDB:');
        console.log('1. Run: net start MongoDB (Windows service)');
        console.log('2. Or run: mongod (manual start)');
        console.log('\nNote: The application will work with in-memory storage as fallback');
      }
    });
  }
});

// Also check for MongoDB in common installation paths
setTimeout(() => {
  console.log('\nChecking common MongoDB installation paths...');
  
  const fs = require('fs');
  const paths = [
    'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\5.0\\bin\\mongod.exe'
  ];
  
  let found = false;
  for (const path of paths) {
    if (fs.existsSync(path)) {
      console.log(`✅ Found MongoDB at: ${path}`);
      console.log('Try adding this to your system PATH environment variable:');
      console.log(path.replace('\\bin\\mongod.exe', '\\bin'));
      found = true;
      break;
    }
  }
  
  if (!found) {
    console.log('❌ MongoDB not found in common installation paths');
  }
}, 2000);

// Timeout after 5 seconds
setTimeout(() => {
  console.log('\nCheck completed. If you see this message without results, MongoDB might not be installed.');
}, 5000);
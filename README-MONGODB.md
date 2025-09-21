# MongoDB Setup Instructions

## Installing MongoDB

To use the full database functionality of this application, you need to install MongoDB Community Server:

### Windows Installation

1. Download MongoDB Community Server:
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select "Windows x64" platform
   - Download the MSI installer

2. Install MongoDB:
   - Run the downloaded MSI file
   - Choose "Complete" setup type
   - Select "Run service as Network Service user" (default)
   - Choose "Install MongoDB Compass" (optional)
   - Complete the installation

3. Verify Installation:
   - Open Command Prompt or PowerShell
   - Run: `mongod --version`
   - You should see the MongoDB version information

### Starting MongoDB Service

After installation, MongoDB should start automatically as a Windows service. To verify:

1. Open Command Prompt or PowerShell
2. Run: `net start | findstr Mongo`
3. You should see "MongoDB Server" in the output

Alternatively, you can manually start MongoDB:
1. Run: `net start MongoDB`
2. To stop: `net stop MongoDB`

### Manual Startup (if service isn't working)

If the service isn't working, you can run MongoDB manually:

1. Create a data directory:
   ```
   mkdir C:\data\db
   ```

2. Start MongoDB:
   ```
   mongod --dbpath C:\data\db
   ```

## Checking Connection Status

You can check the database connection status in the application:

1. Start the development server: `npm run dev`
2. Visit: http://localhost:3000/database-status
3. The page will show whether MongoDB is connected or if the application is using in-memory storage

## Current Status

The application is currently working with in-memory storage as a fallback. All features work correctly, but data will not persist between server restarts. Installing MongoDB will enable persistent data storage.
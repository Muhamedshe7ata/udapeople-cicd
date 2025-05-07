// backend/ecosystem.config.js
module.exports = {
    apps: [
      {
        name: "my-backend-app",    // <--- !!! CHANGE THIS to your desired app name in PM2
        script: "./dist/main.js",   // <--- VERIFY THIS is the path to your compiled entry point
                                    //      (Your CircleCI logs confirmed dist/main.js is created)
        // Optional settings you might want to configure:
        // instances: 1,             // Number of instances (e.g., "max" to use all CPU cores, or a number)
        // exec_mode: "fork",        // "fork" or "cluster" (if instances > 1)
        // cwd: "./",                // Current working directory (usually where ecosystem.config.js is, so "./" is fine)
        // watch: false,             // true to restart on file changes (not recommended for production)
        // max_memory_restart: '1G', // Example: Restart if app uses more than 1GB of RAM
        // log_date_format: "YYYY-MM-DD HH:mm Z",
        // error_file: "/home/ubuntu/logs/app-err.log", // Optional: separate error log file
        // out_file: "/home/ubuntu/logs/app-out.log",  // Optional: separate out log file
        // merge_logs: true,
        // env: {                    // Environment variables available to your app
        //   NODE_ENV: "development" 
        // },
        // env_production: {         // Environment variables for production mode (if you use NODE_ENV=production)
        //   NODE_ENV: "production",
        //   PORT: 3000              // Example: if your app listens on a port
           // Add other production-specific environment variables here
        // }
      }
    ]
  };
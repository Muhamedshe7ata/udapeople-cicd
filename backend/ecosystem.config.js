// backend/ecosystem.config.js
module.exports = {
  apps: [{
    name: "my-backend-app",    // Your app name
    script: "./dist/main.js",    // Path to your compiled entry point
    // Optional settings you might want to configure:
    instances: 1,               // Number of instances (e.g., "max" to use all CPU cores, or a number)
    exec_mode: "fork",          // "fork" or "cluster" (if instances > 1)
    cwd: "./",                  // Current working directory (usually where ecosystem.config.js is, so "./" is fine)
    watch: false,               // true to restart on file changes (not recommended for production)
    // max_memory_restart: "1G", // Example: Restart if app uses more than 1GB of RAM
    log_date_format: "YYYY-MM-DD HH:mm Z",
    // error_file: "/home/ubuntu/logs/app-err.log", // Optional: separate error log file
    // out_file: "/home/ubuntu/logs/app-out.log",   // Optional: separate out log file
    merge_logs: true,
    // env: {                     // Environment variables for default/development mode
    //   NODE_ENV: "development"
    // },
    env_production: {          // Environment variables for production mode (when NODE_ENV=production)
      NODE_ENV: "production",
      PORT: 3030,              // The port your NestJS app should listen on

      // --- TYPEORM VARIABLES - ADD THESE ---
      TYPEORM_CONNECTION: "postgres", // Or your DB type if different
      TYPEORM_HOST: "udapeople-db2.cdmi2qaac5y1.eu-north-1.rds.amazonaws.com", // From your PM2 logs
      TYPEORM_PORT: 5432, // From your PM2 logs
      TYPEORM_USERNAME: "postgres",    // !!! REPLACE with your actual DB username !!!
      TYPEORM_PASSWORD: "Berlin2025#$",  // !!! REPLACE with your actual DB password !!!
      TYPEORM_DATABASE: "glee", // From your PM2 logs
      TYPEORM_SYNCHRONIZE: "false", // IMPORTANT: Should be false in production to avoid data loss
      TYPEORM_ENTITIES:  "dist/modules/domain/**/*.entity.js", // CRITICAL: Path to your compiled entities
      // TYPEORM_MIGRATIONS: "dist/migrations/*.js", // If you use migrations, path to compiled migrations
      // TYPEORM_MIGRATIONS_DIR: "dist/migrations",  // If you use migrations
      // TYPEORM_MIGRATIONS_RUN: "true", // Or false, depending on your strategy
      // TYPEORM_LOGGING: "true", // Or "false" or specific options like ["query", "error"] for debugging

      // --- ADD ANY OTHER PRODUCTION-SPECIFIC ENVIRONMENT VARIABLES YOUR APP NEEDS ---
      // For example, JWT secrets, API keys, etc.
      // JWT_SECRET: "your_production_jwt_secret",
      // AWS_REGION: "eu-north-1", 
      // etc...
    }
  }]
};



// // backend/ecosystem.config.js
// module.exports = {
//     apps: [
//       {
//         name: "my-backend-app",    // <--- !!! CHANGE THIS to your desired app name in PM2
//         script: "./dist/main.js",   // <--- VERIFY THIS is the path to your compiled entry point
//                                     //      (Your CircleCI logs confirmed dist/main.js is created)
//         // Optional settings you might want to configure:
//         // instances: 1,             // Number of instances (e.g., "max" to use all CPU cores, or a number)
//         // exec_mode: "fork",        // "fork" or "cluster" (if instances > 1)
//         // cwd: "./",                // Current working directory (usually where ecosystem.config.js is, so "./" is fine)
//         // watch: false,             // true to restart on file changes (not recommended for production)
//         // max_memory_restart: '1G', // Example: Restart if app uses more than 1GB of RAM
//         // log_date_format: "YYYY-MM-DD HH:mm Z",
//         // error_file: "/home/ubuntu/logs/app-err.log", // Optional: separate error log file
//         // out_file: "/home/ubuntu/logs/app-out.log",  // Optional: separate out log file
//         // merge_logs: true,
//         // env: {                    // Environment variables available to your app
//         //   NODE_ENV: "development" 
//         // },
//         // env_production: {         // Environment variables for production mode (if you use NODE_ENV=production)
//         //   NODE_ENV: "production",
//         //   PORT: 3000              // Example: if your app listens on a port
//            // Add other production-specific environment variables here
//         // }
//       }
//     ]
//   };


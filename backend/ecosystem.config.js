module.exports = {
  apps: [{
    name: "my-backend-app", // Your application's name in PM2
    script: "dist/main.js", // Path to your compiled NestJS entry point
    
    instances: 1, // Number of instances to run (1 for "fork" mode, or "max" for cluster mode)
    exec_mode: "fork", // "fork" or "cluster". "fork" is simpler for single instances.
    cwd: "./", // Current working directory for the app (usually where ecosystem.config.js is)
    watch: false, // Set to true to automatically restart on file changes (NOT recommended for production)
    max_memory_restart: "1G", // Example: Restart if app uses more than 1GB of RAM
    log_date_format: "YYYY-MM-DD HH:mm Z", // Date format for PM2 logs
    error_file: "/home/ubuntu/logs/app-err.log", // Optional: path for PM2 error logs for this app
    out_file: "/home/ubuntu/logs/app-out.log", // Optional: path for PM2 standard output logs for this app
    merge_logs: true, // If true, merges logs from all instances of this app

    // Default environment variables (used if no specific --env is specified or if vars aren't in the targeted env)
    env: {
      NODE_ENV: "development", // Default environment
      // You can add other development-specific variables here if needed
    },

    // Environment variables for production mode (activated by `pm2 start ... --env production`)
    env_production: {
      NODE_ENV: "production",
      PORT: 3030, // The port your NestJS application should listen on

      // --- TYPEORM Database Configuration ---
      TYPEORM_CONNECTION: "postgres", // Your database type (e.g., postgres, mysql, etc.)
      TYPEORM_HOST: "udapeople-db2.cdm12qoa5cy1.eu-north-1.rds.amazonaws.com", // Your database host
      TYPEORM_PORT: 5432, // Your database port (ensure it's a number, not a string, if your app expects a number)
      TYPEORM_USERNAME: "postgres", // !!! REPLACE with your ACTUAL production database username !!!
      TYPEORM_PASSWORD: "Berlin2025#$", // !!! REPLACE with your ACTUAL production database password !!!
      TYPEORM_DATABASE: "glee", // Your database name
      TYPEORM_SYNCHRONIZE: "false", // IMPORTANT: Should ALWAYS be false in production to avoid accidental data loss
      TYPEORM_ENTITIES: ["dist/modules/domain/**/*.entity.js"], // Path to your compiled TypeORM entities
      TYPEORM_MIGRATIONS: ["dist/migrations/*.js"], // Path to your compiled TypeORM migrations
      TYPEORM_MIGRATIONS_DIR: "dist/migrations", // Directory where migration CLI looks for/creates migrations
      TYPEORM_MIGRATIONS_RUN: "true", // Set to true to automatically run migrations on startup, or false
      TYPEORM_LOGGING: "true", // Enable TypeORM logging (can be true, false, or ["query", "error"])

      // --- Other Production-Specific Environment Variables ---
      JWT_SECRET: "your_production_jwt_secret", // !!! REPLACE with your ACTUAL production JWT secret !!!
      AWS_REGION: "eu-north-1", // Your AWS region if needed by the application
      // Add any other environment variables your application needs for production here
      // EXAMPLE_API_KEY: "your_production_api_key",
    }
  }]
};
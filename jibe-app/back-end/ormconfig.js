// ormconfig.js
const {Vessel} = require("./src/entities/Vessel");
module.exports = {
    type: 'postgres', // Type of your database (e.g., postgres, mysql, sqlite, etc.)
    host: 'localhost', // Your database host
    port: 5432, // Your database port
    username: 'jibe', // Your database username
    password: 'admin', // Your database password
    database: 'mypsdb', // Your database name
    synchronize: true, // Set to true only in development. It auto-creates the database schema on every application launch.
    logging: true, // Log SQL queries and errors
    entities: ['/src/entities/**/*.ts'], // Array of entity files (JavaScript)
    migrations: ['/src/entities/**/*.ts'], // Array of migration files (JavaScript)
    subscribers: ['/src/entities//**/*.ts'], // Array of subscriber files (JavaScript)
    cli: {
        entitiesDir: 'path/to/entities', // Directory where entities are stored
        migrationsDir: 'path/to/migrations', // Directory where migrations are stored
        subscribersDir: 'path/to/subscribers', // Directory where subscribers are stored
    },
};

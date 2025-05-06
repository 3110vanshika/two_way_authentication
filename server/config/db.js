const { Sequelize } = require('sequelize');

// Initialize Sequelize to connect with Postgres database using environment variables
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
});

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Successfully connected to the database");
        await sequelize.sync({ alter: true }); 
        console.log("Database synchronized");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

connectToDatabase(); 

module.exports = sequelize;

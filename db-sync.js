import { sequelize } from "./db.config.js";
import "./db.js";


// Synchronize the database with the models without deleting data
sequelize.sync({ alter: true }).then(() => {
    console.log("Database synchronized!");
    process.exit();
}).catch(error => {
    console.error("Error synchronizing database:", error);
    process.exit(1);
});
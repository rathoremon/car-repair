const http = require("http");
const app = require("./app");
const { initializeSocket } = require("./config/socket");
const sequelize = require("./config/database");

const server = http.createServer(app);
initializeSocket(server);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connection established.");
    return sequelize.sync();
  })
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
    process.exit(1);
  });

const http = require("http");
const app = require("./app");
const config = require("./config/config");
const { initializeSocket } = require("./config/socket");
const sequelize = require("./config/database");

const server = http.createServer(app);
initializeSocket(server);

sequelize.sync().then(() => {
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
});

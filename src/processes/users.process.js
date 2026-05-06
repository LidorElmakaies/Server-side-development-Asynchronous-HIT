require("dotenv").config();

const UsersService = require("../services/users.service");
const { createProcessApp, startProcess } = require("./process-utils");

const usersService = new UsersService();
const port = Number(process.env.USERS_PORT || 3001);

const serviceName = "users-service";
const registerRoutes = (app, wrap) => {
  app.post("/api/add", wrap(usersService.addUser.bind(usersService)));
  app.get("/api/users", wrap(usersService.listUsers.bind(usersService)));
  app.get("/api/users/:id", wrap(usersService.getUserDetails.bind(usersService)));
};

function createUsersApp() {
  return createProcessApp({
    serviceName,
    registerRoutes
  });
}

if (require.main === module) {
  startProcess({
    serviceName,
    port,
    registerRoutes
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  createUsersApp
};

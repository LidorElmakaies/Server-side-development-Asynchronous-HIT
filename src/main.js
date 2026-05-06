require("dotenv").config();
process.env.SERVICE_NAME = "main-server";

const database = require("./core/database");
const ServerApp = require("./server");

const port = Number(process.env.PORT || 3000);

class MainApplication {
  async start() {
    await database.connect("main-server");
    const serverApp = new ServerApp();
    const app = serverApp.create();
    app.listen(port, () => {
      console.log(`main-server listening on ${port}`);
    });
  }
}

new MainApplication().start().catch((error) => {
  console.error(error);
  process.exit(1);
});

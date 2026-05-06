require("dotenv").config();

const database = require("../models/database.model");
const User = require("../models/user.model");

async function run() {
  await database.connect("seed-script");
  await User.ensureImaginaryUser();
  await database.disconnect();
  console.log("Imaginary user ensured.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

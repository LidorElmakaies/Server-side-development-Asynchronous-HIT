require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/user.model");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.updateOne(
    { id: 123123 },
    {
      $setOnInsert: {
        id: 123123,
        first_name: "mosh",
        last_name: "israeli",
        birthday: new Date("1990-01-01")
      }
    },
    { upsert: true }
  );
  await mongoose.disconnect();
  console.log("Imaginary user ensured.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

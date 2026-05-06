const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const database = require("../../models/database.model");

let mongoServer;

async function initDb() {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  await database.connect("jest-tests");
}

async function clearDb() {
  const collections = mongoose.connection.collections;
  const names = Object.keys(collections);
  for (const name of names) {
    await collections[name].deleteMany({});
  }
}

async function closeDb() {
  await database.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = undefined;
  }
}

module.exports = {
  initDb,
  clearDb,
  closeDb
};

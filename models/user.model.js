const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    birthday: { type: Date, required: true }
  },
  { versionKey: false }
);

userSchema.statics.listUsers = function listUsers() {
  return this.find({}, { _id: 0 }).lean();
};

userSchema.statics.findByBusinessId = function findByBusinessId(id) {
  return this.findOne({ id }).lean();
};

userSchema.statics.createUser = function createUser(payload) {
  return this.create(payload);
};

userSchema.statics.ensureImaginaryUser = function ensureImaginaryUser() {
  return this.updateOne(
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
};

module.exports = mongoose.model("User", userSchema, "users");

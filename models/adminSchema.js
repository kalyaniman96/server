const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    OTP: {
      type: String,
      default: null,
    },
    isDelete: {
      type: String,
      default: "no",
      require: false,
    },
  },
  {
    timestamps: true,
  }
);
//pre-save middleware function for password hashing using bcrypt library
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

module.exports = mongoose.model("Admin", adminSchema);

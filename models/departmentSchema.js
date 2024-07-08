const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },

    isDelete: {
      type: String,
      default: "no",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);

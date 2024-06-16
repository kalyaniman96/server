const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: false,
    },
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    hospitalAffiliation: {
      type: String,
      required: false,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isDelete: {
      type: String,
      default: "no",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);

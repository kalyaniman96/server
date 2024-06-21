const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const patientSchema = new mongoose.Schema(
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
    gender: {
      type: String,
      required: true,
    },
    medicalHistory: {
      type: String,
      required: true,
    },
    currentMedications: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    emergencyContactName: {
      type: String,
      required: false,
    },
    emergencyContactNumber: {
      type: String,
      required: true,
    },
    emergencyContactRelation: {
      type: String,
      required: false,
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

module.exports = mongoose.model("Patient", patientSchema);

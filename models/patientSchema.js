const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const patientSchema = new mongoose.Schema(
  {
    patientName: {
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
    dateOfBirth: {
      type: Date,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: false,
    },
    medicalHistory: {
      type: String,
      required: false,
    },
    currentMedications: {
      type: String,
      required: false,
    },
    allergies: {
      type: String,
      required: false,
    },
    emergencyContactName: {
      type: String,
      required: false,
    },
    emergencyContactPhone: {
      type: String,
      required: false,
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

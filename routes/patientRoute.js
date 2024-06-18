const express = require("express");

const {
  createPatient,
  getAllPatient,
  updatePatient,
  deletePatient,
  getPatientById,
} = require("../controlers/patient");

const route = express.Router();

route.post("/create", createPatient);
route.get("/getdata", getAllPatient);
route.get("/getdata/:id", getPatientById);
route.put("/update/:id", updatePatient);
route.delete("/delete/:id", deletePatient);

module.exports = route;

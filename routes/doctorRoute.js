const express = require("express");

const {
  createDoctor,
  getDoctorData,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
} = require("../controlers/doctor");
const route = express.Router();

route.post("/create", createDoctor);
route.get("/getdata", getDoctorData);
route.get("/getdata/:id", getDoctorById);
route.put("/update/:id", updateDoctor);
route.delete("/delete/:id", deleteDoctor);

module.exports = route;

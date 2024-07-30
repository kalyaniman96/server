const express = require("express");

const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controlers/appointment");

const route = express.Router();

route.post("/create", createAppointment);
route.get("/getdata", getAllAppointments);
route.get("/getdata/:id", getAppointmentById);
route.put("/update/:id", updateAppointment);
route.delete("/delete/:id", deleteAppointment);

module.exports = route;

const express = require("express");

const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  getDoctorsByDepartmentName,
  getPatientsByDepartmentName,
  updateDepartment,
  deleteDepartment,
} = require("../controlers/department");

const route = express.Router();

route.post("/create", createDepartment);
route.get("/getdata", getAllDepartments);
route.get("/getdata/:id", getDepartmentById);
route.get("/getdoctorsbydepartment/:name", getDoctorsByDepartmentName);
route.get("/getpatientsbydepartment/:name", getPatientsByDepartmentName);
route.put("/update/:id", updateDepartment);
route.delete("/delete/:id", deleteDepartment);

module.exports = route;

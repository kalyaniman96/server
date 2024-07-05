const express = require("express");
const Department = require("../models/departmentSchema");
const Doctor = require("../models/doctorSchema");
const Patient = require("../models/patientSchema");

const app = express();
app.use(express.json());

const createDepartment = async (req, res) => {
  try {
    console.log("+++ All department data: ", req.body);

    const newDepartment = new Department({
      name: req.body.name,
      // doctors: req.body.doctors,
      // patients: req.body.patients,
      description: req.body.description,
    });

    const dataInserted = await newDepartment.save();
    console.log("+++ Department data created: ", dataInserted);

    if (dataInserted) {
      res.status(200).json({
        status: "200",
        message: "Data Inserted successfully",
        data: dataInserted,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departmentData = await Department.find({ isDelete: "no" });
    console.log("+++ Department data: ", departmentData);

    if (!departmentData) {
      res.status(404).json({
        status: "404",
        message: "Data not found",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "Data found",
        data: departmentData,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: error.message,
    });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const departmentData = await Department.findOne({ _id: id });
    const doctorsByDepartment = await Doctor.find({
      isDelete: "no",
      department: new RegExp(`^${departmentData.name}$`, "i"),
    }).sort({ createdAt: -1 });
    // ^: Asserts the position at the start of the string.
    // ${departmentData.name}: Inserts the department name dynamically.
    // $: Asserts the position at the end of the string.
    // 'i': Makes the regular expression case-insensitive.
    const patientsByDepartment = await Patient.find({
      department: new RegExp(`^${departmentData.name}$`, "i"),
    });

    console.log(departmentData);

    if (!departmentData) {
      res.status(404).json({
        status: "404",
        message: "Data not found with the provided ID",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "Data found",
        data: departmentData,
        doctors: doctorsByDepartment,
        patients: patientsByDepartment,
      });
    }
  } catch (error) {
    // Handle errors such as invalid ID format or database errors
    res.status(500).json({
      status: "500",
      message: error.message,
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const updatedata = {
      name: req.body.name,
      doctors: req.body.doctors,
      patients: req.body.patients,
      description: req.body.description,
    };

    await Department.updateOne({ _id: req.params.id }, { $set: updatedata });

    const updatedData = await Department.findOne({ _id: req.params.id });
    console.log("Data updated successfully");

    res.status(200).json({
      status: "200",
      message: "Data updated successfully",
      updatedData: updatedData,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const id = req.params.id;
    const departmentPresent = await Department.findById(id);

    if (!departmentPresent) {
      return res.status(404).json({
        status: "404",
        message: "Department not found!",
      });
    } else {
      // await Department.findByIdAndDelete(id);

      let deleteDepartment = {
        isDelete: "yes",
      };

      await Department.updateOne({ _id: id }, { $set: deleteDepartment });
      return res.status(200).json({
        status: "200",
        message: "Data deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};

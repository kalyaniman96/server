const express = require("express");
const Patient = require("../models/patientSchema");

const app = express();
app.use(express.json());

const createPatient = async (req, res) => {
  try {
    console.log("+++ All patient data: ", req.body);

    const newDocument = new Patient({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      medicalHistory: req.body.medicalHistory,
      currentMedications: req.body.currentMedications,
      department: req.body.department,
      emergencyContactName: req.body.emergencyContactName,
      emergencyContactNumber: req.body.emergencyContactNumber,
      emergencyContactRelation: req.body.emergencyContactRelation,
    });

    const dataInserted = await newDocument.save();
    console.log("+++ Patient data created ? ", dataInserted);

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

const getAllPatient = async (req, res) => {
  try {
    const patientData = await Patient.find({ isDelete: "no" }).sort({
      createdAt: -1,
    });
    console.log("+++ Patient data: ", patientData);

    if (!patientData) {
      res.status(404).json({
        status: "404",
        message: "Data not found",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "data found",
        data: patientData,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: error.message,
    });
  }
};

const getPatientById = async (req, res) => {
  try {
    const id = req.params.id;
    const patientData = await Patient.findOne({ _id: id });
    console.log(patientData);

    if (!patientData) {
      res.status(404).json({
        status: "404",
        message: "Data not found with the provided ID",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "Data found",
        data: patientData,
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

const updatePatient = async (req, res) => {
  try {
    const updatedata = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      medicalHistory: req.body.medicalHistory,
      currentMedications: req.body.currentMedications,
      department: req.body.department,
      emergencyContactName: req.body.emergencyContactName,
      emergencyContactNumber: req.body.emergencyContactNumber,
      emergencyContactRelation: req.body.emergencyContactRelation,
    };

    await Patient.updateOne({ _id: req.params.id }, { $set: updatedata });

    const updatedData = await Patient.findOne({ _id: req.params.id });
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

const deletePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const userPresent = await Patient.findById(id);

    if (!userPresent) {
      return res.status(404).json({
        status: "404",
        message: "User not found !",
      });
    } else {
      // await Patient.findByIdAndDelete(id);

      let deletePatient = {
        isDelete: "yes",
      };

      await Patient.updateOne({ _id: id }, { $set: deletePatient });
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
  createPatient,
  getAllPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};

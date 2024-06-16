const express = require("express");
const Doctor = require("../models/doctorSchema");
const secret = process.env.SECRET;

const app = express();
app.use(express.json());

const createDoctor = async (req, res) => {
  try {
    console.log("+++ allData", req.body);

    const newDocument = new Doctor({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      department: req.body.department,
      gender: req.body.gender,
      qualification: req.body.qualification,
      experience: req.body.experience,
      hospitalAffiliation: req.body.hospitalAffiliation,
      licenseNumber: req.body.licenseNumber,
      address: req.body.address,
    });
    const dataInserted = await newDocument.save();
    console.log("+++ API response: ", dataInserted);
    if (dataInserted) {
      res.status(200).json({
        status: "200",
        message: "Data Inserted successfully",
        fulldata: dataInserted,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "500",
      error: err.message,
    });
  }
};

const getDoctorData = async (req, res) => {
  try {
    const data = await Doctor.find({ isDelete: "no" }).sort({ createdAt: -1 });
    console.log("+++doctor data", data);

    if (!data) {
      res.status(404).json({
        status: "404",
        message: "Data not found with the provided ID",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "data found",
        data: data,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: error.message,
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Doctor.findOne({ _id: id });
    console.log(data);

    if (!data) {
      res.status(404).json({
        status: "404",
        message: "Data not found with the provided ID",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "Data found",
        data: data,
      });
    }
  } catch (err) {
    // Handle errors such as invalid ID format or database errors
    res.status(500).json({ message: err.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const updatedata = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      department: req.body.department,
      gender: req.body.gender,
      qualification: req.body.qualification,
      experience: req.body.experience,
      hospitalAffiliation: req.body.hospitalAffiliation,
      licenseNumber: req.body.licenseNumber,
      address: req.body.address,
    };

    await Doctor.updateOne({ _id: req.params.id }, { $set: updatedata });

    const updatedData = await Doctor.findOne({ _id: req.params.id });
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

const deleteDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const userPresent = await Doctor.findById(id);

    if (!userPresent) {
      return res.status(404).json({
        status: "404",
        message: "User not found !",
      });
    } else {
      // await Playlist.findByIdAndDelete(id);

      let delDoctor = {
        isDelete: "yes",
      };

      await Doctor.updateOne({ _id: id }, { $set: delDoctor });
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
  createDoctor,
  getDoctorData,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};

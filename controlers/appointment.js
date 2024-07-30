const express = require("express");
const Appointment = require("../models/appointmentSchema");

const app = express();
app.use(express.json());

const createAppointment = async (req, res) => {
  try {
    const newAppointment = new Appointment({
      department: req.body.department,
      doctor: req.body.doctor,
      patient: req.body.patient,
      date: req.body.date,
    });

    const newData = await newAppointment.save();
    console.log("+++ New appointment data: ", newData);

    if (newData) {
      res.status(200).json({
        status: "200",
        message: "New appointment created successfully",
        data: newData,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const allAppointments = await Appointment.find({ isDelete: "no" });
    console.log("+++ All appointments: ", allAppointments);

    if (!allAppointments) {
      res.status(404).json({
        status: "404",
        message: "No data found",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "Data found",
        data: allAppointments,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: error.message,
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const appointmentData = await Appointment.findOne({ _id: id });

    if (!appointmentData) {
      res.staus(404).json({
        status: "404",
        message: "No data found",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: " Data found",
        data: appointmentData,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: error.message,
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = {
      department: req.body.department,
      doctor: req.body.doctor,
      patient: req.body.patient,
      date: req.body.date,
    };

    await Appointment.updateOne({ _id: id }, { $set: updateData });
    const updatedData = await Appointment.findOne({ _id: id });
    console.log("Data updated successfully");

    if (updatedData) {
      res.status(200).json({
        status: "200",
        message: "Data updated successfully",
        data: updatedData,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "Data could not be updated",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        status: "404",
        message: " No data found",
      });
    } else {
      //hard delete
      // await Appointment.findByIdAndDelete(id);
      // soft delete
      let deleteAppointment = {
        isDelete: "yes",
      };

      await Appointment.updateOne({ _id: id }, { $set: deleteAppointment });
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
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};

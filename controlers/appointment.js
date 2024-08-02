const express = require("express");
const Appointment = require("../models/appointmentSchema");
const Doctor = require("../models/doctorSchema");
const Patient = require("../models/patientSchema");
const nodemailer = require("nodemailer");
const user = process.env.user;
const password = process.env.pass;

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
      // find the doctor & patient to whom email to be sent
      const doctor = await Doctor.findOne({ name: newData.doctor });
      const patient = await Patient.findOne({ name: newData.patient });
      // Create email transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        from: "morekilometersmorefun@gmail.com",
        auth: {
          user: user,
          pass: password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Compose email for doctor
      const mailToDoctor = {
        from: "morekilometersmorefun@gmail.com",
        to: doctor.email,
        subject: "New appointment alert",
        text: `Dear sir ${doctor.name} , you have an appointment with Mr/Ms ${patient.name} on ${newData.date}`,
      };
      // Compose email for patient
      const mailToPatient = {
        from: "morekilometersmorefun@gmail.com",
        to: patient.email,
        subject: "New appointment alert",
        text: `Dear Mr/Ms ${patient.name} , you have an appointment with Dr ${doctor.name} on ${newData.date}`,
      };
      // Send emails using Promise.all for concurrent sending
      await Promise.all([
        transporter.sendMail(mailToDoctor),
        transporter.sendMail(mailToPatient),
      ])
        .then(() => {
          res.status(200).json({
            status: "200",
            message: "New appointment created successfully",
            data: newData,
          });
        })
        .catch((error) => console.error("Error sending emails:", error));
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

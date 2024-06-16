const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Admin = require("../models/adminSchema");
const Doctor = require("../models/doctorSchema");
const nodemailer = require("nodemailer");
const secret = process.env.SECRET;
const user = process.env.user;
const password = process.env.pass;

const app = express();
app.use(express.json());

const createAdmin = async (req, res) => {
  try {
    console.log("+++ allData", req.body);

    const newDocument = new Admin({
      //   name: req.body.name,
      adminId: req.body.adminId,
      email: req.body.email,
      password: req.body.password,
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
    res.send(err);
  }
};

const adminLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    let adminPresent = await Admin.findOne({ email: email });
    const totalDoctors = await Doctor.find({ isDelete: "no" });
    console.log("+++ Admin data: ", adminPresent);
    console.log("+++ total doctors: ", totalDoctors.length);
    if (!adminPresent) {
      return res.status(401).json({
        status: "401",
        message: "no user found! Check your email & password",
      });
    } else {
      const isPassWordValid = await bcrypt.compare(
        password,
        adminPresent.password
      );
      if (!isPassWordValid) {
        return res.status(404).json({
          status: "404",
          message: "email or password is/are incorrect",
        });
      } else {
        //If user is validated then generate jwt token
        const token = jwt.sign({ adminId: adminPresent._id }, secret);
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 50000),
          httpOnly: true,
        });
        res.status(200).json({
          status: "200",
          message: "Login successful with doctor count",
          logindata: adminPresent,
          token: token,
          totalDoctors: totalDoctors.length,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      status: "500",
      errorMessage: err,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const user = await Admin.findOne({
      _id: id,
    });
    if (newPassword !== confirmPassword) {
      return res.status(404).json({
        status: "404",
        message: "password and confirmPassword must be shame",
      });
    } else {
      // Reset password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("+++ New Password (encrypted) :", hashedPassword);
      user.password = hashedPassword;

      const allData = await Admin.updateOne({ _id: id }, { $set: user });
      console.log("+++ new Data:", allData);

      return res.status(200).json({
        status: "200",
        message: "Password reset successful",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    // Retrieve user email from request body
    const email = req.body.email;

    // Generate a random OTP
    const otp = crypto.randomInt(1000, 9999);

    // Find if the user exists by checking if the email matches
    const userExists = await Admin.findOne({
      email: email,
    });
    console.log("+++ User data: ", userExists);

    if (!userExists) {
      return res.status(404).json({
        status: "404",
        message: "User not found",
      });
    } else {
      await Admin.updateOne(
        { email: email },
        { $set: { OTP: otp } },
        { new: true }
      );

      setTimeout(async () => {
        // Reset OTP after 5 minutes
        await Doctor.updateOne({ email: email }, { $set: { OTP: null } });
      }, 5 * 60 * 1000); // 5 minutes in milliseconds

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

      // Compose email
      const mailOptions = {
        from: "morekilometersmorefun@gmail.com",
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. Please use it within 5 minutes.`,
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error occurred while sending email:", error);
          return res.status(500).json({ message: "Failed to send OTP email" });
        } else {
          console.log("Email sent:", info.response);
          res.status(200).json({ message: "OTP sent to your email" });
        }
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { otp, email, newPassword, confirmPassword } = req.body;
    console.log(otp);
    // Find the user by ID
    const user = await Admin.findOne({
      email: email,
      OTP: otp,
    });
    console.log("User Data: ", user);
    // Check for OTP match
    if (!user) {
      return res.status(404).json({ message: "Invalid OTP" });
    } else {
      if (newPassword !== confirmPassword) {
        return res
          .status(404)
          .json({ message: "password and confirmPassword not matching" });
      } else {
        // Reset password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("+++ New Password (encrypted) :", hashedPassword);
        user.password = hashedPassword;
        user.OTP = null; //Unset OTP

        const allData = await Admin.updateOne({ email: email }, { $set: user });
        console.log(allData);

        return res.status(200).json({ message: "Password reset successful" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAdminData = async (req, res) => {
  try {
    const id = req.params.id;
    let data = await Admin.findOne({ _id: id });
    const totalDoctors = await Doctor.find({ isDelete: "no" });

    console.log("+++admin data", data);

    if (!data) {
      res.status(404).json({
        status: "404",
        message: "Data not found with the provided ID",
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "user found",
        totalDoctors: totalDoctors.length,
        userData: data,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: error.message,
    });
  }
};

module.exports = {
  createAdmin,
  adminLogin,
  changePassword,
  forgotPassword,
  resetPassword,
  getAdminData,
};

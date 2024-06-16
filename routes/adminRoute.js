const express = require("express");

const {
  createAdmin,
  adminLogin,
  getAdminData,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controlers/admin");
const route = express.Router();

// const upload = require("../middlewair/upload");
// const uploadmulti = require("../middlewair/upload");

route.post("/create", createAdmin);
route.post("/login", adminLogin);
route.post("/changepassword/:id", changePassword);
route.post("/forgotpassword", forgotPassword);
route.post("/resetpassword", resetPassword);
route.get("/getdata/:id", getAdminData);

module.exports = route;

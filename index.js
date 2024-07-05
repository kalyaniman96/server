const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const conn = require("./DB/db");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorRoute");
const patientRoute = require("./routes/patientRoute");
const departmentRoute = require("./routes/departmentRoute");

const port = process.env.SERVER_PORT || 3002;

const app = express();
// app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow only specific headers
  })
);

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
//routes
app.use("/admin", adminRoute);
app.use("/doctor", doctorRoute);
app.use("/patient", patientRoute);
app.use("/department", departmentRoute);

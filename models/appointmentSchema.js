const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },
    doctor: {
      type: String,
      required: true,
    },
    patient: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    // status: {
    //   type: String,
    //   enum: ["Pending", "Completed", "Cancelled"],
    //   default: "Pending",
    //   required: false,
    // },
    isDelete: {
      type: String,
      default: "no",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

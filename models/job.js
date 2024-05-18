const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "please provide company title"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "please provide position title"],
      maxlength: 50,
    },
    status: {
      type: String,
      enum: ["interviewing", "pending", "declined"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Jobs", JobSchema);

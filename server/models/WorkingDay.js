const mongoose = require("mongoose");

const workingDaySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
    },

    totalDays: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One working-days record per user per academic year
workingDaySchema.index(
  {
    createdBy: 1,
    academicYear: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "WorkingDay",
  workingDaySchema
);

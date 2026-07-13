import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId:   { type: String, unique: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName:    { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  type:        { type: String, enum: ["airport", "tour", "custom"], default: "airport" },
  pickup:      { type: String, required: true },
  dropoff:     { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  passengers:  { type: Number, default: 1, min: 1, max: 20 },
  vehicleId:   { type: String, required: true },
  tourSlug:    { type: String, default: null },
  tourName:    { type: String, default: null },
  totalUsd:    { type: Number, required: true, min: 0 },
  status:      { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  notes:       { type: String, default: "" },
}, { timestamps: true });

bookingSchema.pre("save", function (next) {
  if (!this.bookingId) {
    this.bookingId = "RES-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

export default mongoose.model("Booking", bookingSchema);

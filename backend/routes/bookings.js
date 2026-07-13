import express from "express";
import Booking from "../models/Booking.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// POST /api/bookings — create (logged in user)
router.post("/", protect, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user._id });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/bookings/my — own bookings
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings — all bookings (admin)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (q) {
      filter.$or = [
        { fullName:  { $regex: q, $options: "i" } },
        { email:     { $regex: q, $options: "i" } },
        { bookingId: { $regex: q, $options: "i" } },
        { tourName:  { $regex: q, $options: "i" } },
      ];
    }
    const bookings = await Booking.find(filter)
      .populate("user", "fullName email phone role")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/status — update status (admin)
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/bookings/:id — delete (admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/stats — analytics (admin)
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allBookings, monthBookings] = await Promise.all([
      Booking.find({}).lean(),
      Booking.find({ createdAt: { $gte: monthStart } }).lean(),
    ]);

    const monthRevenue = monthBookings
      .filter((b) => b.status !== "cancelled")
      .reduce((s, b) => s + b.totalUsd, 0);

    // Last 7 days trend
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const trend = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toISOString().slice(0, 10);
      return {
        day: days[d.getDay()],
        value: allBookings.filter((b) => b.createdAt.toISOString().slice(0, 10) === dayStr).length,
      };
    });

    // Popular tours
    const tourCounts = {};
    allBookings.forEach((b) => {
      if (b.tourName) tourCounts[b.tourName] = (tourCounts[b.tourName] || 0) + 1;
    });
    const popularTours = Object.entries(tourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, bookings]) => ({ name, bookings }));

    res.json({
      totalBookings:  monthBookings.length,
      monthRevenue,
      pendingCount:   allBookings.filter((b) => b.status === "pending").length,
      confirmedCount: allBookings.filter((b) => b.status === "confirmed").length,
      trend,
      popularTours,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

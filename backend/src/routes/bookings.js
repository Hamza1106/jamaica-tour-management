import { Router } from "express";
import Booking from "../models/Booking.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// POST /api/bookings — create (logged-in user)
router.post("/", protect, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user._id });
    res.status(201).json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/bookings/my — own bookings
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings — all bookings (admin)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const { status, search, limit = 100, skip = 0 } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search) {
      filter.$or = [
        { fullName:  { $regex: search, $options: "i" } },
        { email:     { $regex: search, $options: "i" } },
        { bookingId: { $regex: search, $options: "i" } },
        { tourName:  { $regex: search, $options: "i" } },
      ];
    }
    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).limit(Number(limit)).skip(Number(skip)).populate("user", "fullName email phone"),
      Booking.countDocuments(filter),
    ]);
    res.json({ bookings, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/stats — dashboard stats (admin)
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, monthBookings, pending, confirmed, allBookings] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: monthStart } }),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.find({}, "totalUsd status tourName createdAt type").lean(),
    ]);

    const monthRevenue = allBookings
      .filter((b) => b.createdAt >= monthStart && b.status !== "cancelled")
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
      .sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([name, bookings]) => ({ name, bookings }));

    res.json({ total, monthBookings, monthRevenue, pending, confirmed, trend, popularTours });
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
    res.json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/bookings/:id — delete (admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/cancel — user cancels own booking
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status !== "pending")
      return res.status(400).json({ error: "Only pending bookings can be cancelled" });
    booking.status = "cancelled";
    await booking.save();
    res.json({ booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

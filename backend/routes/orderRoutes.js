const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// route=>1: GET  /api/orders/my-orders
// desc: Get logged-in users order
// access: private

router.get("/my-orders", protect, async (req, res) => {
  try {
    // Find orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); // sort by the recent order first
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// route=>2: GET  /api/orders/:id
// desc:  Get order details by Id
// access: private

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      res.status(404).json({ message: "Order not found" });
    }

    // Return the full order details

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

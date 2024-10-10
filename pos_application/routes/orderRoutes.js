const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");

// ดึงข้อมูลออเดอร์ทั้งหมด
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// อัปเดตสถานะของออเดอร์
router.put("/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = router;

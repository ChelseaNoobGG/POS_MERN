const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // ใช้ ObjectId สำหรับ category
      ref: 'Type', // ชื่อ model ของ Type
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // แก้ไขเป็น timestamps แทน timestamp
);

const Items = mongoose.model("Items", itemSchema);

module.exports = Items;

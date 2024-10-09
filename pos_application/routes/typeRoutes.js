const express = require("express");
const {
  getTypeController,
  addTypeController,
  editTypeController,
  deleteTypeController,
} = require("../controllers/typeController");

const router = express.Router();

// Method - GET
router.get("/get-type", getTypeController);

// Method - POST
router.post("/add-type", addTypeController);

// Method - PUT
router.put("/edit-type", editTypeController);

// Method - DELETE
router.post("/delete-type", deleteTypeController);

module.exports = router;

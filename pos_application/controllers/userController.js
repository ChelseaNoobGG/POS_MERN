const userModal = require("../models/userModel");

// login user
const loginController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await userModal.findOne({ userId, password, verified: true });
    if (user) {
      res.status(200).send(user);
    } else {
      res.json({
        message: "ล็อคอินไม่สำเร็จ",
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//register
const registerController = async (req, res) => {
  try {
    const newUser = new userModal({ ...req.body, verified: true });
    await newUser.save();
    res.status(201).send("สมัครสมาชิกเรียบร้อย");
  } catch (error) {
    res.status(400).send("เกิดข้อผิดพลาด", error);
    console.log(error);
  }
};

module.exports = {
  loginController,
  registerController,
};

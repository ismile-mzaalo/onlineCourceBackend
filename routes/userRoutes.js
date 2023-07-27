const express = require("express");
const {
  registerUser,
  authUser,
  getUsers,
  createCourse,
  getCourse,
  updateCourse,
} = require("../controller/userController");

const router = express.Router();

router.route("/").post(registerUser).get(getUsers);
router.post("/login", authUser);
router.route("/course").post(createCourse).get(getCourse);
router.put("/course/:id", updateCourse);

module.exports = router;

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Course = require("../models/courseModel");

//@desc register new user
//@route post/api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const userExists = await User.findOne({ name });

  if (userExists) {
    res.status(400); //bad request
    throw new Error("User already exists");
  }

  const user = await User.create({ name, password });

  if (user) {
    //201-successfully created
    res.status(201).json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400); //bad request
    throw new Error("invalid user data");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });

  if (user && user.password === password) {
    res.json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401); //unauthorized
    throw new Error("Invalid email or password");
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const createCourse = asyncHandler(async (req, res) => {
  const { name, level, description, image } = req.body;

  const Exists = await Course.findOne({ name });

  if (Exists) {
    res.status(400); //bad request
    throw new Error("Course already exists");
  }
  const created = await Course.create({
    name,
    level,
    description,
  });
  res.status(201).json(created);
});

const getCourse = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

const updateCourse = asyncHandler(async (req, res) => {
  const _id = req.params.id;

  const { name, date, userId } = req.body;

  const course = await Course.findOne({ _id });

  if (course) {
    const alreadyAssigned = course.lectures.map((i) => {
      const datee = new Date(i.date);

      // Extracting date components
      const year = datee.getFullYear();
      const month = datee.getMonth() + 1; // Months are zero-based, so we add 1
      const day = datee.getDate();

      // Formatting the date
      const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      if (formattedDate === date && i.user.toString() === userId.toString()) {
        return true;
      }
    });

    if (alreadyAssigned.includes(true)) {
      res.status(400);
      throw new Error("Lecture already Assigned to User on this date");
    }

    const lecture = {
      name,
      date,
      user: userId,
    };

    course.lectures.push(lecture);

    await course.save();

    res.status(201).json({ message: "Lecture added and user Assigned" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
module.exports = {
  registerUser,
  authUser,
  getUsers,
  createCourse,
  getCourse,
  updateCourse,
};

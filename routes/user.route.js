const express = require("express");
const userRouter = express.Router();

const { register, login, changePassword, forgetPassword, resetPassword } = require("../controllers/user.control.js");

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.post("/change-password", changePassword);

module.exports = userRouter;

const express = require("express");
const userRouter = express.Router();

const { register, login , requestPasswordReset, resetPassword } = require("../controllers/user.control.js");

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/reset-password", requestPasswordReset);
userRouter.put("/reset-password/:token", resetPassword);

module.exports = userRouter;

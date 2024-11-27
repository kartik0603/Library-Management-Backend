const User = require("../models/user.schema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
  
    // Basic validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    // Validate email format using a simple regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the user
      const user = await User.create({
        name,
        email,
        password,
        role
      });
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // Send response with the token
      res.status(201).json({ token });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Error registering user", error: error.message });
    }
  };
  
  const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`User with email ${email} not found.`);
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log(`Incorrect password for user: ${email}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // If the password is valid, generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Error logging in", error: error.message });
    }
  };



  const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
        const resetTokenExpiration = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpire = resetTokenExpiration;
        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/api/users/reset-password/${resetToken}`;
        console.log("Generated Reset URL:", resetUrl); // Log the reset URL

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Support" <${process.env.EMAIL}>`,
            to: email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click the link below:</p>
                   <a href="${resetUrl}">${resetUrl}</a>
                   <p>This link is valid for 15 minutes.</p>`,
        });

        res.status(200).json({ message: "Password reset link sent to email" });
    } catch (error) {
        console.error("Error requesting password reset:", error);
        res.status(500).json({ message: "Error requesting password reset", error: error.message });
    }
};




// Reset Password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
    }

    try {
        if (!token) {
            return res.status(400).json({ message: "Reset token is required" });
        }

        const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        const newToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Password reset successful", token: newToken });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};





module.exports = { register, login, requestPasswordReset, resetPassword };

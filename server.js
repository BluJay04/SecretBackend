const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Connect to MongoDB with error handling
mongoose.connect("mongodb+srv://arunpakalomattom20:jYn0502LSzdzz1u4@cluster0.tanhj.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true }
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Add root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/submit", async (req, res) => {
  const { name, email, phone } = req.body;
  
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // If user does not exist, create a new user
    const newUser = new User({ name, email, phone });
    await newUser.save();
    res.status(201).json({ message: "User saved successfully", data: newUser });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Error saving user" });
  }
});

// Add a GET route to fetch all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Add a GET route to fetch user count
app.get("/users/count", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ count: userCount });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Error fetching user count" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
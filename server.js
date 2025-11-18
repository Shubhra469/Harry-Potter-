const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const app = express();

mongoose.connect("mongodb://localhost:27017/hpwebsite");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

// Show pages
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));

// HANDLE SIGNUP FORM  ← PUT THIS HERE
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await User.create({ name, email, password });
        res.redirect("/login");
    } catch (err) {
        res.send("User already exists or error occurred.");
    }
});

// HANDLE LOGIN FORM
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) return res.send("Invalid credentials");

    res.send(`Welcome ${user.name}!`);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

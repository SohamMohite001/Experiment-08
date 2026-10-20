require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.mysecretkey;
const PORT = process.env.PORT || 5000;

// Login and generate token
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {

        const token = jwt.sign(
            { username: username },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.json({ message: "Login successful", token });
    }

    res.status(401).json({ message: "Invalid credentials" });
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Token required" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
}

// Protected route
app.get("/dashboard", verifyToken, (req, res) => {
    res.json({
        message: "Welcome to the dashboard",
        user: req.user.username
    });
});

app.listen(PORT, () => {
    console.log("Server running on port ",PORT);
});
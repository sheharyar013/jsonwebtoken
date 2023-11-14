const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const secretKey = process.env.SECRET_KEY;

app.use(express.json());

const users = [
  {
    username: "admin",
    password: "admin",
    id: 1,
  },
  {
    username: "user2",
    password: "password2",
    id: 2,
  },
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "60s",
    });

    res.json({
      token: token,
      expiresIn: 60,
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/verifyToken", (req, res) => {
  const token = req.header("Authorization");

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      res.json({ message: "Token is valid", decodedToken: decoded });
    }
  });
});

const PORT = 4040;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

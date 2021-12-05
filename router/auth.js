const express = require("express");
const User = require("../model/User.js");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authmiddleware");

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    // check user exists
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    user = new User({
      name,
      email,
      password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err)
          return res.status(400).json({ msg: "Error hasing a password" });
        user.password = hash;
        user.save().then((newUser) => {
          if (user) {
            const payload = {
              user: {
                id: user.id,
              },
            };
            jwt.sign(
              payload, // token으로 변환할 데이터
              "jwtSecret", // secret key 값
              { expiresIn: "1h" }, // token의 유효시간을 1시간으로 설정
              (err, token) => {
                if (err) throw err;
                res.send({ token });
              }
            );
          }
        });
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ name: user.name, email: user.email, id: user._id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("server error");
  }
});
module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const port = process.env.PORT || 9000;

app.use(express.json({ extended: false }));
app.use(cors());

//데이터베이스 연결
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    console.log("데이터베이스가 연결되었습니다.");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("회원가입");
});

app.use("/auth", require("./router/auth"));

app.listen(port, () => {
  console.log(`서버가 실행중입니다. localhost:${port}`);
});

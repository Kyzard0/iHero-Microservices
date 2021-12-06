import dotenv from "dotenv";
import { databaseConnect } from "./config/database.js";
import { authHandler } from "./middlewares/auth.js";
import express, { json } from "express";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import cors from "cors";

import User from "./models/user.js";

dotenv.config();
databaseConnect();

const app = express();

app.use(cors());
app.use(json());


// Register
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send("All input are required");
    }

    const oldUser = await User.findOne({ username });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      password: encryptedPassword,
    });

    const token = Jwt.sign(
      { user_id: user._id, username },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/auth/login", async (req, res) => {

  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ username: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = Jwt.sign(
        { user_id: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;

      res.status(200).json(user);
    }
    else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

app.get('/auth/check-token', authHandler, function (req, res) {
  res.sendStatus(200)
})


export default app;
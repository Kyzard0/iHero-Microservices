import dotenv from "dotenv";
import { databaseConnect } from "./config/database.js";
import express, { json } from "express";
import { threatRouter } from "./routes.js";
import { connectToThreatsReport } from "./services/threatService.js";
import cors from "cors";

dotenv.config();
databaseConnect();
connectToThreatsReport();

const app = express();
app.use(cors());
app.use(json());
app.use(threatRouter);

export default app;
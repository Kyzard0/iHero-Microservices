import dotenv from "dotenv";
import { databaseConnect } from "./config/database.js";
import express, { json } from "express";
import { battleRouter } from "./routes.js";
import { monitoreBattleSystem } from "./services/battleService.js";
import cors from "cors";

dotenv.config();
databaseConnect();
setInterval(monitoreBattleSystem, 15000);

const app = express();
app.use(cors());
app.use(json());
app.use(battleRouter);

export default app;
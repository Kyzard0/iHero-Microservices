import express from 'express'
import { getActiveBattles, getBattles } from './services/battleService.js';


const battleRouter = express.Router()

battleRouter.get("/api/battles/", (req, res) => {
  getBattles()
    .then((battles) => res.json({ result: 'Success', battles }))
    .catch()
});

battleRouter.get("/api/battles/:id", async (req, res) => {
  getBattles(req.params.id)
    .then((battles) => res.json({ result: 'Success', battles }))
    .catch()
});

battleRouter.get("/api/battles/active_battles", async (req, res) => {
  getActiveBattles()
    .then((battles) => res.json({ result: 'Success', battles }))
    .catch()
});

export { battleRouter }
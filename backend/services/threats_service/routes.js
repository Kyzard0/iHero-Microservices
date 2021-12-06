import express from 'express'
import {
  getThreats,
  getActiveThreats,
  updateThreat
} from './services/threatService.js';


const threatRouter = express.Router()

threatRouter.get("/api/threats/", (req, res) => {
  getThreats()
    .then((threats) => res.json({ result: 'Success', threats }))
    .catch()
});

threatRouter.get("/api/threats/:id/", async (req, res) => {
  getThreats(req.params.id)
    .then((threats) => res.json({ result: 'Success', threats }))
    .catch()
});

threatRouter.put("/api/threats/:id/", async (req, res) => {
  updateThreat(req.body)
    .then((threat) => res.json({ result: 'Success', threat }))
    .catch()
});

threatRouter.get("/api/threats/service/active_threats/", async (req, res) => {
  getActiveThreats()
    .then((threats) => {
      res.json({ result: 'Success', threats })
    })
    .catch(error => console.log(error))
});


export { threatRouter }
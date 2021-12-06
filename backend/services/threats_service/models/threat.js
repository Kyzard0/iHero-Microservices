import moment from "moment";
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const threatSchema = new Schema({
  name: { type: String },
  level: { type: String },
  location: { type: String },
  isActive: { type: Boolean, default: true },
  inBattle: { type: Boolean, default: false },
  startTimestamp: { type: Number, default: moment().unix() },
  battle_with: { type: String }
});

export default model("Threat", threatSchema);

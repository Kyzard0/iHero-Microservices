import moment from "moment";
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const battleSchema = new Schema({
  hero: {
    id: { type: Number },
    name: { type: String },
    rank: { type: String },
    current_location: { type: String },
    inBattle: { type: Boolean },
  },
  threat: {
    _id: { type: String },
    name: { type: String },
    level: { type: String },
    location: { type: String },
    isActive: { type: Boolean },
    inBattle: { type: Boolean },
    startTimestamp: { type: Number },
    battle_with: { type: String }
  },
  isActive: { type: Boolean, default: true },
  startTimestamp: { type: Number, default: moment().unix() },
  endTimestamp: { type: Number },
});

export default model("Battle", battleSchema);

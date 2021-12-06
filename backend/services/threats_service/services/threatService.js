import Threat from "../models/threat.js";
import io from "socket.io-client";

export const getThreats = async (id = '') => {
  if (id) {
    return await Threat.findOne({ _id: _id })
  }
  return await Threat.find({ isActive: true })
}

export const updateThreat = async (threat) => {
  return await Threat.findByIdAndUpdate(threat._id, threat)
}

export const getActiveThreats = async () => {
  return await Threat.find({ isActive: true, inBattle: false })
}

export const registerNewThreat = async (newThreat) => {
  if (newThreat) {
    const threatFound = await Threat.findOne({
      name: newThreat.name,
      level: newThreat.level,
    })
    if (threatFound) {
      if (threatFound.isActive === false) {
        threatFound.location = newThreat.location;
        threatFound.isActive = true;
        threatFound.save()
      }
      return true
    }
    await Threat.create(newThreat, function (err, threat) {
      if (err) return err;
    })
    return true
  }

}

export const connectToThreatsReport = async () => {
  const socket = io.connect(process.env.THREATS_SOCKET)

  socket.on('occurrence', threat => {
    const newThreat = {
      name: threat.monsterName,
      level: threat.dangerLevel.toUpperCase(),
      location: `${threat.location[0].lat},${threat.location[0].lng}`,
    };
    registerNewThreat(newThreat);
  });
}
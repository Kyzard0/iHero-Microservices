import axios from "axios"
import moment from "moment"
import Battle from "../models/battle.js"

export const getBattles = async (id = '') => {
  if (id) {
    return await Battle.findOne({ id: id })
  }
  return await Battle.find({})
}

export const getActiveBattles = async () => {
  return await Battle.find({ isActive: true })
}

const startBattle = async (hero, threat) => {
  hero.current_location = threat.location
  hero.inBattle = true
  threat.inBattle = true
  threat.battle_with = hero.name

  await Promise.all([
    await axios
      .put(`http://localhost:8080/api/heroes/${hero.id}/`,
        { ...hero },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }).catch((error) => console.log(error)),
    await axios
      .put(`http://localhost:8080/api/threats/${threat._id}/`, threat,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }),
    await Battle.create({
      hero,
      threat,
      endTimestamp: moment().unix() + getPredictedBattleDuration(threat)
    })
  ])
}

const distributeBattles = async () => {
  const threats = await getActiveThreats();
  if (threats && threats.length > 0) {
    for (let threat of threats) {
      const closestHeroAvailable = await getClosestHeroAvailable(threat)
      if (closestHeroAvailable) {
        await startBattle(closestHeroAvailable, threat)
      }
    }
  }
}

const getClosestHeroAvailable = async (threat) => {
  const response = await axios
    .post(`http://localhost:8080/api/heroes/hero_available/`, threat, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
  return response.data
}

const getActiveThreats = async () => {
  const response = await axios
    .get(`http://localhost:8080/api/threats/service/active_threats/`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).catch(error => console.log(error))
  return response.data.threats
}

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getPredictedBattleDuration = (threat) => {
  if (threat.level === 'GOD') {
    return getRandomIntInclusive(300, 600)
  } else if (threat.level === 'DRAGON') {
    return getRandomIntInclusive(120, 300)
  } else if (threat.level === 'TIGER') {
    return getRandomIntInclusive(10, 20)
  } else {
    return getRandomIntInclusive(1, 2)
  }

}

const endBattle = async (battle) => {
  battle.isActive = false
  battle.hero.inBattle = false
  battle.threat.isActive = false
  battle.threat.inBattle = false
  battle.save()

  await Promise.all([
    await axios
      .put(`http://localhost:8080/api/heroes/${battle.hero.id}/`, { ...battle.hero }, {
        headers: {
          'Content-Type': 'application/json',
        }
      }),
    await axios
      .put(`http://localhost:8080/api/threats/${battle.threat._id}/`, battle.threat, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
  ])
}

const updateBattles = async () => {
  const activeBattles = await getActiveBattles();
  for (let battle of activeBattles) {
    const timestamp = moment().unix()
    if (battle.endTimestamp <= timestamp) {
      await endBattle(battle)
    }
  }
  return true
}

export const monitoreBattleSystem = async () => {
  await Promise.all([
    await updateBattles(),
    await distributeBattles()
  ]);
}
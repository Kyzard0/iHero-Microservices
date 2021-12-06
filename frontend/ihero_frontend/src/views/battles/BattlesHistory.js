import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

export const BattlesHistory = () => {
  const [battles, setBattles] = useState([]);
  const countRef = useRef(0);

  useEffect(() => {
    retrieveAllBattles();
  }, [countRef]);

  const retrieveAllBattles = () => {
    axios
      .get(`http://localhost:8080/api/battles/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setBattles(response.data.battles);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getDuration = (initial, final) => {
    let time = final - initial
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="row justify-content-center div-table main_card">
      <h2>Battle's History</h2>
      <table id="table" className="table table-bordered table-hover">
        <thead>
          <tr>
            <th scope="col">Threat's Name</th>
            <th scope="col">Threat's Level</th>
            <th scope="col">Threat's Duration</th>
            <th scope="col">Beaten By</th>
            <th scope="col">Battle Duration</th>
            <th scope="col">Location</th>
          </tr>
        </thead>
        <tbody>
          {battles && battles.map((battle) => {
            return !battle.isActive && (
              <tr key={battle.id} >
                <td>{battle.threat.name}</td>
                <td>{battle.threat.level}</td>
                <td>{getDuration(battle.threat.startTimestamp, battle.endTimestamp)}</td>
                <td>{battle.hero.name}</td>
                <td>{getDuration(battle.startTimestamp, battle.endTimestamp)}</td>
                <td>{battle.threat.location}</td>
              </tr>
            )
          }
          )}
          {battles && !battles.length > 0 &&
            <tr>
              <td colSpan="6" className="text-center">
                <div className="p-2">No Data To Display</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};
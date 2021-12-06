import axios from "axios";
import React, { useState, useEffect, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';

const Dashboard = () => {

  const [activeThreats, setActiveThreats] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      window.location.replace('/login');
    }
  }, []);

  useEffect(() => {
    retrieveAllActiveThreats();
    const interval = setInterval(() => {
      retrieveAllActiveThreats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const retrieveAllActiveThreats = async () => {
    await axios
      .get(`http://localhost:8080/api/threats/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setActiveThreats(response.data.threats);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const monsterIcon = L.icon({
    iconUrl: 'monster.png',
  });

  const battleIcon = L.icon({
    iconUrl: 'battle.png',
  });

  return (
    <div className="main_card">
      <Fragment>
        <h2>Threats Map</h2>
        <div className='row justify-content-between'>
          <h3>Hello! Welcome to iHero</h3>
          <div className='col-sm-6'>
            <strong>Number of Active Threats: {activeThreats.length}</strong>
          </div>
        </div>
        <MapContainer center={[51.505, -0.09]} zoom={3} scrollWheelZoom={true} style={{ height: '50vh', margin: '1rem' }}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {activeThreats.length > 0 &&
            activeThreats.map((threat, index) => {
              return threat.inBattle ? (
                <Marker key={index} icon={battleIcon} position={threat.location.split(',').map(Number)}>
                  <Popup>
                    Name: {threat.name} <br /> Danger Level: {threat.level} <br />
                    <strong>In battle with: {threat.battle_with}</strong>
                  </Popup>
                </Marker>
              ) : (
                <Marker key={index} icon={monsterIcon} position={threat.location.split(',').map(Number)}>
                  <Popup>
                    Name: {threat.name} <br /> Danger Level: {threat.level}
                  </Popup>
                </Marker>
              )
            })}
        </MapContainer>
      </Fragment>
    </div>
  );
};

export default Dashboard;

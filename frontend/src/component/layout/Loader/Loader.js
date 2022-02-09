import React from 'react';
import './Loader.css';
import profilePng from "../../../images/profile.jpeg";
import MetaData from "..//Header/MetaData";
const Loader = () => {
  return <div className="loading">
    <MetaData title="Loading . . ." />
      <img style={{width:"10vmax", height:"10vmax",borderRadius:"50%"}}src={profilePng} alt="User" />
      <h4>Ruko jara , sabar karo.....</h4>
      <div>
      </div>
  </div>;
};

export default Loader;


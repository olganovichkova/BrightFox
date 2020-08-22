import React from "react";

const RoomNumber = (props) => {
  if (!props.location) {
    return <span className="location-time-font"> - </span>;
  }
  return <span className="location-time-font">Room {props.location}</span>;
};

export default RoomNumber;

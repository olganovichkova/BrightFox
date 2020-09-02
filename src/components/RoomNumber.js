import React from "react";

const RoomNumber = (props) => {
  if (!props.location) {
    return <span className="location-time-font"> - </span>;
  }
  return <span className="location-time-font">{props.location.name}</span>;
};

export default RoomNumber;

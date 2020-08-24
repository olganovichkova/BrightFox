import React, { useState, useEffect } from "react";
import Sound from "react-sound";
import moment from "moment";

const HourBell = (props) => {
  const [hour, updateHour] = useState(moment().add(1, day).format("hh"));

  useEffect(() => {}, []);
};

export default HourBell;

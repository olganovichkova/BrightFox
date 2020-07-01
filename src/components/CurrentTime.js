import React, { useState, useEffect } from "react";
import moment from "moment";

const CurrentTime = () => {
  const [time, updateTime] = useState(moment().format("h:mm:ss"));

  useEffect(() => {
    setInterval(function () {
      updateTime(moment().format("h:mm:ss"));
    }, 1000);
  }, []);

  return (
    <span className="badge badge-pill badge-custom float-right">{time}</span>
  );
};

export default CurrentTime;

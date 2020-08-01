import React, { useState, useEffect } from "react";
import moment from "moment";

import { defineActive } from "../utils/utils";

const CurrentTime = (props) => {
  const [time, updateTime] = useState(moment().format("h:mm"));
  const [prevTime, updatePrevTime] = useState(moment().format("mm"));

  useEffect(() => {
    setInterval(function () {
      updateTime(moment().format("h:mm"));
      let curTime = moment().format("mm");
      if (prevTime != curTime) {
        updatePrevTime(curTime);
        console.log("prevTime did not equal curTime");
        defineActive(props.navBarData, props.onActiveTimeChange);
      }
    }, 1000);
  }, []);

  return (
    <span className="badge badge-pill badge-custom float-right">{time}</span>
  );
};

export default CurrentTime;

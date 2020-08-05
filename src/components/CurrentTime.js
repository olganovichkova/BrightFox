import React, { useState, useEffect } from "react";
import moment from "moment";

import { defineActive } from "../utils/utils";

const CurrentTime = (props) => {
  const [time, updateTime] = useState(moment().format("h:mm"));
  // const [prevTime, updatePrevTime] = useState(
  //   moment().format("s").substring(0, 1)
  // );
  const [prevTime, updatePrevTime] = useState(moment().format("hh"));

  useEffect(() => {
    let interval = setInterval(function () {
      updateTime(moment().format("h:mm"));
      // let curTime = moment().format("s").substring(0, 1);
      let curTime = moment().format("hh");
      if (prevTime != curTime) {
        updatePrevTime(curTime);
        console.log("prevTime did not equal curTime");
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    defineActive(props.navBarData, props.onActiveTimeChange);
  }, [prevTime]);

  return (
    <span className="badge badge-pill badge-custom float-right">{time}</span>
  );
};

export default CurrentTime;

import React from "react";
// let result = {
//     time: timeSlot,
//     period: period,
//     active: active,
//     roundClockTime: roundClockTime,
//   };
const NavBar = (props) => {
  return (
    <div className="text-center nav-bar">
      {props.data.map((timeSlot) => {
        return (
          <span
            key={timeSlot.time}
            className={`time-slot ${
              props.activeTime == timeSlot.time
                ? "time-slot-bold"
                : "time-slot-opaque"
            }`}
            onClick={() => {
              props.onClick(timeSlot.time);
            }}
          >{`${timeSlot.time}${timeSlot.period}`}</span>
        );
      })}
    </div>
  );
};

export default NavBar;

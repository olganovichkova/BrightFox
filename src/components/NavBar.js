import React from "react";
// let result = {
//     time: timeSlot,
//     period: period,
//     active: active,
//     roundClockTime: roundClockTime,
//   };
const NavBar = (props) => {
  if (!props.init) {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  if (props.init && props.data.length == 0) {
    return (
      <div className="text-center">
        <h1> No appointments for today,</h1>
        <h1> check in tomorrow! </h1>
      </div>
    );
  }
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

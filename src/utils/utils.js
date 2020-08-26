import moment from "moment";
import { groupBy, sortBy } from "lodash";

export const getNavBarData = (todayAppointments) => {
  let gp = groupBy(todayAppointments, (apt) => apt.start24);
  let barData = [];
  //////
  let active = false;
  /////
  for (let timeSlot in gp) {
    //let appointmentTime = gp[timeSlot][0].start;
    let hour = moment(gp[timeSlot][0].start).format("h");
    let period = moment(gp[timeSlot][0].start).format("a");
    let roundClockTime = moment(gp[timeSlot][0].start).format("k");
    ///////
    ///////
    let result = {
      time: timeSlot,
      hour: hour,
      period: period,
      active: active,
      roundClockTime: roundClockTime,
    };
    barData.push(result);
  }
  sortBy(barData, (d) => d.timeslot);
  return barData;
};

export const getActiveTime = (navBarData) => {
  console.log("navBarData : ", navBarData);
  let now = moment().format("k");
  console.log("now : ", now);
  let minActiveTime = navBarData[0].time;
  let maxActiveTime = navBarData[navBarData.length - 1].time;
  if (navBarData.length === 1) {
    return minActiveTime;
  }
  if (now <= Number(minActiveTime)) {
    return minActiveTime;
  }
  if (now >= Number(maxActiveTime)) {
    return maxActiveTime;
  }
  for (let i = 0; i < navBarData.length - 1; i++) {
    if (now > Number(navBarData[i]) && now <= Number(navBarData[i + 1])) {
      return navBarData[i];
    }
  }
};

import moment from "moment";

export const defineActive = (sortednbd, updateAT) => {
  let now = moment().format("k");
  //   for(slot = 0; slot < sortednbd.length; slot++){
  //   let roundClockTime = sortednbd[slot].
  //   }
  console.log(sortednbd);
  if (sortednbd.length == 1) {
    sortednbd[0].active = true;
    updateAT(sortednbd[0].time);
    return;
  }
  if (sortednbd.length > 0 && now <= sortednbd[0].roundClockTime) {
    sortednbd[0].active = true;
    updateAT(sortednbd[0].time);
    return;
  }
  if (
    sortednbd.length > 0 &&
    now >= sortednbd[sortednbd.length - 1].roundClockTime
  ) {
    sortednbd[sortednbd.length - 1].active = true;
    updateAT(sortednbd[sortednbd.length - 1].time);
    return;
  }
  for (let t = 0; t < sortednbd.length - 1; t++) {
    if (
      now >= sortednbd[t].roundClockTime &&
      now < sortednbd[t + 1].roundClockTime
    ) {
      sortednbd[t].active = true;
      updateAT(sortednbd[t].time);
      break;
    }
  }
};

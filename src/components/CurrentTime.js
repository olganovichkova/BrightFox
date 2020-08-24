import React, { useState, useEffect } from "react";
import moment from "moment";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  return [playing, toggle];
};

const CurrentTime = ({ onTimeChange }) => {
  const [time, updateTime] = useState(moment().format("h:mm"));
  // const [prevTime, updatePrevTime] = useState(
  //   moment().format("s").substring(0, 1)
  // );
  const [prevTime, updatePrevTime] = useState(moment().format("hh"));
  const [playing, toggle] = useAudio("music/sound1.mp3");

  useEffect(() => {
    let interval = setInterval(function () {
      updateTime(moment().format("h:mm"));
      // let curTime = moment().format("s").substring(0, 1);
      let curTime = moment().format("hh");
      if (prevTime !== curTime) {
        updatePrevTime(curTime);
        onTimeChange();
        toggle();
        console.log("prevTime did not equal curTime");
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [prevTime, playing, toggle, onTimeChange]);

  return (
    <div>
      <span
        className="badge badge-pill badge-custom float-right"
        onClick={toggle}
      >
        {time}
      </span>
    </div>
  );
};

export default CurrentTime;

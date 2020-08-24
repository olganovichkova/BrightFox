import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import axios from "axios";
import { withAuth } from "@okta/okta-react";
import moment from "moment";
import { groupBy, sortBy } from "lodash";

import CurrentTime from "../components/CurrentTime";
import NavBar from "../components/NavBar";
import ApptCard from "../components/ApptCard";
import { defineActive } from "../utils/utils";
///////
import logo from "../components/logo.png";
//////
const API = process.env.REACT_APP_API || "http://localhost:8080";
const getStartHour = (appt) => {
  //   {
  //     "id":3292034,
  //     "start":"2020-07-08T23:30:00Z",
  //     "finish":"2020-07-09T01:00:00Z",
  //     "topic":"SAT Math",
  //     "status":"planned",
  //     "service":{
  //        "id":150075,
  //        "name":"Math / Science",
  //        "dft_charge_type":"hourly",
  //        "created":"2018-12-11T22:20:28.200674Z",
  //        "dft_charge_rate":"65.00",
  //        "dft_contractor_rate":"0.50",
  //        "status":"in-progress",
  //        "url":"https://secure.tutorcruncher.com/api/services/150075/"
  //     },
  //     "url":"https://secure.tutorcruncher.com/api/appointments/3292034/"
  //  }
  return moment(appt.start).format("h");
};

const getRoundClockHour = (nbd) => {
  return nbd.roundClockTime;
};

const getNavBarData = (gp) => {
  let barData = [];
  //////
  let active = false;
  /////
  for (let timeSlot in gp) {
    //let appointmentTime = gp[timeSlot][0].start;
    let period = moment(gp[timeSlot][0].start).format("a");
    let roundClockTime = moment(gp[timeSlot][0].start).format("k");
    ///////
    ///////
    let result = {
      time: timeSlot,
      period: period,
      active: active,
      roundClockTime: roundClockTime,
    };
    barData.push(result);
  }
  return barData;
};

export default withAuth((props) => {
  const [init, updateInit] = useState(false);
  const [appointments, updateAppointments] = useState([]);
  const [nextUrl] = useState(
    `/appointments?start_gte=${moment().format(
      "YYYY-MM-DD"
    )}&start_lte=${moment().add(1, "day").format("YYYY-MM-DD")}`
  );
  const [navBarData, updateNavBarData] = useState([]);
  const [activeTime, updateActiveTime] = useState("");
  const [groupAppt, updateGroupAppt] = useState({});

  useEffect(() => {
    async function fetchData() {
      let token = await props.auth.getAccessToken();
      axios
        .get(`${API}${nextUrl}`, {
          headers: {
            "content-type": "application/json",
            accept: "application/json",
            authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          updateInit(true);
          //// grouping the appointment results by hour
          let group = groupBy(response.data.results, getStartHour);
          updateGroupAppt(group);
          let navBarData = getNavBarData(group);
          let sortedNavBarData = sortBy(navBarData, getRoundClockHour);
          //defining active time
          defineActive(sortedNavBarData, updateActiveTime);
          updateNavBarData(sortedNavBarData);
        });
    }
    fetchData();
  }, [nextUrl, props.auth]);

  useEffect(() => {
    if (activeTime && init) {
      updateAppointments(groupAppt[activeTime]);
    }
  }, [activeTime, init, groupAppt]);

  const handleOnClick = (time) => {
    updateActiveTime(time);
  };

  return (
    <div>
      <div className="container-fluid">
        <Typography variant="h2">
          <div className="row top-row-margin">
            <div className="col-sm-4">
              <img src={logo} alt="Logo" />
            </div>
            <div className="col-sm-4"></div>
            <div className="col-sm-4 time-text">
              <CurrentTime
                onActiveTimeChange={updateActiveTime}
                navBarData={navBarData}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <NavBar
                init={init}
                data={navBarData}
                onClick={handleOnClick}
                activeTime={activeTime}
              />
            </div>
          </div>
          <br />
        </Typography>
        <div className="row no-gutters row-card-wrapper">
          {appointments.map((appointment) => {
            return (
              <div className="col-sm-3" key={appointment.id}>
                <ApptCard appointment={appointment} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

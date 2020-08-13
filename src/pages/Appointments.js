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
  console.log(moment(appt.start).format("h"));
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
    let appointmentTime = gp[timeSlot][0].start;

    console.log("start time =", appointmentTime);
    let period = moment(gp[timeSlot][0].start).format("a");
    console.log(period);
    console.log("timeSlot = ", timeSlot);
    let roundClockTime = moment(gp[timeSlot][0].start).format("k");
    console.log("24 hour clock = ", roundClockTime);
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
  const [totalCount, updateTotalCount] = useState(0);
  const [nextUrl, updateNextUrl] = useState(
    `/appointments?start_gte=2020-07-17&start_lte=2020-07-18`
  );
  const [requestCount, updateRequestCount] = useState(0);
  const [token, updateToken] = useState("");
  const [navBarData, updateNavBarData] = useState([]);
  const [activeTime, updateActiveTime] = useState("");
  const [groupAppt, updateGroupAppt] = useState({});

  console.log(props.auth);

  useEffect(() => {
    function fetchData() {
      // const token = await props.auth.getAccessToken();
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
          let responseNextUrl = response.data.next;
          if (responseNextUrl != null) {
            let index = responseNextUrl.indexOf("/api/") + 4;
            let url = responseNextUrl.substring(index);
            updateNextUrl(url);
            //https://secure.tutorcruncher.com/api/appointments/?page=2

            let cnt = response.data.count;
            if (response.data.count % 100 === 0) {
              cnt = response.data.count / 100 - 1;
            } else {
              cnt = Math.floor(response.data.count / 100);
            }
            updateRequestCount(cnt);
          }
          updateTotalCount(response.data.count);
        });
    }
    if (token) {
      fetchData();
    }
  }, [token]);

  useEffect(() => {
    if (activeTime) {
      updateAppointments(groupAppt[activeTime]);
    }
  }, [activeTime, groupAppt]);

  useEffect(() => {
    if (init) {
      function fetchData() {
        // You can await here
        // const token = await props.auth.getAccessToken();
        // ...
        let requests = [];
        console.log(requests);
        for (let i = 0; i < requestCount - 1; i++) {
          requests.push(
            axios.get(`${API}/appointments/?page=${i + 2}`, {
              headers: {
                "content-type": "application/json",
                accept: "application/json",
                authorization: `Bearer ${token}`,
              },
            })
          );
        }
        axios.all(requests).then((...responses) => {
          console.log(responses);
        });
      }
      fetchData();
    }
  }, [token]);

  useEffect(() => {
    props.auth.getAccessToken().then((token) => {
      updateToken(token);
    });
  }, [props.auth]);

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

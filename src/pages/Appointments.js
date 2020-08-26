import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import axios from "axios";
import { withAuth } from "@okta/okta-react";
import moment from "moment";

import CurrentTime from "../components/CurrentTime";
import NavBar from "../components/NavBar";
import ApptCard from "../components/ApptCard";
import { getNavBarData, getActiveTime } from "../utils/utils";
///////
import logo from "../components/logo.png";
//////
const API = process.env.REACT_APP_API || "http://localhost:8080";

export default withAuth((props) => {
  const [init, updateInit] = useState(false);
  const [appointments, updateAppointments] = useState([]);
  const [nextUrl] = useState(
    `/appointments?start_gte=${moment()
      .subtract(2, "day")
      .format("YYYY-MM-DD")}&start_lte=${moment()
      .add(2, "day")
      .format("YYYY-MM-DD")}`
  );
  const [navBarData, updateNavBarData] = useState([]);
  const [activeTime, updateActiveTime] = useState("");

  useEffect(() => {
    async function fetchData() {
      let token = await props.auth.getAccessToken();
      if (!token) {
        window.location.reload(true);
      }
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
          if (response && response.data && response.data.length > 0) {
            let todayAppointments = response.data.filter(
              (appointment) =>
                moment().format("D") === moment(appointment.start).format("D")
            );
            let nbdata = getNavBarData(todayAppointments);
            updateNavBarData(nbdata);
            updateActiveTime(getActiveTime(nbdata));
            updateAppointments(todayAppointments);
          }
        });
    }
    if (!init) {
      fetchData();
    }
  }, [nextUrl, props.auth, init]);

  const handleOnClick = (time) => {
    updateActiveTime(time);
  };

  const refresh = () => {
    updateInit(false);
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
              <CurrentTime onTimeChange={refresh} navBarData={navBarData} />
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
          {appointments
            .filter(
              (appointement) =>
                moment(appointement.start).format("k") === activeTime
            )
            .map((appointment) => {
              return (
                <div className="col-sm-3" key={appointment.id}>
                  <ApptCard {...appointment} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
});

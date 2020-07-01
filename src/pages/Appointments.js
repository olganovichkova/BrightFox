import React, { useState, useEffect } from "react";
import { Typography, Badge } from "@material-ui/core";
import axios from "axios";
import { withAuth } from "@okta/okta-react";
import moment from "moment";

import CurrentTime from "../components/CurrentTime";
const API = process.env.REACT_APP_API || "http://localhost:3001";

export default withAuth((props) => {
  const [init, updateInit] = useState(false);
  const [appointments, updateAppointments] = useState([]);
  const [allAppts, updateAllAppts] = useState([]);
  const [totalCount, updateTotalCount] = useState(0);
  const [nextUrl, updateNextUrl] = useState(
    "/appointments?start_gte=2020-06-18&start_lte=2020-06-19"
  );
  const [requestCount, updateRequestCount] = useState(0);
  const [startTime, updateStartTime] = useState(moment().format("h:mm"));
  const [token, updateToken] = useState("");

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
          console.log(response);
          let responseNextUrl = response.data.next;
          if (responseNextUrl != null) {
            let index = responseNextUrl.indexOf("/api/") + 4;
            let url = responseNextUrl.substring(index);
            console.log("final url: ", url);
            updateNextUrl(url);
            //https://secure.tutorcruncher.com/api/appointments/?page=2

            let cnt = response.data.count;
            if (response.data.count % 100 == 0) {
              cnt = response.data.count / 100 - 1;
            } else {
              cnt = Math.floor(response.data.count / 100);
            }
            updateRequestCount(cnt);
            console.log(cnt);
          }
          updateTotalCount(response.data.count);
          updateAppointments(response.data.results);
        });
    }
    fetchData();
  }, [token]);

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

  return (
    <Typography variant="h2">
      <div></div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6"></div>
          <div className="col-sm-6">
            <CurrentTime />
          </div>
        </div>
        <br />
        <div className="row no-gutters row-card-wrapper">
          {appointments.map((appointment) => {
            var start = moment(appointment.start).format("h:mm");
            return (
              <div className="col-sm-3" key={appointment.id}>
                <div className="card person-card appt-card">
                  <div className="card-body">
                    <h1>{start}</h1>
                    <h4>{appointment.topic}</h4>
                    <h2>{appointment.location}</h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Typography>
  );
});

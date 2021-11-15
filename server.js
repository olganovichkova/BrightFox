require("dotenv").config({ path: ".env.local" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const moment = require("moment");
const path = require("path");
const { sortBy } = require("lodash");



const app = express();
app.use(express.static(path.join(__dirname, "build")));
app.use(cors());
app.use(bodyParser.json());



app.get("/appointments", (req, res) => {
  axios
    .get(`https://secure.tutorcruncher.com/api${req.url}`, {
      headers: {
        Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
      },
    })
    .catch((error) => {
      //res.json({});
    })
    .then((response) => {
      let respAppointments = [];
      if (
        response &&
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        let publicProfiles = [];
        axios
          .get(`https://secure.tutorcruncher.com/api/public_contractors/`, {
            headers: {
              Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
            },
          })
          .then((pubProfilesResp) => {
            if (pubProfilesResp && pubProfilesResp.data) {
              publicProfiles = pubProfilesResp.data.results;
              let appointemnts = response.data.results;
              let allAppPromises = [];
              for (let i = 0; i < appointemnts.length; i++) {
                let url = appointemnts[i].url;
                let appPromise = null;
                if (url) {
                  appPromise = axios.get(url, {
                    headers: {
                      Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
                    },
                  });
                  allAppPromises.push(appPromise);
                }
              }
              if (allAppPromises.length > 0) {
                console.log("about to fetch all appointments");
                axios
                  .all(allAppPromises)
                  .then(
                    axios.spread((...responses) => {
                      for (let j = 0; j < responses.length; j++) {
                        if (responses[j].data) {
                          let appDetail = responses[j].data;

                          let id = appDetail.id;
                          let location = appDetail.location;
                          let start = appDetail.start;
                          let start24 = moment(start).format("k");
                          let startAmPm = moment(start).format("ha");
                          let studentName = "";
                          let tutorName = "";
                          let photo = null;

                          let student = null;
                          let tutor = null;

                          if (appDetail.rcras && appDetail.rcras.length > 0) {
                            student = appDetail.rcras[0];
                            studentName = student.recipient_name || "";
                            let studentNameArr = studentName.split(" ");
                            let firstName = studentNameArr[0] || "";
                            let lastName = "";
                            if (studentNameArr.length > 1) {
                              lastName =
                                studentNameArr[1].substring(0, 1) + ".";
                            }
                            studentName = firstName + " " + lastName;
                          }
                          if (appDetail.cjas && appDetail.cjas.length > 0) {
                            tutor = appDetail.cjas[0];
                            tutorName = tutor.name || "";
                            let tutorNameArr = tutorName.split(" ");
                            let firstName = tutorNameArr[0] || "";
                            let lastName = "";
                            if (tutorNameArr.length > 1) {
                              lastName = tutorNameArr[1].substring(0, 1) + ".";
                            }
                            tutorName = firstName + " " + lastName;
                          }

                          if (student != null && tutor != null) {
                            let tutorId = tutor.contractor;
                            for (let k = 0; k < publicProfiles.length; k++) {
                              if (publicProfiles[k].id === tutorId) {
                                photo = publicProfiles[k].photo || null;
                              }
                            }
                            respAppointments.push({
                              id,
                              location,
                              start,
                              start24,
                              startAmPm,
                              studentName,
                              tutorName,
                              photo,
                            });
                          }
                        }
                      }
                      // console.log(
                      //   "response appointments",
                      //   sortBy(respAppointments, (rapp) => rapp.start24)
                      // );
                      res.json(
                        sortBy(respAppointments, (rapp) => rapp.start24)
                      );
                    })
                  )
                  .catch((errors) => {});
              } else {
                res.json(respAppointments);
              }
            } else {
              res.json(respAppointments);
            }
          });
      } else {
        res.json(respAppointments);
      }
    });
});

app.get("/appointments/:id/", (req, res) => {
  axios
    .get(`https://secure.tutorcruncher.com/api${req.url}`, {
      headers: {
        Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
      },
    })
    .catch((error) => {
      //res.json({});
    })
    .then((response) => {
      if (response && response.data) res.json(response.data);
    });
});

app.get("/public_contractors/", (req, res) => {
  axios
    .get(`https://secure.tutorcruncher.com/api${req.url}`, {
      headers: {
        Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
      },
    })
    .catch((error) => {
      //res.json({});
    })
    .then((response) => {
      if (response && response.data) res.json(response.data);
    });
});

app.get("/public_contractors/:id/", (req, res) => {
  console.log("in p_b");
  axios
    .get(`https://secure.tutorcruncher.com/api${req.url}`, {
      headers: {
        Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
      },
    })
    .catch((error) => {
      console.log("in p_c catch");
      //res.json({ error: "error" });
    })
    .then((response) => {
      if (response && response.data) {
        res.json(response.data);
      }
    });
});

app.get("/contractors/:id/", (req, res) => {
  axios
    .get(`https://secure.tutorcruncher.com/api${req.url}`, {
      headers: {
        Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
      },
    })
    .catch((error) => {
      //res.json({});
    })
    .then((response) => {
      if (response && response.data) res.json(response.data);
    });
});

app.get("/recipients/:id", (req, res) => {
  axios
    .get(`https://secure.tutorcruncher.com/api${req.url}`, {
      headers: {
        Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
      },
    })
    .catch((error) => {
      //res.json({});
    })
    .then((response) => {
      if (response && response.data) res.json(response.data);
    });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/implicit/callback", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/appts", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

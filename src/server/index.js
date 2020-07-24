require("dotenv").config({ path: ".env.local" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OktaJwtVerifier = require("@okta/jwt-verifier");
const axios = require("axios");

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      throw new Error("Authorization header is required");

    const accessToken = req.headers.authorization.trim().split(" ")[1];
    await oktaJwtVerifier.verifyAccessToken(accessToken, "api://default");
    next();
  } catch (error) {
    next(error.message);
  }
});

app.get("/appointments", (req, res) => {
  axios
    .get(`https://secure.tutorcruncher.com/api${req.url}`, {
      headers: {
        Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
      },
    })
    .then((response) => {
      res.json(response.data);
    });
});

app.get("/appointments/:id/", (req, res) => {
  axios
    .get(`https://secure.tutorcruncher.com/api${req.url}`, {
      headers: {
        Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
      },
    })
    .then((response) => {
      res.json(response.data);
    });
});

app.get("/public-contractors/:id/", (req, res) => {
  console.log("in");
  axios
    .get(`https://secure.tutorcruncher.com/api${req.url}`, {
      headers: {
        Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
      },
    })
    .then((response) => {
      console.log(response);
      res.json(response.data);
    });
});

app.get("/public-contractors", (req, res) => {
  console.log("in");
  axios
    .get(`https://secure.tutorcruncher.com/api${req.url}`, {
      headers: {
        Authorization: `token ${process.env.API_AUTHORIZATION_TOKEN}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      res.json(response.data);
    });
});

const port = process.env.SERVER_PORT || 3001;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

require("dotenv").config({ path: ".env.local" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OktaJwtVerifier = require("@okta/jwt-verifier");
const axios = require("axios");
const path = require("path");

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
});

const app = express();
app.use(express.static(path.join(__dirname, "build")));
app.use(cors());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try {
    if (
      req.path != "/" &&
      req.path != "/implicit/callback" &&
      req.path != "/appts"
    ) {
      if (!req.headers.authorization)
        throw new Error("Authorization header is required");

      const accessToken = req.headers.authorization.trim().split(" ")[1];
      await oktaJwtVerifier.verifyAccessToken(accessToken, "api://default");
    }
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

app.get("/public_contractors/", (req, res) => {
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
      res.json({});
    })
    .then((response) => {
      if (response && response.data) {
        res.json(response.data);
      } else {
        res.json({});
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
    .then((response) => {
      res.json(response.data);
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
      res.json({});
    })
    .then((response) => {
      res.json(response.data);
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import { withAuth } from "@okta/okta-react";

const API = process.env.REACT_APP_API || "http://localhost:8080";

const ContractorName = (props) => {
  const [lastName, updateLastName] = useState("");
  const [firstName, updateFirstName] = useState("");

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      let token = await props.auth.getAccessToken();
      if (!token) {
        window.location.reload(true);
      }
      console.log("id = ", props.id);
      let url = `${API}/contractors/${props.id}/`;
      console.log(url);
      axios
        .get(url, {
          headers: {
            "content-type": "application/json",
            accept: "application/json",
            authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (isSubscribed) {
            if (response && response.data && response.data.user) {
              if (response.data.user.last_name) {
                updateLastName(response.data.user.last_name);
              }
              if (response.data.user.first_name) {
                updateFirstName(response.data.user.first_name);
              }
            }
          }
        });
    };
    fetchData();
    return () => (isSubscribed = false);
  }, [props.auth, props.id]);
  return (
    <h2>
      <span>{firstName}</span>
      <span>{firstName ? " " : ""}</span>
      <span>{lastName.substring(0, 1)}</span>
      <span>{lastName ? "." : ""}</span>
    </h2>
  );
};

export default withAuth(ContractorName);

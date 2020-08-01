import React, { useState, useEffect } from "react";
import axios from "axios";
import { withAuth } from "@okta/okta-react";

const API = process.env.REACT_APP_API || "http://localhost:3001";

const RecipientName = (props) => {
  const [lastName, updateLastName] = useState("");
  const [firstName, updateFirstName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let token = await props.auth.getAccessToken();
      console.log("id = ", props.id);
      let url = `${API}/recipients/${props.id}/`;
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
          console.log(response);
          updateLastName(response.data.user.last_name);
          updateFirstName(response.data.user.first_name);
        });
    };
    fetchData();
  }, []);
  return (
    <div className="student-name-font">
      <span>{firstName}</span>
      <span> </span>
      <span>{lastName.substring(0, 1)}</span>
      <span>{lastName ? "." : ""}</span>
    </div>
  );
};

export default withAuth(RecipientName);

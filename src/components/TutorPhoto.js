import React, { useState, useEffect } from "react";
import withAuth from "@okta/okta-react/dist/withAuth";
import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:3001";

const TutorPhoto = (props) => {
  const [photoURL, updatePhotoURL] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let token = await props.auth.getAccessToken();
      console.log("id = ", props.id);
      let url = `${API}/public_contractors/${props.id}`;
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
          console.log("photo = ", response.data);
          updatePhotoURL(response.data.photo);
        });
    };
    fetchData();
  }, []);
  if (photoURL == null) {
    return (
      <div>
        <img className="circular" src="images/tutorSample.jpeg" />
      </div>
    );
  }

  return (
    <div>
      <img className="circular" src={photoURL} />
    </div>
  );
};

export default withAuth(TutorPhoto);

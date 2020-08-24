import React, { useState, useEffect } from "react";
import withAuth from "@okta/okta-react/dist/withAuth";
import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:8080";

const TutorPhoto = (props) => {
  const [photoURL, updatePhotoURL] = useState(null);

  useEffect(() => {
    let isSubscribed = false;
    const fetchData = async () => {
      let token = await props.auth.getAccessToken();
      if (!token) {
        window.location.reload(true);
      }
      let url = `${API}/public_contractors/${props.id}`;
      axios
        .get(url, {
          headers: {
            "content-type": "application/json",
            accept: "application/json",
            authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {})
        .then((response) => {
          if (
            isSubscribed &&
            response &&
            response.data &&
            response.data.photo
          ) {
            console.log("photo = ", response.data);
            updatePhotoURL(response.data.photo);
          }
        });
    };
    fetchData();
    return () => (isSubscribed = false);
  }, [props.auth, props.id]);
  if (photoURL == null) {
    return (
      <div>
        <img className="circular" src="images/profileIcon.png" alt="Tutor" />
      </div>
    );
  }

  return (
    <div>
      <img className="circular" src={photoURL} alt="Tutor" />
    </div>
  );
};

export default withAuth(TutorPhoto);

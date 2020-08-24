import React, { useState, useEffect } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import moment from "moment";
import axios from "axios";
import { withAuth } from "@okta/okta-react";

import TutorPhoto from "./TutorPhoto";
import RecipientName from "./RecipientName";
import ContractorName from "./ContractorName";
import RoomNumber from "./RoomNumber";

const API = process.env.REACT_APP_API || "http://localhost:8080";

const ApptCard = (props) => {
  const [apptDetail, updateApptDetail] = useState({});

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      let token = await props.auth.getAccessToken();
      if (!token) {
        window.location.reload(true);
      }
      console.log("id = ", props.appointment.id);
      let url = `${API}/appointments/${props.appointment.id}/`;
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
          if (isSubscribed && response && response.data)
            updateApptDetail(response.data);
        });
    };
    fetchData();
    return () => (isSubscribed = false);
  }, [props.appointment.id, props.auth]);

  if (!apptDetail.id) {
    return (
      <div className="card person-card appt-card">
        <div className="card-body card-text">
          <div
            className="d-flex justify-content-center"
            style={{ paddingTop: "65px" }}
          >
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="card person-card appt-card">
      <div className="card-body card-text">
        {apptDetail && apptDetail.rcras && apptDetail.rcras.length > 0 ? (
          <RecipientName id={apptDetail.rcras[0].recipient} />
        ) : (
          <div className="student-name-font">{apptDetail.topic}</div>
        )}
        <h3>
          <div className="detail-spacing">
            <span>
              <FaMapMarkerAlt />
              <RoomNumber
                className="location-time-font"
                location={apptDetail.location}
              />
            </span>
            <span>{"  "}</span>
            <span className="icon-margin">
              <FaClock />
            </span>
            <span className="location-time-font">
              {moment(props.appointment.start).format("h:mma")}
            </span>
          </div>
        </h3>
        {apptDetail && apptDetail.cjas && apptDetail.cjas.length > 0 && (
          <table>
            <tbody>
              <tr>
                <td>
                  <TutorPhoto id={apptDetail.cjas[0].contractor} />
                </td>
                <td>
                  <div>
                    <ContractorName id={apptDetail.cjas[0].contractor} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default withAuth(ApptCard);
// {
//     "id": 10,
//     "start": "2020-01-01T12:00:00Z",
//     "finish": "2020-01-01T13:00:00Z",
//     "units": "1.00000",
//     "topic": "Lesson 1",
//     "location": null,
//     "rcras": [
//       {
//         "recipient": 23,
//         "recipient_name": "Archie Hoskins", <<<<< student name
//         "paying_client": 18,
//         "paying_client_name": "Jamie Hoskins",
//         "charge_rate": "100.00"
//       }
//     ],
//     "cjas": [
//       {
//         "contractor": 43,
//         "contractor_name": "Billy Holiday", <<<<<< tutor name
//         "pay_rate": "80.00"
//       }
//     ],
//     "status": "Planned",
//     "repeater": null,
//     "service_id": 2,
//     "service_name": "Maths GCSE",
//     "charge_type": "Hourly"
//   }

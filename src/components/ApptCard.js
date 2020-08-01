import React, { useState, useEffect } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import moment from "moment";
import axios from "axios";
import { withAuth } from "@okta/okta-react";

import TutorPhoto from "./TutorPhoto";
import RecipientName from "./RecipientName";
import ContractorName from "./ContractorName";
import RoomNumber from "./RoomNumber";

const API = process.env.REACT_APP_API || "http://localhost:3001";

const ApptCard = (props) => {
  const [apptDetail, updateApptDetail] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      let token = await props.auth.getAccessToken();
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
          updateApptDetail(response.data);
        });
    };
    fetchData();
  }, []);
  if (!apptDetail.id) {
    return <div></div>;
  }
  return (
    <div className="card person-card appt-card">
      <div className="card-body card-text">
        <RecipientName id={apptDetail.rcras[0].recipient} />
        <h3>
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
        </h3>
        <table>
          <tbody>
            <tr>
              <td>
                <TutorPhoto id={apptDetail.cjas[0].contractor} />
              </td>
              <td>
                <h2>
                  <ContractorName id={apptDetail.cjas[0].contractor} />
                </h2>
              </td>
            </tr>
          </tbody>
        </table>
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

import React from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import moment from "moment";

import TutorPhoto from "./TutorPhoto";
import RoomNumber from "./RoomNumber";

const ApptCard = ({ id, location, start, studentName, tutorName, photo }) => {
  return (
    <div className="card person-card appt-card">
      <div className="card-body card-text">
        <div className="student-name-font">{studentName}</div>
        <h3>
          <div className="detail-spacing">
            <span>
              <FaMapMarkerAlt />
              <RoomNumber className="location-time-font" location={location} />
            </span>
            <span>{"  "}</span>
            <span className="icon-margin">
              <FaClock />
            </span>
            <span className="location-time-font">
              {moment(start).format("h:mma")}
            </span>
          </div>
        </h3>
        <table>
          <tbody>
            <tr>
              <td>
                <TutorPhoto photo={photo} />
              </td>
              <td>
                <div>
                  <h2>{tutorName}</h2>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApptCard;
// {
//   id: 3487460,
//   location: null,
//   start: '2020-08-25T01:00:00+02:00',
//   start24: '16',
//   startAmPm: '4pm',
//   studentName: 'Enoch Duong',
//   tutorName: 'Jason Michel',
//   photo: null
// },

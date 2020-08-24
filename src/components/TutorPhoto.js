import React from "react";

const TutorPhoto = ({ photo }) => {
  if (photo == null) {
    return (
      <div>
        <img className="circular" src="images/profileIcon.png" alt="Tutor" />
      </div>
    );
  }

  return (
    <div>
      <img className="circular" src={photo} alt="Tutor" />
    </div>
  );
};

export default TutorPhoto;

import { useEffect, useState } from "react";
import axios from "axios";
import "./Feedback.css";

const Feedback = () => {
  const [appointments, setAppointments] = useState([]);
  const [caregivers, setCaregivers] = useState({});
  const [popupWindow, setPopupWindow] = useState(false);
  const username = localStorage.getItem("loggedInUsername");

  const getAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/appointment/get/${username}`,
        {
          withCredentials: true,
        }
      );
      const completed = response.data.filter(
        (appointment) => appointment.status === "COMPLETED"
      );
      setAppointments(completed);

      // Fetch caregivers
      for (const appointment of completed) {
        await getCaregiverName(appointment.caregiverId);
      }
    } catch (error) {
      console.log("Catch error: " + error);
    }
  };

  const getCaregiverName = async (caregiverId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/find-userId/${caregiverId}`,
        {
          withCredentials: true,
        }
      );
      setCaregivers((prevCaregivers) => ({
        ...prevCaregivers,
        [caregiverId]: {
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        },
      }));
    } catch (error) {
      console.log("Catch error: " + error);
    }
  };

  const completedAppointments = () => {
    if (appointments.length === 0) {
      return <p>You have no completed appointments.</p>;
    }
    return appointments.map((appointment, index) => (
      <div key={index} className="completedAppointment">
        <hr />
        <p>
          Caregiver: {caregivers[`${appointment.caregiverId}`]?.firstName}{" "}
          {caregivers[`${appointment.caregiverId}`]?.lastName}
        </p>
        <p>Summary: {appointment.summary}</p>
        <button className="feedbackButton" type="button" onClick={handleClick}>
          Give feedback
        </button>
        <hr />
      </div>
    ));
  };

  const handleClick = () => {
    setPopupWindow(true);
  };

  const handleCancel = () => {
    setPopupWindow(false);
  };

  useEffect(() => {
    getAppointments();
  }, []);

  useEffect(() => {
    console.log(appointments);
    //console.log(caregivers);
    //console.log(caregivers["676ec624d29cdb168b12346f"]?.firstName);
  }, [appointments, caregivers]);

  return (
    <div className="feedbackPage">
      <h1>Feedback</h1>
      <div className="completedAppointments">{completedAppointments()}</div>
      {popupWindow && (
        <div className="popupFeedback">
          <div className="popupContainer">
            <h2>
              Leave feedback for
              <br /> selected appointment
            </h2>
            <textarea
              className="feedbackTextBox"
              placeholder="Give feedback..."
            ></textarea>
            <div className="popupRating">
              <p id="fRating">Rating:</p>
              <select className="feedbackButton">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            <div className="popupButtons">
              <button className="feedbackButton">Submit</button>
              <button className="feedbackButton" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;

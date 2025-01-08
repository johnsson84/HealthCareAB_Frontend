import { useEffect, useState } from "react";
import axios from "axios";
import "./Feedback.css";

const Feedback = () => {
  const [appointments, setAppointments] = useState([]);
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
      const completed = response.data.filter(appointment => appointment.status === "COMPLETED");
      setAppointments(completed);
    } catch (error) {
      console.log("Catch error: " + error);
    }
  };

  const completedAppointments = () => {
    if (appointments.length === 0) {
      return <p>You have no completed appointments.</p>;
    }
    return (
      appointments.map((appointment, index) => (
        <div key={index} className="completedAppointment">
          <hr />
          <p>{appointment.id}</p>
          <p>Caregiver: {appointment.caregiverId}</p>
          <button id="giveFeedbackButton" type="button" onClick={handleClick}>Give feedback</button>
          <hr/>
        </div>
      ))
    );
  };

  const handleClick = () => {
    setPopupWindow(true);
  }

  const handleCancel = () => {
    setPopupWindow(false);
  }

  useEffect(() => {
    getAppointments();
  }, []);

  useEffect(() => {
    console.log(appointments);
  }, [appointments]);

  return (
    <div className="feedbackPage">
      <h1>Feedback</h1>
      <div className="completedAppointments">
        {completedAppointments()}
      </div>
      {popupWindow && (
        <div className="popupFeedback">
          <div className="popupContainer">
            <p>give feedback</p>
            <button>Submit</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;

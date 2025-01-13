import { useEffect, useState } from "react";
import axios from "axios";
import "./Feedback.css";

const Feedback = () => {
  const [appointments, setAppointments] = useState([]);
  const [caregivers, setCaregivers] = useState({});
  const [popupWindow, setPopupWindow] = useState(false);
  const username = localStorage.getItem("loggedInUsername");
  const [givenFeedback, setGivenFeedback] = useState([]);
  const [feedback, setFeedback] = useState({
    appointmentId: "",
    comment: "",
    rating: 1,
  });

    // Fetch your feedback
    const getGivenFeedback = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/feedback/patient/${username}`,
          {
            withCredentials: true,
          }
        );
        setGivenFeedback(response.data);
        
      } catch (error) {
        console.log("Catch error: " + error);
      }
    };

  // Fetch completed appointments
  const getAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/appointment/get/${username}`,
        {
          withCredentials: true,
        }
      );

      // Get completed appontments
      const completed = response.data.filter(
        (appointment) => appointment.status === "COMPLETED"
      );
      
      // Filter out completed appointments that already have feedback
      const hasNoFeedback = completed.filter(
        completedAppointment => !givenFeedback.some(
          feedback => feedback.appointmentId === completedAppointment.id));

      setAppointments(hasNoFeedback);

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

  const sendFeedback = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/feedback/add`,
        feedback,
        {
          withCredentials: true,
        }
      );
      setAppointments(appointments.filter(item => item.id !== feedback.appointmentId));
      // DEBUG:
      if (response.status === 210) {
        console.log("Feedback added!");
      } else {
        console.log("Unexpected status: " + response.status);
      }
    } catch (error) {
      console.log("Catch error: " + error);
    }
  }

  const completedAppointments = () => {
    if (appointments.length === 0) {
      return <div id="noCompletedAppointments"><p>You have no completed appointments<br></br>to give feedback to.</p></div>;
    }
    return appointments.map((appointment, index) => (
      <div key={index} className="completedAppointment">
        <p>
          <b>Caregiver:</b> {caregivers[`${appointment.caregiverId}`]?.firstName}{" "}
          {caregivers[`${appointment.caregiverId}`]?.lastName}
        </p>
        <p><b>Summary:</b> {appointment.summary}</p>
        <button className="feedbackButton" name="appointmentId" value={appointment.id} type="button" onClick={handleClick}>
          Give feedback
        </button>
      </div>
    ));
  };

  const handleClick = (e) => {
    clearFields();
    handleInputChange(e);
    setPopupWindow(true);
  };

  const handleCancel = () => {
    clearFields();
    setPopupWindow(false);
  };

  const handleInputChange = (e) => {
    setFeedback((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleSubmit = () => {
    sendFeedback();
    setPopupWindow(false);
    
  };

  const clearFields = () => {
    setFeedback({
      appointmentId: "",
      comment: "",
      rating: 1
    });
  };

  useEffect(() => {
    getGivenFeedback();
  }, []);

  useEffect(() => {
    getAppointments();
  }, [givenFeedback]);

  // DEBUG:
  //useEffect(() => {
  //  console.log(appointments);
  //  console.log(givenFeedback);
    //console.log(feedback);
    //console.log(caregivers);
    //console.log(caregivers["676ec624d29cdb168b12346f"]?.firstName);
  //}, [appointments, caregivers, feedback]);

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
              name="comment"
              value={feedback.comment}
              onChange={handleInputChange}
              maxLength="200"
            ></textarea>
            <p id="pNoMargin">{feedback.comment.length}/200</p>
            <div className="popupRating">
              <p id="pNoMargin">Rating:</p>
              <select 
                className="feedbackButton"
                name="rating"
                value={feedback.rating}
                onChange={handleInputChange}
                >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            <div className="popupButtons">
              <button className="feedbackButton" onClick={handleSubmit}>Submit</button>
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

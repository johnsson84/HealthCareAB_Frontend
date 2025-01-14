import { useEffect, useState } from "react";
import axios from "axios";
import "./Feedback.css";

const Feedback = () => {
  // Genereal variables
  const username = localStorage.getItem("loggedInUsername");
  // Patient page variables
  const [appointments, setAppointments] = useState([]);
  const [caregivers, setCaregivers] = useState({});
  const [popupWindow, setPopupWindow] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [givenFeedback, setGivenFeedback] = useState([]);
  const [feedback, setFeedback] = useState({
    appointmentId: "",
    comment: "",
    rating: 1,
  });
  // Doctor page variables
  const [yourFeedback, setYourFeedback] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [appointmentSummarys, setAppointmentSummarys] = useState({});
  const [patients, setPatients] = useState({});
  const [yourAverageRating, setYourAverageRating] = useState(0);
  // Admin page variables

  //////////// GENERAL METHODS //////////////////
  // Get loggedInUser role
  const getUsersRole = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/find/${username}`,
        {
          withCredentials: true,
        }
      );
      setUserRole(response.data.roles[0]);
    } catch (error) {
      console.log("Catch error: " + error);
    }
  };

  //////////// PATIENT METHODS //////////////////
  // Fetch your feedback
  const getGivenFeedback = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/feedback/user/${username}`,
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
        (completedAppointment) =>
          !givenFeedback.some(
            (feedback) => feedback.appointmentId === completedAppointment.id
          )
      );

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
      setAppointments(
        appointments.filter((item) => item.id !== feedback.appointmentId)
      );
      // DEBUG:
      if (response.status === 210) {
        console.log("Feedback added!");
      } else {
        console.log("Unexpected status: " + response.status);
      }
    } catch (error) {
      console.log("Catch error: " + error);
    }
  };

  // Feedback page for an patient
  const patientSection = () => {
    return (
      <div>
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
                <button className="feedbackButton" onClick={handleSubmit}>
                  Submit
                </button>
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

  const completedAppointments = () => {
    if (appointments.length === 0) {
      return (
        <div id="noCompletedAppointments">
          <p>
            You have no completed appointments<br></br>to give feedback to.
          </p>
        </div>
      );
    }
    return appointments.map((appointment, index) => (
      <div key={index} className="completedAppointment">
        <p>
          <b>Caregiver:</b>{" "}
          {caregivers[`${appointment.caregiverId}`]?.firstName}{" "}
          {caregivers[`${appointment.caregiverId}`]?.lastName}
        </p>
        <p>
          <b>Summary:</b> {appointment.summary}
        </p>
        <button
          className="feedbackButton"
          name="appointmentId"
          value={appointment.id}
          type="button"
          onClick={handleClick}
        >
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
    setFeedback((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    sendFeedback();
    setPopupWindow(false);
  };

  const clearFields = () => {
    setFeedback({
      appointmentId: "",
      comment: "",
      rating: 1,
    });
  };

  //////////// DOCTOR METHODS //////////////////
  // Fetch your feedback
  const getFeedback = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/feedback/user/${username}`,
        {
          withCredentials: true,
        }
      );
      setYourFeedback(response.data);

      for (const feedback of response.data) {
        await getAppointmentSummary(feedback.appointmentId);
      }

      for (const feedback of response.data) {
        await getPatientName(feedback.patientUsername);
      }
    } catch (error) {
      console.log("Catch error: " + error);
    }
  };

  // Get summarys from found feedbacks
  const getAppointmentSummary = async (appointmentId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/appointment/info/${appointmentId}`,
        {
          withCredentials: true,
        }
      );
      setAppointmentSummarys((prevAppointmentSummarys) => ({
        ...prevAppointmentSummarys,
        [appointmentId]: {
          summary: response.data.summary,
        },
      }));
    } catch (error) {
      console.log("Catch error: " + error);
    }
  };

  // Get patient full name from found feedbacks
  const getPatientName = async (patientUsername) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/find/${patientUsername}`,
        {
          withCredentials: true,
        }
      );
      setPatients((prevPatients) => ({
        ...prevPatients,
        [patientUsername]: {
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        },
      }));
    } catch (error) {
      console.log("Catch error: " + error);
    }
  };

  const deleteAnFeedback = async (feedbackId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/feedback/delete/${feedbackId}`,
        {
          withCredentials: true,
        }
      );
      setYourFeedback(yourFeedback.filter((item) => item.id !== feedbackId));
    } catch (error) {
      console.log("Catch error: " + error);
    }
  };

  const countAverageRating = () => {
    let total = 0;
    for (const x of yourFeedback) {
      if (typeof x.rating === "number" || !IsNaN(x.rating)) {
        total += x.rating;
      }
    }
    const avg = total / yourFeedback.length + 1;
    setYourAverageRating((Math.round(avg * 100) / 100).toFixed(2));
  };

  const doctorSection = () => {
    return (
      <div>
        <h1>Your Feedback</h1>
        <h2>(average rating: {yourAverageRating})</h2>
        <div className="yourFeedbacks">{showYourFeedback()}</div>
      </div>
    );
  };

  // Container with all your feedbacks
  const showYourFeedback = () => {
    if (yourFeedback.length === 0) {
      return (
        <div id="noCompletedAppointments">
          <p>You have no feedback.</p>
        </div>
      );
    }
    return yourFeedback.map((feedback, index) => (
      <div key={index} className="yourFeedback">
        <p>
          <b>Summary:</b>{" "}
          {appointmentSummarys[`${feedback.appointmentId}`]?.summary}
        </p>
        <p>
          <b>Patient:</b> {patients[`${feedback.patientUsername}`]?.firstName}{" "}
          {patients[`${feedback.patientUsername}`]?.lastName}
        </p>
        <p>
          <b>Comment:</b> {feedback.comment}
        </p>
        <p>
          <b>Rating:</b> {feedback.rating}
        </p>
        {deleteConfirm !== feedback.id && (
          <button
            className="feedbackButton"
            value={feedback.id}
            type="button"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
        {deleteConfirm === feedback.id && (
          <div className="confirmBox">
            <p>Confirm:</p>
            <button
              className="feedbackButton confirm-btn confirm-btn-yes"
              value={feedback.id}
              onClick={handleDeleteYes}
            >
              Yes
            </button>
            <button
              className="feedbackButton confirm-btn"
              onClick={handleDeleteNo}
            >
              No
            </button>
          </div>
        )}
      </div>
    ));
  };

  const handleDelete = (e) => {
    setDeleteConfirm(e.target.value);
  };
  const handleDeleteYes = (e) => {
    deleteAnFeedback(e.target.value);
    setDeleteConfirm("");
  };
  const handleDeleteNo = () => {
    setDeleteConfirm("");
  };

  //////////// ADMIN METHODS //////////////////

  ///  PATIENT USE_EFFECT
  useEffect(() => {
    getUsersRole();
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
    //console.log(userRole);
  //}, [appointments, caregivers, feedback, userRole]);

  ///  DOCTOR USE_EFFECT
  useEffect(() => {
    getFeedback();
    countAverageRating();
  }, []);

  useEffect(() => {
    countAverageRating();
  }, [feedback]);

  // DEBUG:
  //useEffect(() => {
  //console.log(feedback);
  //console.log(appointmentSummarys);
  //console.log(patients);
  //}, [feedback, appointmentSummarys]);
  ///  ADMIN USE_EFFECT

  // FEEDBACK PAGE
  return (
    <div className="feedbackPage">
      {userRole === "USER" && patientSection()}
      {userRole === "DOCTOR" && doctorSection()}
    </div>
  );
};

export default Feedback;

import { useEffect, useState } from "react";
import axios from "axios";
import "./Feedback.css";
import { ToastContainer, toast } from "react-toastify";

///////////////////////////////
//  INDEX                    //
//  1. Page variables        //
//  2. GENERAL METHODS       //
//  3. PATIENT METHODS       //
//  4. DOCTOR METHODS        //
//  5. ADMIN METHODS         //
//  6. GENERAL USE_EFFECT    //
//  7. PATIENT USE_EFFECT    //
//  8. DOCTOR USE_EFFECT     //
//  9. ADMIN USE_EFFECT      //
// 10. FEEDBACK PAGE         //
///////////////////////////////

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
  const [appointmentReasons, setAppointmentReasons] = useState({});
  const [patients, setPatients] = useState({});
  const [yourAverageRating, setYourAverageRating] = useState(0);
  // Admin page variables
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  ///////////////////////////////////////////////
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

  ///////////////////////////////////////////////
  //////////// PATIENT METHODS //////////////////
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

      let hasNoFeedback = completed;
      // Filter out completed appointments that already have feedback
      if (givenFeedback.length > 0) {
        hasNoFeedback = completed.filter(
          (completedAppointment) =>
            !givenFeedback.some(
              (feedback) => feedback.appointmentId === completedAppointment.id
            )
        );
      }
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
      if (response.status === 210 || response.status === 200) {
        console.log("Feedback added!");
        toast.success("Feedback added!")
      } else {
        console.log("Unexpected status: " + response.status);
      }
    } catch (error) {
      console.log("Catch error: " + error);
      toast.error("Something wnt wrong, try later...")
    }
  };

  // Feedback page for an patient
  const patientSection = () => {
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
          <b>Reason:</b> {appointment.reason}
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

  //////////////////////////////////////////////
  //////////// DOCTOR METHODS //////////////////
  // Fetch your feedback
  const getYourFeedback = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/feedback/doctor/${username}`,
        {
          withCredentials: true,
        }
      );
      setYourFeedback(response.data);

      for (const feedback of response.data) {
        await getAppointmentReason(feedback.appointmentId);
      }

      for (const feedback of response.data) {
        await getPatientName(feedback.patientUsername);
      }
    } catch (error) {
      console.log("Catch error: " + error);
    }
  };

  // Get reasons from found feedbacks
  const getAppointmentReason = async (appointmentId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/appointment/info/${appointmentId}`,
        {
          withCredentials: true,
        }
      );
      setAppointmentReasons((prevAppointmentReasons) => ({
        ...prevAppointmentReasons,
        [appointmentId]: {
          reason: response.data.reason,
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

  const countAverageRating = () => {
    let total = 0;
    for (const x of yourFeedback) {
      if (typeof x.rating === "number" || !IsNaN(x.rating)) {
        total += x.rating;
      }
    }
    const avg = total / yourFeedback.length;
    setYourAverageRating((Math.round(avg * 100) / 100).toFixed(2));
  };

  const doctorSection = () => {
    return (
      <div className="feedbackPage">
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
          <b>Reason:</b>{" "}
          {appointmentReasons[`${feedback.appointmentId}`]?.reason}
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

  /////////////////////////////////////////////
  //////////// ADMIN METHODS //////////////////
  const getAllFeedback = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/feedback/all`,
        {
          withCredentials: true,
        }
      );
      setAllFeedbacks(response.data);
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
      setAllFeedbacks(yourFeedback.filter((item) => item.id !== feedbackId));
      toast.success("Feedback deleted!")
    } catch (error) {
      console.log("Catch error: " + error);
      toast.error("Something went wrong, try later...")
    }
  };

  const showAllFeedbaks = () => {
    if (allFeedbacks.length === 0) {
      return (
        <div id="noCompletedAppointments">
          <p>There is no feedback.</p>
        </div>
      );
    }
    return allFeedbacks.map((feedback, index) => (
      <div key={index} className="allFeedback">
        <p>
          <b>Appointment ID:</b> {feedback.appointmentId}
        </p>
        <p>
          <b>Doctor:</b> {feedback.caregiverUsername}
        </p>
        <p>
          <b>Patient:</b> {feedback.patientUsername}
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

  const adminSection = () => {
    return (
      <div className="feedbackPage">
        <h1>All feedbacks</h1>
        <div className="allFeedbacks">{showAllFeedbaks()}</div>
      </div>
    );
  };

  ///////////////////////
  ///  GENERAL USE_EFFECT
  useEffect(() => {
    getUsersRole();
  }, []);

  ///////////////////////
  ///  PATIENT USE_EFFECT
  useEffect(() => {
    if (userRole === "USER") {
      getGivenFeedback();
      getAppointments();
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole === "USER") {
      getAppointments();
    }
  }, [givenFeedback]);

  //////////////////////
  ///  DOCTOR USE_EFFECT
  useEffect(() => {
    if (userRole === "DOCTOR") {
      getYourFeedback();
      countAverageRating();
    }
  }, [userRole]); 

  useEffect(() => {
    if (userRole === "DOCTOR") {
      countAverageRating();
    }
  }, [yourFeedback]);

  /////////////////////
  ///  ADMIN USE_EFFECT
  useEffect(() => {
    if (userRole === "ADMIN") {
      getAllFeedback();
    }
  }, [userRole, yourFeedback]);

  ////////////////
  // FEEDBACK PAGE
  return (
    <div>
      <ToastContainer className="ToastContainer" />
      {userRole === "USER" && patientSection()}
      {userRole === "DOCTOR" && doctorSection()}
      {userRole === "ADMIN" && adminSection()}
    </div>
  );
};

export default Feedback;

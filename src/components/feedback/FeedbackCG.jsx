import { useState, useEffect } from 'react';
import './Feedback.css';
import axios from 'axios';

const FeedbackCG = () => {
    const username = localStorage.getItem("loggedInUsername");
    const [feedback, setFeedback] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [appointmentSummarys, setAppointmentSummarys] = useState({});
    const [patients, setPatients] = useState({});
    const [yourAverageRating, setYourAverageRating] = useState(0);

    // Fetch your feedback
  const getFeedback = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/feedback/caregiver/${username}`,
        {
          withCredentials: true,
        }
      );
      setFeedback(response.data);

      for (const feedback of response.data) {
        await getAppointmentSummary(feedback.appointmentId)
      };

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
      };
  }

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
        setFeedback(feedback.filter(item => item.id !== feedbackId));
    } catch (error) {
        console.log("Catch error: " + error);
      };
  };

  const countAverageRating = () => {
    let total = 0;
    for (const x of feedback) {
        if (typeof x.rating === 'number' || !IsNaN(x.rating)) {
            total += x.rating;
        }
    }
    const avg = total / feedback.length;
    setYourAverageRating((Math.round(avg * 100) / 100).toFixed(2));
  }

    // Container with all your feedbacks
    const yourFeedback = () => {
        if (feedback.length === 0) {
          return <div id="noCompletedAppointments"><p>You have no feedback.</p></div>;
        }
        return feedback.map((feedback, index) => (
          <div key={index} className="yourFeedback">
            <p><b>Summary:</b> {appointmentSummarys[`${feedback.appointmentId}`]?.summary}</p>
            <p>
              <b>Patient:</b> {patients[`${feedback.patientUsername}`]?.firstName}{" "}
              {patients[`${feedback.patientUsername}`]?.lastName}
            </p>
            <p><b>Comment:</b> {feedback.comment}</p>
            <p><b>Rating:</b> {feedback.rating}</p>
            {deleteConfirm !== feedback.id && <button className="feedbackButton" value={feedback.id} type="button" onClick={handleDelete}>
              Delete
            </button>}
            {deleteConfirm === feedback.id && (<div className='confirmBox'>
                <p>Confirm:</p>
                <button className="feedbackButton confirm-btn confirm-btn-yes" value={feedback.id} onClick={handleDeleteYes}>Yes</button>
                <button className="feedbackButton confirm-btn" onClick={handleDeleteNo}>No</button>
            </div>)}
          </div>
        ));
      };

    const handleDelete = (e) => {
        setDeleteConfirm(e.target.value);
    }
    const handleDeleteYes = (e) => {
        deleteAnFeedback(e.target.value)
        setDeleteConfirm("");
    }
    const handleDeleteNo = () => {
        setDeleteConfirm("");
    }

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

    return (
        <div className="feedbackPage">
            <h1>Your Feedback</h1>
            <h2>(average rating: {yourAverageRating})</h2>
            <div className="yourFeedbacks">{yourFeedback()}</div>
        </div>
    )
}

export default FeedbackCG;
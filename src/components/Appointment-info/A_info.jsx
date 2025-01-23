import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./A_info.css";

const Appointment_info = () => {
  const { appointmentId } = useParams();
  const [meetingInfo, setMeetingInfo] = useState({});
  const [time, setTime] = useState("Loading time...");
  const [date, setDate] = useState("Loading date...");
  const [isWithin24Hours, setIsWithin24Hours] = useState(false);
  const [dropdownActive, setDropDownActive] = useState(false);
  const [editOrCancel, setEditOrCancel] = useState(true); // true == edit
  const [selectedStatus, setSelectedStatus] = useState();
  const [statusMessage, setStatusMessage] = useState(
    "Please choose new status for appointment:"
  );
  const [mailText, setMailText] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const [sendMail, setSendMail] = useState(false);
  const [mailConfirmation, setMailConfirmation] = useState("");
  const navigate = useNavigate();

  const [role, setRole] = useState(null);

  const fetchRole = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/check`,
        { withCredentials: true }
      );
      setRole(response.data.roles ? response.data.roles[0] : undefined);
    } catch (error) {
      return setRole(undefined);
    }
  };
  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    const fetchAppointmentInfo = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/appointment/info/no-id/${appointmentId}`,
          {
            withCredentials: true,
          }
        );

        setMeetingInfo(response.data.body);

        const { time, date } = setDateTime(response.data.body.dateTime);
        setTime(time);
        setDate(date);

        const appointmentDateTime = new Date(response.data.body.dateTime);
        const currentTime = new Date();
        const timeDifference = appointmentDateTime - currentTime;

        if (timeDifference <= 24 * 60 * 60 * 1000) {
          setIsWithin24Hours(true);
        } else {
          setIsWithin24Hours(false);
        }
      } catch (error) {
        console.error("Failed to fetch appointment info:", error);
      }
    };

    fetchAppointmentInfo();
  }, [appointmentId]);

  const setDateTime = (timeDate) => {
    const date = new Date(timeDate);

    const time = date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const day = date.getDate();
    const month = date.toLocaleString("sv-SE", { month: "long" });
    const year = date.getFullYear();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "a"
        : day % 10 === 2 && day !== 12
        ? "a"
        : "e";

    return {
      time: `${time}`,
      date: `${day}${suffix} ${month} ${year}`,
    };
  };

  const handleCancel = () => {
    if (!dropdownActive) {
      setEditOrCancel(false);
      setDropDownActive(true);
    } else if (dropdownActive && !editOrCancel) {
      setDropDownActive(false);
      setSendMail(false);
    } else if (dropdownActive && editOrCancel) {
      setEditOrCancel(false);
      setSendMail(false);
    }
  };

  const handleEdit = () => {
    if (!dropdownActive) {
      setEditOrCancel(true);
      setDropDownActive(true);
    } else if (dropdownActive && editOrCancel) {
      setDropDownActive(false);
      setSendMail(false);
    } else if (dropdownActive && !editOrCancel) {
      setEditOrCancel(true);
      setSendMail(false);
    }
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  const updateAppointmentStatus = async (status) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/appointment/change-status/${status}/${appointmentId}`,
        {},
        {
          withCredentials: true,
        }
      );
      setStatusMessage(response.data);
      window.location.reload();
    } catch (error) {
      setStatusMessage(
        "There was an error updating status on this appointment, Please Try again later.."
      );
    }
  };

  const handleNavigate = () => {
    navigate(`/${role}/dashboard`);
    window.location.reload();
  };

  const handleMailText = (event) => {
    setMailText(event.target.value);
  };
  const handleMailSubject = (event) => {
    setMailSubject(event.target.value);
  };

  const handleSendMailBool = () => {
    setSendMail((prevState) => !prevState);
  };
  const handleMailSender = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mail`,
        {
          toEmail: meetingInfo.userEmail,
          subject: mailSubject,
          text: mailText,
          date: date,
          time: time,
          firstName: meetingInfo.patientFirstName,
        },
        {
          withCredentials: true,
        }
      );
      setMailConfirmation("Mail was sent successfully");
      handleSendMailBool();
      setMailSubject("");
      setMailText("");
    } catch (error) {
      setMailConfirmation("Something went wrong, try again later..");
      handleSendMailBool();
      setMailSubject("");
      setMailText("");
    }
  };
  const handleMailSenderRequest = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mail/request`,
        {
          toEmail: meetingInfo.userEmail,
          appointmentReason: meetingInfo.reason,
          date: date,
          time: time,
          firstName: meetingInfo.patientFirstName,
        },
        {
          withCredentials: true,
        }
      );
      setMailConfirmation("Mail was sent successfully");
      handleSendMailBool();
    } catch (error) {
      setMailConfirmation("Something went wrong, try again later..");
      handleSendMailBool();
    }
  };

  const handleCancelAppointment = () => {
    updateAppointmentStatus("CANCELLED");
  };

  return (
    <div className="appointmentContainer">
      <h2>
        Appointment for <br />
        {meetingInfo.patientFirstName} {meetingInfo.patientLastName}
      </h2>
      <div>
        <p>
          <strong>With:</strong> Dr. Pedro
        </p>
        <p>
          <strong>Discussion about:</strong> <br /> {meetingInfo.reason}
        </p>
        <p className="appointmentTime">
          <strong>Time: </strong>
          {time}
        </p>
        <p>
          <strong>Date: </strong>
          {date}
        </p>
        <p>
          <strong>Status: </strong>
          {meetingInfo.status}
        </p>
      </div>

      {!role ? undefined : role === "DOCTOR" ? (
        <>
          <div className="appointmentButtonContainer">
            <button className="appointmentButton" onClick={handleEdit}>
              Edit
            </button>
            <button className="appointmentButton" onClick={handleCancel}>
              Cancel
            </button>
          </div>

          {!dropdownActive ? null : editOrCancel ? (
            <div className="editAppointmentContainer">
              <p>Edit Appointment</p>
              <p>{statusMessage}</p>
              
                <div className="appointmentListContainer">
                  <ul className="appointmentList">
                    
                    <li
                      style={{
                        backgroundColor:
                          selectedStatus === "SCHEDULED" ? "#057d7a" : "white",
                        color:
                          selectedStatus === "SCHEDULED" ? "white" : "black",
                      }}
                      className="appointmentItem"
                      onClick={() => handleStatusClick("SCHEDULED")}
                    >
                      SCHEDULED
                    </li>
                  </ul>
                  <button
                    className="appointmentUpdateStatus"
                    onClick={() => updateAppointmentStatus(selectedStatus)}
                  >
                    Update Status
                  </button>
                </div>
              
            </div>
          ) : (
            <div className="cancelAppointmentContainer">
              
                <>
                  <p>Do you want to cancel this appointment?</p>
                  <button
                    className="appointmentButtonCancel"
                    onClick={handleCancelAppointment}
                  >
                    yes
                  </button>
                </>
              
            </div>
          )}
        </>
      ) : (
        <>
          <div className="appointmentButtonContainer">
            {role === "DOCTOR" && (

              <button className="appointmentButton" onClick={handleEdit}>
              Edit
            </button>

            )}
            <button className="appointmentButton" onClick={handleCancel}>
              Cancel
            </button>
          </div>

          {!dropdownActive ? null : editOrCancel ? (
            <div className="editAppointmentContainer">
              {/**USER*/}
              <p>Edit Appointment</p>
              <p>
                At the moment the only way to edit an appointment is through
                sending a request with mail.
              </p>
              {isWithin24Hours ? (
                <>
                  <p className="editRestrictionMessage">
                    You can't edit appointment within 24h from its due date and
                    time
                  </p>
                  {sendMail ? (
                    <>
                      <button
                        className="sendEmailButtonAppointment"
                        onClick={handleMailSenderRequest}
                      >
                        Click here to request mail
                      </button>
                    </>
                  ) : (
                    <>
                      {mailConfirmation}
                      <button
                        className="sendEmailButtonAppointment"
                        onClick={handleSendMailBool}
                      >
                        Send Email?
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="appointmentListContainer">
                  {sendMail ? (
                    <>
                      <button
                        className="sendEmailButtonAppointment"
                        onClick={handleMailSenderRequest}
                      >
                        Click here to request mail
                      </button>
                    </>
                  ) : (
                    <>
                      {mailConfirmation}
                      <button
                        className="sendEmailButtonAppointment"
                        onClick={handleSendMailBool}
                      >
                        Send Email?
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="cancelAppointmentContainer">
              {isWithin24Hours ? (
                <>
                  <p>Do you want to cancel this appointment?</p>
                  <p className="editRestrictionMessage">
                    You can't cancel appointment within 24h from its due date
                    and time
                  </p>
                  {sendMail ? (
                    <>
                      <button
                        className="sendEmailButtonAppointment"
                        onClick={handleMailSenderRequest}
                      >
                        Click here to request mail
                      </button>
                    </>
                  ) : (
                    <>
                      {mailConfirmation}
                      <button
                        className="sendEmailButtonAppointment"
                        onClick={handleSendMailBool}
                      >
                        Send Email?
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p>Do you want to cancel this appointment?</p>
                  <button
                    className="appointmentButtonCancel"
                    onClick={handleCancelAppointment}
                  >
                    yes
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Appointment_info;
import "./AppointmentHistory.css";
import { useState, useEffect } from "react";
import axios from "axios";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState();
  const username = localStorage.getItem("loggedInUsername");

  const itemsPerPage = 10;

  const [role, setRole] = useState(null);

  const fetchRole = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/check`,
        { withCredentials: true }
      );
      setRole(response.data.roles ? response.data.roles[0] : undefined);
    } catch (error) {}
  };

  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    if (role !== null) {
      setOptionAlternative();
    }
  }, [role]);

  useEffect(() => {
    if (option) {
      fetchAppointments();
    }
  }, [option]);

  const setOptionAlternative = () => {
    if (option !== "1" && option !== "2") {
      if (role === "USER") {
        setOption("1");
      } else if (role === "ADMIN") {
        setOption("2");
      }
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/appointment/history/${option}/${username}`,
        {
          withCredentials: true,
        }
      );

      // Get usernames and format date/time
      const appointmentsWithUsernames = await Promise.all(
        response.data.map(async (appointment) => {
          const patientFullName = await fetchFullName(appointment.patientId);
          const caregiverFullName = await fetchFullName(
            appointment.caregiverId
          );

          // Format date and time
          const dateObject = new Date(appointment.dateTime);
          const formattedDate = dateObject.toISOString().split("T")[0].slice(2);
          const formattedTime = dateObject
            .toTimeString()
            .split(":")
            .slice(0, 2)
            .join(":");

          return {
            ...appointment,
            patientFullName,
            caregiverFullName,
            formattedDate,
            formattedTime,
          };
        })
      );

      console.log(appointmentsWithUsernames);
      setAppointments(appointmentsWithUsernames);
    } catch (error) {
      console.log("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullName = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/full-name/${userId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching names:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="mainContainerAppsHistory">
      <h1>Appointment History</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul className="appsHistoryContainer">
            {currentAppointments.map((appointment, index) => (
              <li className="appsHistoryBox" key={appointment.id || index}>
                <p className="completedHistory">{appointment.status}</p>
                <div className="appsHistoryInnerBox">
                  <p>
                    <strong>Patient</strong> {appointment.patientFullName}
                  </p>
                  <p>
                    <strong>Doctor</strong> {appointment.caregiverFullName}
                  </p>
                </div>
                <p className="reasonAppHist">
                  <strong>Reason:</strong>
                  {appointment.reason}
                </p>
                <p>
                  <strong>Date and Time:</strong>
                  {appointment.formattedDate} {"-"} {appointment.formattedTime}
                </p>
              </li>
            ))}
          </ul>
          <div>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                className="appHistPagiButton"
                key={index}
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default AppointmentHistory;

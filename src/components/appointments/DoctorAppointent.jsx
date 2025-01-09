import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAppointment.css";

const AppointmentIncomingList = () => {
  const [appointments, setAppointments] = useState([]);
  const username = localStorage.getItem("loggedInUsername");
  const navigate = useNavigate();
  // Fetch appointments
  useEffect(() => {
    const fetchAppointmentsWithUsernames = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/appointment/all/${username}`,
          { withCredentials: true }
        );
        // use this to get patientUsername and caregiverUsername
        const appointmentsWithUsernames = await Promise.all(
          response.data.map(async (appointment) => {
            const patientUsername = await fetchUsername(appointment.patientId);
            const caregiverUsername = await fetchUsername(
              appointment.caregiverId
            );

            return {
              ...appointment,
              patientUsername,
              caregiverUsername,
            };
          })
        );
        // This sorts the list by time
        const sortedAppointments = appointmentsWithUsernames.sort((a, b) => {
          const dateA = new Date(a.dateTime);
          const dateB = new Date(b.dateTime);
          return dateA - dateB;
        });
        setAppointments(sortedAppointments);

        setAppointments(appointmentsWithUsernames);
        console.log(response);
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };

    if (username) {
      fetchAppointmentsWithUsernames();
    }
  }, [username]);

  // Fetch username
  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/get/${userId}`,
        { withCredentials: true }
      );
      return response.data.username;
    } catch (err) {
      return err;
    }
  };
  //Navigate to appointment info page
  const handleNav = (appointmentId) => {
    console.log(appointmentId); // Print appointmentId

    //navigate(`/appointment/info/${appointmentId}`);
  };

  return (
    <div>
      <h2>Upcoming Meetings</h2>
      {appointments.length > 0 ? (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id} onClick={() => handleNav(appointment.id)}>
              <div className="appointment-content">
                <div>
                  <strong>Date and time:</strong>{" "}
                  {new Date(appointment.dateTime).toLocaleString()}
                  <br />
                  <strong>Patient:</strong> {appointment.patientUsername}
                  <br />
                  <strong>Doctor:</strong> {appointment.caregiverUsername}
                </div>
                <div className="more-info">MorInfo</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming meetings found.</p>
      )}
    </div>
  );
};

export default AppointmentIncomingList;

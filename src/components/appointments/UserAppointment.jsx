import axios from "axios";
import React, { useEffect, useState } from "react";

const AppointmentIncomingList = () => {
  const [appointments, setAppointments] = useState([]);
  const username = localStorage.getItem("loggedInUsername");

// det vi vill göra är att hämta alla appointments men samtidigt hämta usernames från respone.data.patientId som kommmer med appointments. Dessa behöver sparas i en ny lista och mappas ut längst ned

  // fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/appointment/get/${username}`,
          {
            withCredentials: true,
          }
        );
        setAppointments(response.data);
        // sätt caregiver och patient username with fetchUsername
        console.log(response);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    if (username) {
      fetchAppointments();
    }
  }, [username]);

// fetch username
  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/find/${userId}`,
        { withCredentials: true }
      );
      return response;
    } catch (err) {
      console.error("Error fetching username:", err.response?.data || err.message);
      throw err; 
    }
  };

  const handleNav = (e) =>{
    console.log(e) // print appointId
    // navigate("/appointment/info/{appointmentId}")
  }
  return (
    <div>
      <h2>Kommande Möten</h2>
      {appointments.length > 0 ? (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id} onClick={handleNav()}>
              <strong>Datum och tid:</strong>{" "}
              {new Date(appointment.dateTime).toLocaleString()}
              <br />
              <strong>Patient:</strong> {appointment.patientId}
              <br />
              <strong>Läkare:</strong> {appointment.caregiverId}
              <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga kommande möten hittades.</p>
      )}
    </div>
  );
};

export default AppointmentIncomingList;

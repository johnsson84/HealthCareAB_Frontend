import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAppointment.css";

const AppointmentIncomingList = () => {
  const [appointments, setAppointments] = useState([]);
  const[loading, setLoading]= useState(false);
  const username = localStorage.getItem("loggedInUsername");
  const navigate = useNavigate();

  // Fetch appointments
  useEffect(() => {
    const fetchAppointmentsWithUsernames = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/appointment/get/scheduled/caregiver/${username}`,
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

        // Sort by date and take the first 10
        const sortedAppointments = appointmentsWithUsernames
          .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
          .slice(0, 9);

        setAppointments(sortedAppointments); // first 10 appointments
      } catch (err) {
        console.error("Error fetching appointments", err);
      }finally{
        setLoading(false)
      }
    };

    if (username) {
      fetchAppointmentsWithUsernames();
    }
  }, [username]);

  // Fetch username
  const fetchUsername = async (userId) => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/get/${userId}`,
        { withCredentials: true }
      );
      return response.data.username;
    } catch (err) {
      console.error("Error fetching username:", err);
      return "Unknown";
    }finally{
      setLoading(false)
    }
  };

  // Navigate to appointment info page
  const handleNav = (appointmentId) => {
    console.log(appointmentId); // Print appointmentId
    navigate(`/appointment/info/${appointmentId}`);
  };

  return (
    <div>
     {loading?(<p>Loading...</p>):(
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
                 <div className="more-info">Info</div>
               </div>
             </li>
           ))}
         </ul>
     )}
    </div>
  );
};

export default AppointmentIncomingList;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAppointment.css";

const AppointmentIncomingList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setloading] = useState(false);
  const username = localStorage.getItem("loggedInUsername");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentPerPage = 8;
  // Fetch appointments
  useEffect(() => {
    const fetchAppointmentsWithUsernames = async () => {
      setloading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/appointment/get/scheduled/caregiver/${username}`,
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
      } finally {
        setloading(false);
      }
    };

    if (username) {
      fetchAppointmentsWithUsernames();
    }
  }, [username]);

  // Fetch username
  const fetchUsername = async (userId) => {
    setloading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/get/${userId}`,
        { withCredentials: true }
      );
      return response.data.username;
    } catch (err) {
      return err;
    } finally {
      setloading(false);
    }
  };
  //Navigate to appointment info page
  const handleNav = (appointmentId) => {
    console.log(appointmentId); // Print appointmentId
    navigate(`/appointment/info/${appointmentId}`);
  };




  // This pagination uses to show only 8 list in one page & with button next
  const totalPage = Math.ceil(appointments.length / appointmentPerPage);

  const indexOfLastUser = currentPage * appointmentPerPage;
  const indexOfFirstUser = indexOfLastUser - appointmentPerPage;
  const getappointment = appointments.slice(indexOfFirstUser, indexOfLastUser);

  const handlePage = (pageNumber) =>{
    setCurrentPage(pageNumber)
  }
    


  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {getappointment.map((appointment) => (
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
          <div>
            {Array.from({length: totalPage}, (_, index)=> index +1).map((pageNumber)=>(
              <button
              key={pageNumber} onClick={()=> handlePage(pageNumber)}
              style={{
                margin: '5px',
                backgroundColor: currentPage === pageNumber ? '#007bff' : '#f0f0f0',
                color: currentPage === pageNumber ? 'white' : 'black',
                border: '1px solid #ddd',
                padding: '5px 10px',
              }}>
                {pageNumber}
              </button>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
};

export default AppointmentIncomingList;

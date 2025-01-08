import axios from "axios";
import React, { useEffect, useState } from "react";

const AppointmentIncomingList = () => {
    const [appointments, setAppointments] = useState([]);
    const username =  localStorage.getItem("loggedInUsername")

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
            } catch (err) {
                console.error("Error fetching appointments:", err);
            }
        };

        if (username) {
            fetchAppointments(); 
        }
    }, [username]); 

    return (
        <div>
            <h2>Kommande Möten</h2>
            {appointments.length > 0 ? (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment.id}>
                            <strong>Datum och tid:</strong>{" "}
                            {new Date(appointment.dateTime).toLocaleString()}
                            <br />
                            <strong>Patient:</strong> {appointment.patientName}
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
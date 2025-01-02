import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";

const CalendarPage = () => {
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const [newAppointment, setNewAppointment] = useState({
    username: null,
    availabilityId: null,
    caregiverId: null,
    availabilityDate: null,
  });
  
  const handleChoice = (username, availabilityId, caregiverId, availabilityDate) => {
    setNewAppointment({
      username,
      availabilityId,
      caregiverId,
      availabilityDate,
    });
  };

  const handleBookAppointment = async (newAppointment) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/appointment/new`,
        {
          ...newAppointment,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Something went wrong, try again later.", error);
    }
  };
  
    const {
      authState: { user },
    } = useAuth();
    const [users, setUsers] = useState([]);

  useEffect(() => {
    const getAvailability = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/availability`,
          {
            withCredentials: true,
          });
        setAvailability(response.data);
      } catch (error) {
        console.error("Something went wrong, try again later.", error);
      }
    };
    getAvailability();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Get the local date without time zone offset
    const localDate = new Date(date);
    const formattedDate = localDate.toLocaleDateString('en-CA'); // Format to YYYY-MM-DD

    const filtered = availability
      .map((entry) => {
        const slotsForDate = entry.availableSlots.filter((slot) =>
          slot.startsWith(formattedDate) // Match by local date
        );
        return slotsForDate.length > 0
          ? { id: entry.id, caregiver: entry.caregiverId, slots: slotsForDate }
          : null;
      })
      .filter(Boolean); 
    setFilteredData(filtered);
};


  return (
    <div>
        <StyledMain>
      <h1>Caregiver Availability</h1>
      <Calendar onChange={handleDateChange} />
      {selectedDate && (
        <div>
          <h2>Available Slots on {selectedDate.toDateString()}:</h2>
          <h3>Chosen timeslot: {newAppointment.availabilityDate}
          </h3>
          <StyledButton onClick={() => handleBookAppointment(newAppointment)}>Book</StyledButton>
          {filteredData.length > 0 ? (
            <div>
              {filteredData.map((entry, index) => (
                <div key={index}>
                  <h3>Caregiver: {entry.caregiver.firstName} {entry.caregiver.lastName} </h3>
                  <ul>
                    {entry.slots.map((slot) => (
                      <div key={slot}>
                        <StyledLi>Available Time: {new Date(slot).toLocaleTimeString()}</StyledLi>
                        <StyledLi>Date: {new Date(slot).toLocaleDateString()}</StyledLi>
                        <StyledButton onClick={() => handleChoice(user, entry.id, entry.caregiver.id, slot)}>
                          Choose
                        </StyledButton>
                      </div>
                    ))}
                  </ul>
                </div>
              ))}

            </div>
          ) : (
            <p>No caregivers available for this date.</p>
          )}
        </div>
      )}
      </StyledMain>
    </div>
  );
};

export default CalendarPage;


const StyledLi = styled.li`
    color: red;
    font-weight: bold;
    margin-bottom: 5px;
    text-transform : capitalize;
    list-style-type: none;
    `;

const StyledMain = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
    `;
const StyledButton = styled.button`
    padding: 10px 30px;
    background-color: #057d7a;
    border-radius: 10px;
    font-size: 18px;
    font-weight: 600;
    width: 14%;
    min-width: 10rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-top: 1rem;
    transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

    &:hover {
        background-color: #2fadaa;
        transform: translateY(-3px);
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    }
    `;
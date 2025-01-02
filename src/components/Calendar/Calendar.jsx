import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";

const CalendarPage = () => {
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const getAvailability = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/availability`,
          {
            withCredentials: true,
          }
        );
        setAvailability(response.data);
      } catch (error) {
        console.error("Something went wrong, try again later.", error);
      }
    };

    getAvailability();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Format selected date to YYYY-MM-DD
    const formattedDate = date.toISOString().split("T")[0];

    // Filter caregivers and their slots for the selected date
    const filtered = availability
      .map((entry) => {
        const slotsForDate = entry.availableSlots.filter((slot) =>
          slot.startsWith(formattedDate)
        );
        return slotsForDate.length > 0
          ? { caregiver: entry.caregiverId, slots: slotsForDate }
          : null;
      })
      .filter(Boolean); // Remove null values

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
          {filteredData.length > 0 ? (
            <div>
              {filteredData.map((entry, index) => (
                <div key={index}>
                  <h3>Caregiver: {entry.caregiver.firstName} {entry.caregiver.lastName}</h3>
                  <ul>
                    {entry.slots.map((slot) => (
                      <StyledLi key={slot}>{new Date(slot).toLocaleTimeString()}</StyledLi>
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
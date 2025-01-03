import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";

const CalendarPage = () => {
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [chosenTimeslot, setChosenTimeslot] = useState(null);

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
          <h3>
            Chosen timeslot:{" "}
            {chosenTimeslot
              ? `${new Date(chosenTimeslot.slot).toLocaleDateString()} ${new Date(chosenTimeslot.slot).toLocaleTimeString()}`
              : "None selected"}
          </h3>

          <Formik
            initialValues={{
              selectedSlot: '', // Default value for the select field
            }}
            onSubmit={(values) => {
              const selectedSlot = JSON.parse(values.selectedSlot);
              handleChoice(
                user,
                selectedSlot.entryId,
                selectedSlot.caregiverId,
                selectedSlot.slot
              );
            }}
          >
            {({ handleChange }) => (
              <Form>
                {filteredData.length > 0 ? (
                  <div>
                    <Field
                        as="select"
                        name="selectedSlot"
                        onChange={(e) => {
                          const value = e.target.value;
                          handleChange(e); // Let Formik handle the value update
                          if (value) {
                            const parsedValue = JSON.parse(value);
                            setChosenTimeslot(parsedValue); // Update the chosen timeslot
                            handleChoice(
                              user, // Pass the current user
                              parsedValue.entryId,
                              parsedValue.caregiverId,
                              parsedValue.slot
                            ); // Update newAppointment state
                          } else {
                            setChosenTimeslot(null); // Reset if no value is selected
                          }
                        }}
                      >
                      <option value="" disabled>
                        Select a timeslot
                      </option>
                      {filteredData.map((entry) => (
                        <optgroup
                          key={entry.caregiver.id}
                          label={`Caregiver: ${entry.caregiver.firstName} ${entry.caregiver.lastName}`}
                        >
                          {entry.slots.map((slot) => (
                            <option
                              key={`${entry.id}-${slot}`}
                              value={JSON.stringify({
                                entryId: entry.id,
                                caregiverId: entry.caregiver.id,
                                slot,
                              })}
                            >
                              {`${new Date(slot).toLocaleDateString()} ${new Date(slot).toLocaleTimeString()}`}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </Field>
                  </div>
                ) : (
                  <p>No caregivers available for this date.</p>
                )}
              </Form>
            )}
          </Formik>

          <StyledButton
            onClick={() => handleBookAppointment(newAppointment)}
          >
            Book
          </StyledButton>
        </div>
      )}
    </StyledMain>
  </div>
);
}

export default CalendarPage;


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
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { Formik, Form, Field } from "formik";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";

const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [chosenTimeslot, setChosenTimeslot] = useState(null);


    const {
        authState: { user },
    } = useAuth();


    useEffect(() => {
        const getAvailability = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/availability/find-by-username/${user}`,
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

        // Get current date and time information
        const now = new Date();
        // Format the selected date to YYYY-MM-DD
        const filtered = availability
            .map((entry) => {
                const slotsForDate = entry.availableSlots.filter((slot) => {
                    const slotDate = new Date(slot);
                    if (slotDate >= now && slotDate.toDateString() === date.toDateString()) {
                        // For today, only show future time slots
                        return slotDate;
                    } 
                });
                return slotsForDate.length > 0
                    ? { id: entry.id, slots: slotsForDate }
                    : null;
            })
            .filter(Boolean);
        setFilteredData(filtered);
}

 const handleDeleteAvailability = async (newAppointment) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}availability/change-availability`,
        {
          withCredentials: true,
        }
      );
      toast.success("Availability changed successfully!");
    } catch (error) {
      console.error("Something went wrong, try again later.", error);
      toast.error("Something went wrong, try again later.");
    }
};

    return (
        <div>
    <ToastContainer />
    <StyledMain>
      <h1>Dr.{user}'s Schedule </h1>
      <Calendar onChange={handleDateChange} />
      {selectedDate && (
        <div>
          <h2>Your available meeting times on {selectedDate.toDateString()}:</h2>
          <h3>
            Chosen time:{" "}
            {chosenTimeslot
              ? `${new Date(chosenTimeslot.slot).toLocaleDateString()} ${new Date(chosenTimeslot.slot).toLocaleTimeString()}`
              : "None selected"}
          </h3>
          <Formik
            initialValues={[{
              selectedSlots: "",
            }]}
            onSubmit={(values) => {
              const selectedSlots = [JSON.parse(values.selectedSlot)];
              handleChoice(
                user,
                selectedSlots.entryId,
                selectedSlots.slot
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
                      multiple={true}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleChange(e);
                        if (value) {
                          const parsedValue = JSON.parse(value);
                          setChosenTimeslot(parsedValue);
                          handleChoice(
                            user,
                            parsedValue.entryId,
                            parsedValue.caregiverId,
                            parsedValue.slot
                          );
                        } else {
                          setChosenTimeslot(null);
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
                              value={[JSON.stringify({
                                entryId: entry.id,
                                caregiverId: entry.caregiver.id,
                                slot,
                              })]}
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
            <StyledButtonHolder>
          <StyledButton onClick={() => handleDeleteAvailability(newAppointment)}>
            Delete available time
            </StyledButton>
          </StyledButtonHolder>
        </div>
      )}
    </StyledMain>
  </div>
);
}

export default Schedule;

const StyledMain = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
    border: 2px solid #ccc;
    border-radius: 2%;
    min-height: 100vh;
    `;
const StyledButtonHolder = styled.div`
    display: flex;
    margin-top: 1rem;
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
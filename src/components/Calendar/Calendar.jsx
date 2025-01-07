import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


const CalendarPage = () => {
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [chosenTimeslot, setChosenTimeslot] = useState(null);
  const navigate = useNavigate();

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
      toast.success("Appointment successfully booked!", {
        position: "top-center",
        autoClose: 3000,
      });
  
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 3000); // Wait for the toast to close
    } catch (error) {
      toast.error("Something went wrong. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Error booking appointment:", error);
    }
  };

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
  
    // Get the current local date and time
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    const currentTime = now.getTime(); // Current timestamp in milliseconds
  
    // Format the selected date to YYYY-MM-DD
    const selectedDate = new Date(date);
    const formattedDate = selectedDate.toISOString().split("T")[0];
  
    const filtered = availability
      .map((entry) => {
        const slotsForDate = entry.availableSlots.filter((slot) => {
          const [slotDate, slotTime] = slot.split("T"); // Split date and time parts
          const slotDatetime = new Date(`${slotDate}T${slotTime}`).getTime(); // Parse slot to timestamp
  
          // Match the date and check the time
          return (
            slotDate === formattedDate &&
            (slotDate !== currentDate || slotDatetime >= currentTime) // Keep today's slots after the current time
          );
        });
  
        return slotsForDate.length > 0
          ? { id: entry.id, caregiver: entry.caregiverId, slots: slotsForDate }
          : null;
      })
      .filter(Boolean);
  
    setFilteredData(filtered);
  };
  
  


return (
  <div>
    <ToastContainer />
    <StyledMain>
      <h1>Doctors available appointments</h1>
      <Calendar onChange={handleDateChange} />
      {selectedDate && (
        <div>
          <h2>Available appointments on {selectedDate.toDateString()}:</h2>
          <h3>
            Chosen appointment:{" "}
            {chosenTimeslot
              ? `${new Date(chosenTimeslot.slot).toLocaleDateString()} ${new Date(chosenTimeslot.slot).toLocaleTimeString()}`
              : "None selected"}
          </h3>
          <Formik
            initialValues={{
              selectedSlot: "",
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

          <StyledButton onClick={() => handleBookAppointment(newAppointment)}>
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
    border: 2px solid #ccc;
    border-radius: 2%;
    min-height: 100vh;
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
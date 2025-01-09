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
  const [caregivers, setCaregivers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [chosenTimeslot, setChosenTimeslot] = useState(null);
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  const {
    authState: { user },
  } = useAuth();

  const [newAppointment, setNewAppointment] = useState({
    username: user ,
    summary: null,
    availabilityId: null,
    caregiverId: null,
    availabilityDate: null,
  });

  const handleChoice = (
    summary,
    availabilityId,
    caregiverId,
    availabilityDate
  ) => {
    if (
      !summary ||
      !availabilityId ||
      !caregiverId ||
      !availabilityDate
    ) {
      console.warn("Missing required fields:", {
        summary,
        availabilityId,
        caregiverId,
        availabilityDate,
      });
      return;
    }

    setNewAppointment({
      username,
      summary,
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
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Get availability first
        const availabilityResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/availability`,
          { withCredentials: true }
        );

        if (!isMounted) return;

        const availabilityData = availabilityResponse.data;
        setAvailability(availabilityData);

        const userIds = [
          ...new Set(availabilityData.map((entry) => entry.caregiverId)),
        ];

        const caregiversResponse = await axios.post(
          `${
            import.meta.env.VITE_API_URL
          }/user/find/caregivers-by-availability`,
          { userIds },
          { withCredentials: true }
        );

        if (!isMounted) return;

        setCaregivers(caregiversResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (!availability.length || !caregivers.length) {
      console.log("Data not yet loaded");
      setFilteredData([]);
      return;
    }

    const now = new Date();

    const filtered = availability
      .map((entry) => {
        // Find caregiver using the correct property name (caregiverId instead of id)
        const caregiver = caregivers.find(
          (c) => c.caregiverId === entry.caregiverId
        );

        if (!caregiver) {
          console.log(`No caregiver found for ID: ${entry.caregiverId}`);
          return null;
        }

        const slotsForDate = entry.availableSlots.filter((slot) => {
          const slotDate = new Date(slot);
          return (
            slotDate >= now && slotDate.toDateString() === date.toDateString()
          );
        });

        return slotsForDate.length > 0
          ? {
              id: entry.id,
              caregiver,
              slots: slotsForDate,
            }
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
                ? `${new Date(
                    chosenTimeslot.slot
                  ).toLocaleDateString()} ${new Date(
                    chosenTimeslot.slot
                  ).toLocaleTimeString()}`
                : "None selected"}
            </h3>
            <Formik
              initialValues={{
                selectedSlot: "",
                summary: "",
              }}
              onSubmit={(values) => {
                const selectedSlot = JSON.parse(values.selectedSlot);
                handleChoice(
                  summary,
                  selectedSlot.entryId,
                  selectedSlot.caregiver,
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
                              summary || "", // Provide a default empty string
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
                            key={entry.caregiver.caregiverId}
                            label={`Caregiver: ${entry.caregiver.firstname} ${entry.caregiver.lastname}`}
                          >
                            {entry.slots.map((slot) => (
                              <option
                                key={`${entry.id}-${slot}`}
                                value={JSON.stringify({
                                  entryId: entry.id,
                                  caregiverId: entry.caregiver.caregiverId,
                                  slot,
                                })}
                              >
                                {`${new Date(
                                  slot
                                ).toLocaleDateString()} ${new Date(
                                  slot
                                ).toLocaleTimeString()}`}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </Field>
                    </div>
                  ) : (
                    <p>No caregivers available for this date.</p>
                  )}
                  <Field
                    name="summary"
                    onChange={(e) => {
                      handleChange(e);
                      setSummary(e.target.value);
                      if (chosenTimeslot) {
                        // Only update if a timeslot is selected
                        handleChoice(
                          e.target.value,
                          chosenTimeslot.entryId,
                          chosenTimeslot.caregiverId,
                          chosenTimeslot.slot
                        );
                      }
                    }}
                  />
                </Form>
              )}
            </Formik>

            <StyledButton
              type="submit"
              onClick={() => handleBookAppointment(newAppointment)}
            >
              Book
            </StyledButton>
          </div>
        )}
      </StyledMain>
    </div>
  );
};

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

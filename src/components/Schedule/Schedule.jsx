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
  const [existingSlots, setExistingSlots] = useState([]);

  const {
    authState: { user },
  } = useAuth();

  useEffect(() => {
    const getAvailability = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/availability/find-by-username/${user}`,
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

    const now = new Date();
    const filtered = availability
      .map((entry) => {
        const slotsForDate = entry.availableSlots.filter((slot) => {
          const slotDate = new Date(slot);
          if (
            slotDate >= now &&
            slotDate.toDateString() === date.toDateString()
          ) {
            return slotDate;
          }
        });
        return slotsForDate.length > 0
          ? { id: entry.id, slots: slotsForDate, caregiver: entry.caregiverId }
          : null;
      })
      .filter(Boolean);

    const existing = filtered.flatMap((entry) => entry.slots);
    setFilteredData(filtered);
    setExistingSlots(existing);
  };

  const generateTimeSlots = (date) => {
    const slots = [];
    const startTime = new Date(date);
    startTime.setHours(8, 0, 0, 0); // Start at 8:00
    const endTime = new Date(date);
    endTime.setHours(15, 30, 0, 0); // End at 15:30

    const existingSet = new Set(
      existingSlots.map((slot) => new Date(slot).toISOString())
    );

    while (startTime <= endTime) {
      const slotISO = startTime.toISOString();
      if (!existingSet.has(slotISO) && startTime > new Date()) {
        slots.push(new Date(startTime));
      }
      startTime.setMinutes(startTime.getMinutes() + 30); // Increment by 30 minutes
    }

    return slots;
  };

  const handleDeleteAvailability = async (changingDates, availabilityId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/availability/remove-availability`,
        {
          changingDates,
          availabilityId,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(
        "Availability removed successfully! " +
          changingDates
            .map((date) => new Date(date).toLocaleString())
            .join(", ")
      );
    } catch (error) {
      console.error("Something went wrong, try again later.", error);
      toast.error("Something went wrong, try again later.");
    }
  };

  const handleAddAvailability = async (changingDates, availabilityId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/availability/add-availability`,
        {
          changingDates,
          availabilityId,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(
        "Availability added successfully! " +
          changingDates
            .map((date) => new Date(date).toLocaleString())
            .join(", ")
      );
    } catch (error) {
      console.error("Something went wrong, try again later.", error);
      toast.error("Something went wrong, try again later.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <StyledMain>
        <h1>Dr. {user}'s Schedule </h1>
        <Calendar onChange={handleDateChange} />
        {selectedDate && (
          <div>
            <h2>
              Your available meeting times on {selectedDate.toDateString()}:
            </h2>
            <Formik
              initialValues={{ selectedSlots: [] }}
              onSubmit={(values) => {
                if (values.selectedSlots.length === 0) {
                  toast.error("Please select at least one time slot");
                  return;
                }

                const selectedSlots = values.selectedSlots.map((slot) =>
                  JSON.parse(slot)
                );

                const groupedSlots = selectedSlots.reduce((acc, curr) => {
                  if (!acc[curr.entryId]) {
                    acc[curr.entryId] = [];
                  }
                  acc[curr.entryId].push(curr.slot);
                  return acc;
                }, {});

                Object.entries(groupedSlots).forEach(
                  ([availabilityId, slots]) => {
                    handleDeleteAvailability(slots, availabilityId);
                  }
                );
              }}
            >
              {({ handleChange, values }) => (
                <Form>
                  {filteredData.length > 0 ? (
                    <div>
                      <StyledField
                        as="select"
                        name="selectedSlots"
                        multiple
                        onChange={(e) => {
                          const options = Array.from(e.target.selectedOptions);
                          const selectedValues = options.map(
                            (option) => option.value
                          );
                          handleChange({
                            target: {
                              name: "selectedSlots",
                              value: selectedValues,
                            },
                          });
                        }}
                      >
                        <option value="" disabled>
                          Select timeslots
                        </option>
                        {filteredData.map((entry) => (
                          <optgroup key={entry.id}>
                            {entry.slots
                              .sort((a, b) => new Date(a) - new Date(b)) // Sort slots chronologically
                              .map((slot) => (
                                <option
                                  key={`${entry.id}-${slot}`}
                                  value={JSON.stringify({
                                    entryId: entry.id,
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
                      </StyledField>
                    </div>
                  ) : (
                    <p>No available times for this date.</p>
                  )}
                  <StyledButton type="submit">
                    Remove available times
                  </StyledButton>
                </Form>
              )}
            </Formik>

            <h2>Add new availability:</h2>
            <Formik
              initialValues={{ newSlots: [] }}
              onSubmit={(values) => {
                if (values.newSlots.length === 0) {
                  toast.error("Please select at least one time slot");
                  return;
                }

                const newSlots = values.newSlots.map((slot) =>
                  new Date(slot).toISOString()
                );
                handleAddAvailability(newSlots, availability[0]?.id); 
              }}
            >
              {({ handleChange }) => (
                <Form>
                  <StyledField
                    as="select"
                    name="newSlots"
                    multiple
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions);
                      const selectedValues = options.map(
                        (option) => option.value
                      );
                      handleChange({
                        target: {
                          name: "newSlots",
                          value: selectedValues,
                        },
                      });
                    }}
                  >
                    {generateTimeSlots(selectedDate).map((slot) => (
                      <option
                        key={slot.toISOString()}
                        value={slot.toISOString()}
                      >
                        {`${slot.toLocaleDateString()} ${slot.toLocaleTimeString()}`}
                      </option>
                    ))}
                  </StyledField>
                  <StyledButton type="submit">Add times</StyledButton>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </StyledMain>
    </div>
  );
};

export default Schedule;

const StyledMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #ccc;
  border-radius: 2%;
  min-height: 75vh;
`;

const StyledField = styled(Field)`
  width: 100%;
  height: fit-content;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
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

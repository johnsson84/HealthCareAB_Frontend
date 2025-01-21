import axios from "axios";
import { useState, useEffect } from "react";

const Facility = () => {
  const [hospitals, setHospitals] = useState([]);
  const [coworkerDetails, setCoworkerDetails] = useState(null);
  // Testa att göra en lista med alla saker man kan skriva och sen kolla mot den.

  // hämtar alla sjukhus från DB
  const fetchHospitals = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/facility/all`,
        {
          withCredentials: true,
        }
      );
      // plockar ut coworker ids
      const coworkerIds = [
        ...new Set(response.data.flatMap((i) => i.coworkersId)),
      ];

      fetchCoworkerDetails(coworkerIds);
      setHospitals(response.data);
    } catch (err) {
      console.log("error fetching facility " + err);
    }
  };

  // Hämtar coworker info via deras ID
  const fetchCoworkerDetails = async (ids) => {
    const nameMap = {};
    for (const userId of ids) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/full-name/${userId}`,
          {
            withCredentials: true,
          }
        );
        const fullName = res.data;
        nameMap[userId] = fullName;
      } catch (error) {
        console.error(`Error fetching name for userId ${userId}:`, error);
        nameMap[userId] = "Unknown";
      }
    }
    setCoworkerDetails((prevData) => ({ ...prevData, ...nameMap }));
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    
  );
};

export default Facility;


{/* <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h4>Available Hospitals</h4>
      {hospitals.length === 0 ? (
        <p> no hospitals available</p>
      ) : (
        <div
          style={{
            padding: "0px",
            borderRadius: "10px",
            overflow: "hidden",
            width: "50%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <ul
            style={{
              margin: "0",
              display: "flex",
              flexWrap: "wrap",
              height: "50rem",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {hospitals.map((hospitals, index) => (
              <div
                key={index}
                style={{
                  margin: "5px",
                  display: "flex",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "12px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Hospital: {hospitals.facilityName} <br />
                  City: {hospitals.address.city} <br />
                  {/* Phone: {hospitals.phoneNumber} <br /> */}
                  {/* Mail: {hospitals.email} <br /> */}
                  {/* Open hours: {hospitals.hoursOpen} <br /> */}
                  {/* Address: {hospitals.address.street} <br />
                  Region: {hospitals.address.region} <br />
                  Country: {hospitals.address.country} */}
                  {hospitals.coworkersId && hospitals.coworkersId.length > 0 ? (
                    <ul
                      style={{
                        margin: "0",
                        padding: "0",
                        // border: "1px solid red",
                        display: "flex",
                        flexDirection: "column",
                        width: "12rem",
                        justifyContent: "center",
                        alignItems: "start",
                      }}
                    >
                      {/* {hospitals.coworkersId.map((userId, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "10px",
                            height: "2rem",
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          Doctor:
                          {coworkerDetails && coworkerDetails[userId]
                            ? coworkerDetails[userId]
                            : "Loading..."}
                        </li>
                      ))} */}
                    </ul>
                  ) : (
                    "Nobody seems to work here??"
                  )}
                </li>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div> */}
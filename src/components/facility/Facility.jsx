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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
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
            border: "1px solid black",
            width: "50rem",
            overflow: "hidden",
          }}
        >
          <ul
            style={{
              margin: "0",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {hospitals.map((hospitals, index) => (
              <div key={index} style={{margin: "5px", width: "17rem",}}>
                <li>
                  Hospital: {hospitals.facilityName} <br />
                  City: {hospitals.address.city} <br />
                  Phone: {hospitals.phoneNumber} <br />
                  Mail: {hospitals.email} <br />
                  Open hours: {hospitals.hoursOpen} <br />
                  Address: {hospitals.address.street} <br />
                  Region: {hospitals.address.region} <br />
                  Country: {hospitals.address.country}
                {hospitals.coworkersId && hospitals.coworkersId.length > 0 ? (
                  <ul>
                    {hospitals.coworkersId.map((userId, i) => (
                      <li key={i}>
                        Doctor:{" "}
                        {coworkerDetails && coworkerDetails[userId]
                          ? coworkerDetails[userId]
                          : "Loading..."}
                      </li>
                    ))}
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
    </div>
  );
};

export default Facility;

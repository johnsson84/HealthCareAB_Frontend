import axios from "axios";
import { useState, useEffect } from "react";

const Facility = () => {
  const [hospitals, setHospitals] = useState([]);

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
      setHospitals(response.data);
    } catch (err) {
      console.log("error fetching facility " + err);
    }
  };

  console.log(hospitals);

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div>
      <h4>Available Hospitals</h4>
      {hospitals.length === 0 ? (
        <p> no hospitals available</p>
      ) : (
        <ul style={{border: "1px solid black ", display: "flex", justifyItems: "center", flexDirection: "column"}}>
          {hospitals.map((hospitals, index) => (
            <div key={index} >
            <li>Hospital: {hospitals.facilityName} <br />
            Phone: {hospitals.phoneNumber} <br />
            Mail: {hospitals.email} <br />
            Open hours: {hospitals.hoursOpen}</li>
              
              {hospitals.address ? (
              <>
              <li>
              <strong>Street:</strong> {hospitals.address.street} <br />
              <strong>City:</strong> {hospitals.address.city} <br />
              <strong>Postal Code:</strong>{hospitals.address.postcode} <br />
              <strong>Region:</strong> {hospitals.address.region} <br />
              <strong>Country:</strong> {hospitals.address.country} <br />
              </li>
              </>
            ) : (
              "Address not available"
            )}
            {hospitals.coworkersId && hospitals.coworkersId.length > 0 ? (
              <ul>
                {hospitals.coworkersId.map((coworkerId, i) => (
                  <li key={i}>{coworkerId}</li>
                ))}
              </ul>
            ) : (
              "Nobody seems to work here??"
            )}
            
            
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Facility;

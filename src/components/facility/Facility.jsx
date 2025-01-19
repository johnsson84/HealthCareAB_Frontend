import axios from "axios";
import { useState, useEffect } from "react";

const Facility = () => {
  const [hospitals, setHospitals] = useState([]);
  const [coworkerDetails, setCoworkerDetails ] = useState(null);
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


      // plockar ut coworker ids 
      const coworkerIds = [...new setHospitals(response.data.flatMap((i) => i.coworkersId))];

    } catch (err) {
      console.log("error fetching facility " + err);
    }
  };
  
  // Hämtar coworker info via deras ID
  // const fetchCoworkerDetails = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_API_URL}/user/find/{username}`

  //     )
  //   }
  // }

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div>
      <h4>Available Hospitals</h4>
      {hospitals.length === 0 ? (
        <p> no hospitals available</p>
      ) : (
        <ul
          style={{
            border: "1px solid black ",
            display: "flex",
            justifyItems: "center",
            flexDirection: "column",
          }}
        >
          {hospitals.map((hospitals, index) => (
            <div key={index}>
              <li>
                Hospital: {hospitals.facilityName} <br />
                Phone: {hospitals.phoneNumber} <br />
                Mail: {hospitals.email} <br />
                Open hours: {hospitals.hoursOpen} <br />
                Address: {hospitals.address.street} <br />
                City: {hospitals.address.city} <br />
                Region: {hospitals.address.region} <br />
                Country: {hospitals.address.country}
              </li>

              
              {hospitals.coworkersId && hospitals.coworkersId.length > 0 ? (
                <ul>
                  
                  {hospitals.coworkersId.map((coworkerId, i) => (
                    <li key={i}>Doctor: {coworkerId}</li>
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

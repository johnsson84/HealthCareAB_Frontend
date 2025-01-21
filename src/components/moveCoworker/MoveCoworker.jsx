import { useState } from "react";
import axios from "axios";
import "./MoveCoworker.css";
import styled from "styled-components";

const FooterSpace = styled.div`
  height: 4rem;
  width: 100%;
`;

const MoveCoworker = () => {
  const [coworker, setCoworker] = useState(null);
  const [username, setUsername] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [response, setResponse] = useState("");

  const getCoworker = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/find/${username}`,
        { withCredentials: true }
      );
      setCoworker(response.data);
    } catch (error) {
      console.error("Error fetching coworker:", error);
    }
  };

  const getFacilities = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/facility/all`,
        { withCredentials: true }
      );
      setFacilities(response.data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const moveCoworker = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/facility/move/coworker/${coworker.facilityId}/${selectedFacility.id}/${coworker.id}`,
        {},
        { withCredentials: true }
      );
      setResponse("Coworker was moved.");
    } catch {
      setResponse("Some Error appeared, try again!");
    }
  };

  if (response) return <p className="coworkerResponse">{response}</p>;

  return (
    <div>
      <h2>Change A Coworker's Location</h2>
      <div className="moveCoContainer">
        <div className="searchUsernameContainer">
          <h4>Search User by Username:</h4>
          <div className="searchInnerCon">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <button onClick={getCoworker}>Search</button>
          </div>

          {coworker && (
            <div className="userDetails">
              <p><strong>First Name:</strong> {coworker.firstName}</p>
              <p><strong>Last Name:</strong> {coworker.lastName}</p>
              <p><strong>Email:</strong> {coworker.mail}</p>
              {facilities.length > 0 && (
                <p><strong>Current Facility:</strong> {facilities.find((fac) => fac.id === coworker.facilityId)?.facilityName || "Error when loading."}</p>
              )}
            </div>
          )}
        </div>

        {coworker && (
          <div className="selectFacilitiesContainer">
            <div className="selectFacilitiesInnerCon">
              <h4>Select Facilities</h4>
              <button onClick={getFacilities}>Load Facilities</button>
              <ul className="selectUlCon">
                {selectedFacility ? (
                  <li key={selectedFacility.id}>
                    {selectedFacility.facilityName} <br />
                    {selectedFacility.address.city}
                  </li>
                ) : (
                  facilities
                    .filter((facility) => facility.id !== coworker?.facilityId)
                    .map((facility) => (
                      <li
                        className="selectFacilityLi"
                        key={facility.id}
                        onClick={() => setSelectedFacility(facility)}
                        style={{ cursor: "pointer", color: "black" }}
                      >
                        {facility.facilityName} <br />
                        {facility.address.city}
                      </li>
                    ))
                )}
              </ul>
            </div>
          </div>
        )}

        {selectedFacility && <button onClick={moveCoworker} className="moveCoworkerBtn">Move Coworker</button>}
      </div>
      <FooterSpace />
    </div>
  );
};

export default MoveCoworker;

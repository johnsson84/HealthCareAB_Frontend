import axios from "axios";
import { useState, useEffect } from "react";
import {Dialog, DialogTitle,  DialogContent, List, ListItem, ListItemText, Button, TextField} from "@mui/material";

const Facility = () => {
  const [hospitals, setHospitals] = useState([]);
  const [coworkerDetails, setCoworkerDetails] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchText, setSearchText] = useState("");


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
      setFilteredHospitals(response.data);
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

  const handleOpenDetails = (hospital) => {
    setSelectedHospital(hospital);
  }
  const handleCloseDetails = () => {
    setSelectedHospital(null);
  };

  // filtrerar en lista på alla sjukhus baserat på userns söktext
  const handleFilterHospitalSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text); 
    const filtered = hospitals.filter(
      (hospital) =>
      hospital.facilityName.toLowerCase().includes(text) ||
      hospital.address.city.toLowerCase().includes(text)
    );
    setFilteredHospitals(filtered);
  }

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h4>Available Hospitals</h4>
      <TextField
        label="Search by name or city"
        variant="outlined"
        style={{ marginBottom: "20px", width: "50%" }}
        value={searchText}
        onChange={handleFilterHospitalSearch}
      />
      {filteredHospitals.length === 0 ? (
        <p>No hospitals match your search</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
            maxWidth: "800px",
          }}
        >
          {filteredHospitals.map((hospital, index) => (
            <Button
              key={index}
              variant="outlined"
              style={{
                minWidth: "200px",
                textAlign: "center",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => handleOpenDetails(hospital)}
            >
              {hospital.facilityName} <br />
              {hospital.address.city}
            </Button>
          ))}
        </div>
      )}
    {selectedHospital && (
      <Dialog
        open={!!selectedHospital}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{selectedHospital.facilityName}</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText
                primary="City"
                secondary={selectedHospital.address.city}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Phone"
                secondary={selectedHospital.phoneNumber || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={selectedHospital.email || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Open Hours"
                secondary={selectedHospital.hoursOpen || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Address"
                secondary={`${selectedHospital.address.street}, ${selectedHospital.address.region}, ${selectedHospital.address.country}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Doctors"
                secondary={
                  selectedHospital.coworkersId?.length
                    ? selectedHospital.coworkersId
                        .map((id) =>
                          coworkerDetails?.[id]
                            ? coworkerDetails[id]
                            : "Loading..."
                        )
                        .join(", ")
                    : "Nobody seems to work here??"
                }
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    )}
  </div>
  );
};

export default Facility;



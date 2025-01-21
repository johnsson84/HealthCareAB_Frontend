import axios from "axios";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
} from "@mui/material";

const Faq = () => {
  const [conditions, setConditions] = useState([]);
  const [filteredConditions, setFilteredConditions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchConditions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/conditions/all`,
        {
          withCredentials: true,
        }
      );
      setConditions(response.data);
      setFilteredConditions(response.data);
    } catch (error) {
      console.log("error fetching conditions " + error);
    }
  };

  // Hanterar öppet och stängt popup fönster
  const handleOpenDetails = (hospital) => {
    setSelectedCondition(hospital);
  };
  const handleCloseDetails = () => {
    setSelectedCondition(null);
  };

  const handleFilterConditionSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    const filtered = conditions.filter(
      (faq) =>
        faq.name.toLowerCase().includes(text) ||
        faq.category.toLowerCase().includes(text)
    );
    setFilteredConditions(filtered);
  };

  useEffect(() => {
    fetchConditions();
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
      <h4>Frequently Asked Questions</h4>
      <TextField
        label="Search by question or category"
        variant="outlined"
        style={{ marginBottom: "20px", width: "50%" }}
        value={searchText}
        onChange={handleFilterConditionSearch}
      />
      {filteredConditions.length === 0 ? (
        <p>No FAQs match your search</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            padding: "10px",
            justifyContent: "center",
            maxWidth: "800px",
            overflow: "scroll",
            height: "auto",
          }}
        >
          {filteredConditions.map((faq, index) => (
            <Button
              key={index}
              variant="outlined"
              sx={{
                borderColor: "gray",
                fontSize: "13px",
                textAlign: "center",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                color: "black",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  borderColor: "black",
                },
                "@media (max-width: 460px)": {
                  width: "15rem",
                },
              }}
              onClick={() => handleOpenDetails(faq)}
            >
              {faq.name} <br />
              {faq.category}
            </Button>
          ))}
        </div>
      )}
      {selectedCondition && (
        <Dialog
          open={!!selectedCondition}
          onClose={handleCloseDetails}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "15px",
            },
          }}
        >
          <DialogTitle>{selectedCondition.name}</DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <ListItemText
                  primary="Category"
                  secondary={selectedCondition.category}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Details"
                  secondary={selectedCondition.description || "N/A"}
                />
              </ListItem>
            </List>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
export default Faq;

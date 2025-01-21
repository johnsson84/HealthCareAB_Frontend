import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const AddConditionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 20px;
`;

const ConfirmationMessage = styled.div`
  font-size: 18px;
  color: green;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
`;

const ConditionButton = styled.button`
  border-radius: 8px;
  border-style: none;
  height: 2rem;
  width: 8rem;
  margin-top: 2rem;
  background-color: #057d7a;
  color: white;
  font-weight: 600;
  margin-bottom: 1rem;
  cursor: pointer;
`;
const ConditionInput = styled.input`
  height: 2rem;
  width: auto;
  border-radius: 8px;
  border-style: none;
  border: solid 1px lightgray;
  margin-bottom: 1rem;
`;
const ConditionSelect = styled.select`
  height: 2rem;
  width: auto;
  border-radius: 8px;
  border-style: none;
  border: solid 1px lightgray;
  margin-top: 1rem;
`;

const AddCondition = () => {
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const addConditionAxios = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/conditions/add`,
        {
          name: condition,
          description: description,
          category: category,
        },
        { withCredentials: true }
      );

      setIsSubmitted(true);
      setMessage("Condition Added!");
    } catch (error) {
      setIsSubmitted(true)
      setMessage(
        "Something went wrong, control your inputs or try again later!"
      );
    }
  };

  const resetForm = () => {
    setCondition("");
    setDescription("");
    setCategory("");
    setIsSubmitted(false);
  };

  return (
    <AddConditionContainer>
      <h3>Add New Condition</h3>

      {isSubmitted ? (
        <AddConditionContainer>
          <ConfirmationMessage>{message}</ConfirmationMessage>
          <ConditionButton onClick={resetForm}>Add One More?</ConditionButton>
        </AddConditionContainer>
      ) : (
        <AddConditionContainer>
          <label>Condition:</label>
          <ConditionInput
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />

          <label>Description:</label>
          <ConditionInput
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Category:</label>
          <ConditionSelect
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="DISEASES">Diseases</option>
            <option value="DISORDERS">Disorders</option>
          </ConditionSelect>

          <ConditionButton onClick={addConditionAxios}>
            Add Condition
          </ConditionButton>
        </AddConditionContainer>
      )}
    </AddConditionContainer>
  );
};

export default AddCondition;

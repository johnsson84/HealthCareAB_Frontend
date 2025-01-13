import React, { useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import styled from "styled-components";
import {v4 as uuidv4} from "uuid";


const s3 = new S3Client({
  region: import.meta.env.VITE_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY,
  },
  
});



const BucketTest = () => {
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  
// Then update your file upload logic to include proper error handling:
const handleUpload = async () => {
  if (!file) {
    setUploadMessage("Please select a file to upload.");
    return;
  }
  const uniqueKey = `${uuidv4()}-${file.name}`;
  try {
    const params = {
      Bucket: import.meta.env.VITE_BUCKET_NAME,
      Key: import.meta.env.VITE_DIR_NAME 
        ? `${import.meta.env.VITE_DIR_NAME}/${uniqueKey}`
        : file.name,
      Body: file,
    };

    const result = await s3.send(new PutObjectCommand(params));
    console.log('Upload result:', result);
    setUploadMessage("File uploaded successfully!");
    
    // Only proceed with profile update if upload was successful
    await updateUserProfile(uniqueKey);
  } catch (error) {
    console.error("Upload error:", error);
    setUploadMessage(`Error uploading file: ${error.message}`);
  }
};

const updateUserProfile = async (fileName) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/user/update-user-picture/${user}`,
      { url: fileName },
      { withCredentials: true }
    );
    console.log('Profile update response:', response);
  } catch (error) {
    console.error("Error updating user profile picture URL:", error);
    setUploadMessage("File uploaded but profile update failed.");
  }
};

  return (
    <StyledMain>
      <h1>Change profile picture</h1>
      <StyledInput type="file" accept=".jpg, .jpeg, .png, .webp, .gif" onChange={handleFileChange} />
      <StyledButton 
  onClick={handleUpload} 
  disabled={!file}
>
  Upload to S3

</StyledButton>
      {uploadMessage && <p>{uploadMessage}</p>}
    </StyledMain>
  );
};

export default BucketTest;


const StyledMain = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
`;
const StyledInput = styled.input`
  font-size: 16px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  border-radius: 5px;
  padding: 5px 0px;

  &:focus {
    outline: none;
  }
`;

const StyledButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-top: 40px;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  text-align: center;
  border: none;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
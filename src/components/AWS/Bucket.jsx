import React, { useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

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

  try {
    const params = {
      Bucket: import.meta.env.VITE_BUCKET_NAME,
      Key: import.meta.env.VITE_DIR_NAME 
        ? `${import.meta.env.VITE_DIR_NAME}/${file.name}`
        : file.name,
      Body: file,
    };

    const result = await s3.send(new PutObjectCommand(params));
    console.log('Upload result:', result);
    setUploadMessage("File uploaded successfully!");
    
    // Only proceed with profile update if upload was successful
    await updateUserProfile(file.name);
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
    <div>
      <h1>Bucket Test</h1>
      <input type="file" accept=".jpg, .jpeg, .png, .webp, .gif" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to S3</button>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default BucketTest;

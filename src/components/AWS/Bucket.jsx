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
  const bucketURL = import.meta.env.VITE_BUCKET_URL;
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("Please select a file to upload.");
      return;
    }

    const params = {
      Bucket: import.meta.env.VITE_BUCKET_NAME,
      Key: `${import.meta.env.VITE_DIR_NAME || ""}/${file.name}`,
      Body: file,
    };

    try {
      await s3.send(new PutObjectCommand(params));
      setUploadMessage("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadMessage("Error uploading file.");
    }
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/user/update-user-picture/${user}`, 
        {
        url: `${file.name}`,
      },
      {
        withCredentials: true,
      }
    );
      console.log(response);
    } catch (error) {
      console.error("Error updating user profile picture URL:", error);
    }
  };

  return (
    <div>
      <h1>Bucket Test</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to S3</button>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default BucketTest;

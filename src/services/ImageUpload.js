import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

const ProfileImageUpload = ({ userId, onUploadSuccess, type }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Please select an image");
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      alert("Image must be < 2MB");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = () => {
    if (!file || !userId) return;

    setUploading(true);

    const ext = file.name.split(".").pop();

    var imageRef = "";
    if (type === "vendor") {
      imageRef = ref(storage, `businessimg/${userId}/logo.${ext}`);
    }else{
        imageRef = ref(storage, `profileimg/${userId}/profile.${ext}`);
    }

    const uploadTask = uploadBytesResumable(imageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(percent));
      },
      (error) => {
        console.error(error);
        alert("Upload failed");
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUploading(false);
        onUploadSuccess(downloadURL);
      }
    );
  };

  return (
    <div className="justify-content-between d-flex flex-column align-items-center">
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && type === "client" ? (
        <img
          src={preview}
          alt="Preview"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            marginTop: 10,
          }}
        />
      ) : (
        <img
          src={preview}
          alt="Preview"
          style={{
            width: 300,
            height: 150,
            borderRadius: "8px",
            objectFit: "cover",
            marginTop: 10,
          }}
        />
      )}

      {uploading && <p>Uploading... {progress}%</p>}

      <button onClick={handleUpload} disabled={uploading || !file}>
        Upload Image
      </button>
    </div>
  );
};

export default ProfileImageUpload;

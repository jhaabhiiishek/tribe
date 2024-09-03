import '../App.css';
import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const firebaseConfig = {
    apiKey: "AIzaSyDghvHV7wJfe9BB9-ocK6IDulZIGRlYBh4",
    authDomain: "tribe-main-proj.firebaseapp.com",
    projectId: "tribe-main-proj",
    storageBucket: "tribe-main-proj.appspot.com",
    messagingSenderId: "533647502304",
    appId: "1:533647502304:web:9ca45b8b4fc5fca83e9985",
    measurementId: "G-Z2LLK5DLL1"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function UploadImage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      return;
    }

    const storageRef = ref(storage, `images/${selectedImage.name}`); // Adjust the path as needed

    try {
      const uploadTask = uploadBytes(storageRef, selectedImage);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      }, (error) => {
        setUploadError(error.message);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          toast.success('Image uploaded successfully!');
        });
      });
    } catch (error) {
      toast.error('An error occurred during image upload.');
      setUploadError(error.message);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleImageUpload} disabled={!selectedImage}>Upload Image</button>
      {uploadProgress > 0 && (
        <div>
          <progress value={uploadProgress} max="100" />
          <span>{uploadProgress}%</span>
        </div>
      )}
      {imageUrl && <img src={imageUrl} alt="Uploaded Image" />}
      {uploadError && <p>{uploadError}</p>}
      <ToastContainer />
    </div>
  );
}

export default UploadImage;
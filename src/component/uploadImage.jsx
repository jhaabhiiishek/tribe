import '../App.css';
import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import { event } from 'jquery';
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
  const dispatch = useDispatch();
  const {setFileUploaded} = bindActionCreators(actionCreators, dispatch)
  
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      return;
    }

    const storageRef = ref(storage, `images/${selectedImage.name}`);// Adjust the path as needed
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress =(snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          setUploadError(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            setFileUploaded(downloadURL)
            toast.success('Image uploaded successfully!');
          });
      });
    
  };

  return (
    <div>
      <label htmlFor="imageInput">
        <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} />
        <span style={{fontSize:'x-small',color:'black'}}>Aspect ratio 1:1</span>
      </label>
      <button onClick={(event)=>handleImageUpload(event)} disabled={!selectedImage}>Upload</button>
      {uploadProgress > 0 && (
        <div>
          <progress value={uploadProgress} max="100" />
          <span>{uploadProgress}%</span>
        </div>
      )}
      {imageUrl && <img src={imageUrl} width={225} height={225} style={{borderRadius:'3px',border:'1px solid black'}}alt="Uploaded Image" />}
      {uploadError && <p>{uploadError}</p>}
      <ToastContainer />
    </div>
  );
}

export default UploadImage;
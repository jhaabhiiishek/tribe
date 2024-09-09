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
import getCookie from './getCookie';
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId:process.env.APP_ID ,
  measurementId: process.env.MEASUREMENT_ID
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

  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      return;
    }
    
    const studentCookie = getCookie()
    const storageRef = ref(storage, `images/${studentCookie.user_id+selectedImage.name+makeid(5)}`);// Adjust the path as needed
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
      <input type="file" id="imageInput" style={{marginRight:'2%'}} accept="image/*" onChange={handleImageChange} />
      <button onClick={(event)=>handleImageUpload(event)} disabled={!selectedImage}>Upload</button>
      {uploadProgress > 0 && (
        <div>
          <progress value={uploadProgress} max="100" />
          <span>{uploadProgress}%</span>
        </div>
      )}
      {/* {imageUrl && <img src={imageUrl} width={225} height={225} style={{borderRadius:'3px',border:'1px solid black'}}alt="Uploaded Image" />} */}
      {imageUrl && <h3>Uploaded successfully</h3>}
      {uploadError && <p>{uploadError}</p>}
      <ToastContainer />
    </div>
  );
}

export default UploadImage;
import React, { useEffect, useRef } from 'react';

export default function ImageComponent({ src }) {
  const imageRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;
    const width = image.naturalWidth;
    const height = image.naturalHeight;

  }, []);

  return (
    <img src={src} alt="Image" className="image" ref={imageRef} />
  );
}

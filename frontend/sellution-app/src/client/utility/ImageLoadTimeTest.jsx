import React, { useEffect } from 'react';

const ImageLoadTimeTest = ({ imageUrl }) => {
  useEffect(() => {
    const measureImageLoadTime = (imageUrl) => {
      const startTime = performance.now();
      const img = new Image();

      img.onload = () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        console.log(`Image Load Time for ${imageUrl}: ${loadTime.toFixed(2)} ms`);
      };

      img.onerror = () => {
        console.error(`Failed to load image: ${imageUrl}`);
      };

      img.src = imageUrl;
    };

    measureImageLoadTime(imageUrl);
  }, [imageUrl]);

  return (
    <div>
      <img src={imageUrl} alt='Product Thumbnail' style={{ display: 'none' }} />
    </div>
  );
};

export default ImageLoadTimeTest;

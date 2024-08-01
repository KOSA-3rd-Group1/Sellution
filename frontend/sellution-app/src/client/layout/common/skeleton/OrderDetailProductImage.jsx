import { useState, useEffect } from 'react';

const OrderDetailProductImage = ({ src }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className='relative w-full h-full'>
      {isLoading && (
        <div className='inset-0 w-14 h-14 bg-gray-300 animate-pulse rounded-lg shadow-lg ring-1 ring-offset-2 ring-brandOrange'></div>
      )}
      <img
        src={src}
        className={`w-14 h-14 rounded-lg shadow-lg ring-1 ring-offset-2 ring-brandOrange ${isLoading ? 'hidden' : 'block'}`}
        alt='Product'
      />
    </div>
  );
};

export default OrderDetailProductImage;

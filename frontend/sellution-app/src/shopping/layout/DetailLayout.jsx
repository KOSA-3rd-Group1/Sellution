import { formatPrice } from "../../client/utility/functions/formatterFunction";

const DetailComponent = ({ productToShow, activeSlide, handleSlideChange }) => {
  if (!productToShow) {
    return <div>Product not found</div>;
  }
  return (
    <div className='w-full h-full flex justify-center items-center relative'>
      <main
        className={`w-10/12 h-[90%] main-box detail-box rounded-lg flex flex-col shadow-md transform`}
      >
        {/* carousel start */}
        <div className='carousel detail-box-1 image-box flex-[4] flex flex-col justify-center items-center w-full'>
          {/* <div
            id='slide1'
            className={`carousel-item relative product-image w-[85%] h-auto aspect-square bg-cover rounded-lg shadow-md ${
              activeSlide === 1 ? 'block' : 'hidden'
            }`}
            style={{ backgroundImage: `url('/image/nike1.png')` }}
          ></div>
          <div
            id='slide2'
            className={`carousel-item relative product-image w-[85%] h-auto aspect-square bg-cover rounded-lg shadow-md ${
              activeSlide === 2 ? 'block' : 'hidden'
            }`}
            style={{ backgroundImage: `url('/image/nike2.png')` }}
          ></div>
          <div
            id='slide3'
            className={`carousel-item relative product-image w-[85%] h-auto aspect-square bg-cover rounded-lg shadow-md ${
              activeSlide === 3 ? 'block' : 'hidden'
            }`}
            style={{ backgroundImage: `url('/image/nike3.png')` }}
          ></div>
          <div
            id='slide4'
            className={`carousel-item relative product-image w-[85%] h-auto aspect-square bg-cover rounded-lg shadow-md ${
              activeSlide === 4 ? 'block' : 'hidden'
            }`}
            style={{ backgroundImage: `url('/image/nike4.png')` }}
          ></div> */}
          {productToShow.detailImages.map((imageUrl, index) => (
            <div
              key={index}
              id={`slide${index + 1}`}
              className={`carousel-item relative product-image w-[85%] h-auto aspect-square bg-cover rounded-lg shadow-md ${activeSlide === index + 1 ? 'block' : 'hidden'}`}
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
          ))}
          {/* carousel button start */}
          <div className='flex justify-center mt-6 gap-2'>
            {productToShow.detailImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${activeSlide === index + 1 ? 'bg-orange-500' : 'bg-gray-300'}`}
                onClick={() => handleSlideChange(index)}
              ></button>
            ))}
          </div>
          {/* carousel button end */}
        </div>
        {/* carousel end */}
        <div className='detail-box-2 info-box flex-[2.3] flex flex-col p-6'>
          <span className='flex-[2] info-1 font-bold text-lg'>{productToShow.name}</span>
          <span className='flex-[2] info-2 text-gray-500'>{productToShow.categoryName}</span>
          <p className='flex-[5] info-3 text-gray-500 text-sm'>
            {productToShow.productInformation}
          </p>
          <div className='flex-[7] info-4 flex flex-col items-end justify-end mt-auto'>
            <div className='discount-box flex items-center'>
              <span className='discount-rate text-xs bg-orange-600 text-white rounded-sm py-1 px-2 mr-2'>
                {productToShow.discountRate}%
              </span>
              <span className='price text-sm text-gray-400 line-through'>
                {formatPrice(productToShow.cost)}
              </span>
            </div>
            <span className='discount-price text-lg text-orange-600 font-bold font-shadow'>
              {formatPrice(productToShow.discountedPrice)}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailComponent;

const DetailOptionComponent = ({
  productToShow,
  itemCountToAdd,
  setItemCountToAdd,
  increaseQuantity,
  decreaseQuantity,
  isDetailOptionVisible,
  toggleDetailOption,
}) => {
  return (
    <div
      className={`option-footer-box fixed z-10 w-full max-w-lg transition-bottom duration-300 ${isDetailOptionVisible ? 'bottom-16' : '-bottom-48'} bg-white pb-4 px-4 left-1/2 transform -translate-x-1/2 shadow-footer`}
    >
      <button
        className='footer-box-1 fold-button w-full flex justify-center items-center bg-transparent border-none p-2'
        onClick={toggleDetailOption}
      >
        <span className='fold-icon'>
          <svg
            viewBox='0 0 1024 1024'
            xmlns='http://www.w3.org/2000/svg'
            className='w-5 h-5 fill-gray-500'
          >
            <path d='M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z'></path>
          </svg>
        </span>
      </button>
      <div className='footer-box-2 option-box flex justify-between bg-gray-200 p-4'>
        <div className='left-box flex flex-col justify-center'>
          <div className='product-name font-bold text-sm mb-2'>{productToShow.name}</div>
          <div className='quantity-control flex items-center border border-gray-300 w-20'>
            <button
              className='quantity-button w-6 h-6 bg-gray-300 flex justify-center items-center'
              onClick={decreaseQuantity}
            >
              <svg
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                className='minus w-4 h-4 stroke-current text-gray-600'
              >
                <path
                  d='M6 12L18 12'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                ></path>
              </svg>
            </button>
            <div className='quantity flex-1 text-center bg-white'>{itemCountToAdd}</div>
            <button
              className='quantity-button w-6 h-6 bg-gray-300 flex justify-center items-center'
              onClick={increaseQuantity}
            >
              <svg
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                className='plus w-4 h-4 stroke-current text-gray-600'
              >
                <path
                  d='M6 12H18M12 6V18'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className='right-box flex flex-col justify-center items-end'>
          <div className='discount-box flex items-center'>
            <span className='discount-rate text-xs bg-orange-600 text-white rounded-sm py-1 px-2 mr-2'>
              {productToShow.discountRate}%
            </span>
            <span className='price text-sm text-gray-400 line-through'>{productToShow.cost}원</span>
          </div>
          <span className='discount-price text-md font-bold'>
            {productToShow.discountedPrice}원
          </span>
        </div>
      </div>
      <div className='footer-box-3 flex justify-end items-center font-shadow mt-2'>
        <span className='discount-price text-lg text-orange-600 font-bold'>
          {itemCountToAdd > 0 ? `${productToShow.discountedPrice * itemCountToAdd} 원` : ''}
        </span>
      </div>
    </div>
  );
};

export default DetailOptionComponent;

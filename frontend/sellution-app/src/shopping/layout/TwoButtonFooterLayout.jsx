const TwoButtonFooterLayout = ({ addToCart, handleDirectOrder, isDisabled = false }) => {
  return (
    <nav className='fixed bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg h-16 bg-white flex shadow-footer px-3 py-1.5'>
      <div
        className={`footer-box flex-1 flex justify-center items-center rounded-full hover:cursor-pointer border border-solid border-[1.5px] bg-white group ${
          isDisabled ? 'border-gray-400' : 'border-primary hover:bg-primary'
        }`}
        onClick={!isDisabled ? addToCart : null}
      >
        <span
          className={`footer-text font-bold text-lg ${
            isDisabled ? 'text-gray-400' : 'text-primary group-hover:text-white'
          }`}
        >
          장바구니
        </span>
      </div>
      <div className='seperator w-5'></div>
      <div
        className={`footer-box flex-1 flex justify-center items-center rounded-full hover:cursor-pointer border border-solid border-[1.5px] bg-white group ${
          isDisabled ? 'border-gray-400' : 'border-primary hover:bg-primary'
        }`}
        onClick={!isDisabled ? handleDirectOrder : null}
      >
        <span
          className={`footer-text font-bold text-lg ${
            isDisabled ? 'text-gray-400' : 'text-primary group-hover:text-white'
          }`}
        >
          구매하기
        </span>
      </div>
    </nav>
  );
};

export default TwoButtonFooterLayout;

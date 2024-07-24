const TwoButtonFooterLayout = ({ addToCart, handleDirectOrder }) => {
  return (
    <nav className='fixed bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg h-16 bg-white flex shadow-footer px-3 py-1.5'>
      <div
        className='footer-box flex-1 bg-white border border-solid border-[1.5px] border-[#F37021] flex justify-center items-center rounded-full hover:bg-[#F37021] hover:cursor-pointer group'
        onClick={addToCart}
      >
        <span className='footer-text text-[#F37021] font-bold text-lg group-hover:text-white'>
          장바구니
        </span>
      </div>
      <div className='seperator w-5'></div>
      <div className='footer-box flex-1 bg-white hover:bg-[#F37021] group flex justify-center items-center rounded-full hover:cursor-pointer border border-solid border-[1.5px] border-[#F37021]'>
        <span
          className='footer-text text-[#F37021] group-hover:text-white font-bold text-lg'
          onClick={handleDirectOrder}
        >
          구매하기
        </span>
      </div>
    </nav>
  );
};
export default TwoButtonFooterLayout;

const TwoButtonModal = ({ isDetailPageModalVisible, onClickLeft, onClickRight }) => {
  if (!isDetailPageModalVisible) return null;
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
      <div className='bg-white rounded-lg w-80 shadow-lg'>
        <div className='bg-[#F37021] text-white font-bold text-center rounded-t-lg py-2'>알림</div>
        <div className='px-4 py-6 text-center'>
          <p className='text-sm'>
            선택하신 상품이
            <br /> 장바구니에 추가 되었습니다.
          </p>
        </div>
        <div className='flex justify-center space-x-4 pb-4'>
          <button
            onClick={onClickLeft}
            className='bg-white border border-gray-300 rounded-md py-2 px-4 shadow-md hover:bg-gray-100 text-sm'
          >
            쇼핑 계속하기
          </button>
          <button
            onClick={onClickRight}
            className='bg-white border border-gray-300 rounded-md py-2 px-4 shadow-md hover:bg-gray-100 text-sm'
          >
            장바구니 확인
          </button>
        </div>
      </div>
    </div>
  );
};
export default TwoButtonModal;

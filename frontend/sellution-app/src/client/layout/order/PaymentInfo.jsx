const PaymentInfo = ({ data }) => {
  return (
    <div className='w-full'>
      <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
        <div>결제 정보</div>
      </div>
      <div className='w-full min-w-fit h-60 px-6 border-2 border-black flex justify-between items-center'>
        <div className='relative w-full min-w-96 h-full flex-1 flex flex-col items-center'>
          <div className='absolute top-10 w-full px-4 flex justify-between items-center text-lg font-bold mb-6'>
            <div>총 주문 금액</div>
            <div>{'47,000원'}</div>
          </div>
          <div className='absolute top-28 w-full px-4 flex justify-between items-center text-base font-bold mb-6'>
            <div>총 상품 금액</div>
            <div>{'47,000원'}</div>
          </div>
          <div className='absolute top-36 w-full px-4 flex justify-between items-center text-base font-bold mb-6'>
            <div>총 배송비</div>
            <div>{'3,000원'}</div>
          </div>
          <div className='absolute top-44 w-full px-4 flex justify-between items-center text-gray-500 text-sm font-bold'>
            <div className='pl-8'>ㄴ기본 배송비</div>
            <div>{'3,000원'}</div>
          </div>
        </div>

        <div className='divider divider-horizontal'></div>

        <div className='relative w-full min-w-96 h-full flex-1 flex flex-col items-center'>
          <div className='absolute top-10 w-full px-4 flex justify-between items-center text-lg font-bold mb-6'>
            <div>총 할인 금액</div>
            <div>{'-4,700원'}</div>
          </div>
          <div className='absolute top-28 w-full px-4 flex justify-between items-center text-base font-bold mb-6'>
            <div>쿠폰 할인 금액</div>
            <div className='flex justify-center gap-2'>
              <div className='text-[10px] text-gray-500 font-medium'>{'휴면회원 할인 금액'}</div>
              <div className='text-blue-500'>{'-4,700원'}</div>
            </div>
          </div>
          <div className='absolute top-36 w-full px-4 flex justify-between items-center text-base font-bold mb-6'>
            <div>상품 할인</div>
            <div>{''}</div>
          </div>
        </div>

        <div className='divider divider-horizontal'></div>

        <div className='relative w-full min-w-96 h-full flex-1 flex flex-col items-center'>
          <div className='absolute top-10 w-full px-4 flex justify-between items-center text-lg font-bold mb-6'>
            <div>결제 금액</div>
            <div>{'46,300원'}</div>
          </div>
          <div className='absolute top-28 w-full px-4 flex justify-between items-center text-base font-bold mb-6'>
            <div>결제 방식</div>
            <div>{'CMS'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;

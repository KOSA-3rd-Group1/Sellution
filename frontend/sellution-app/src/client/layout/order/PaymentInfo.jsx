const PaymentInfo = ({ data }) => {
  console.log(data);

  return (
    <div className='w-full'>
      <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
        <div>결제 정보</div>
      </div>
      <div className='w-full min-w-fit h-60 px-6 border-2 border-black flex justify-between items-center'>
        <div className='relative w-full min-w-96 h-full flex-1 flex  flex-col items-center'>
          <div className='absolute top-10 w-full px-4 flex justify-between items-center text-lg font-bold mb-6'>
            <div>주문한 상품 금액</div>
            <div>{data?.totalProductPrice}</div>
          </div>
          <div className='absolute top-20 w-full px-4 flex justify-between items-center text-base font-bold mb-6'>
            <div className='text-blue-500'>상품 할인 금액</div>
            <div className='text-blue-500'>-{data?.totalProductDiscountPrice}</div>
          </div>
          <div className='absolute top-28 w-full px-4 flex justify-between items-center text-base font-bold mb-6'>
            <div className='text-blue-500'>쿠폰 할인 금액</div>
            <div className='text-blue-500'>-{data?.totalCouponDiscountPrice}</div>
          </div>
          <div className='absolute top-32 w-full px-4 flex justify-end items-center text-base font-bold mb-6'>
            <div>--------------------</div>
          </div>
          <div className='absolute top-40 w-full px-4 flex justify-between items-center text-base font-bold mb-6'>
            <div></div>
            <div className='text-brandOrange text-lg'>
              {data?.oneDeliveryPrice}
            </div>
          </div>
        </div>

        <div className='divider divider-horizontal'></div>

        {data?.type === 'MONTH_SUBSCRIPTION' && (
          <div className='relative w-full min-w-96 h-full flex-1 flex flex-col items-center'>
            <div className='absolute top-10 w-full px-4 flex justify-between items-center text-lg font-bold mb-6'>
              <div>다음 결제 정보</div>
            </div>
            <div className='absolute top-20 w-full px-4 flex justify-between items-center text-base font-bold mb-6'>
              <div>다음 결제일</div>
              <div className='text-blue-500'>{data?.nextDeliveryDate}</div>
            </div>
            <div className='absolute top-28 w-full px-4 flex justify-between items-center text-base font-bold mb-6'>
              <div>결제금액</div>
              <span className='text-gray-400 text-sm'>[{data?.monthStartDate} ~ {data?.monthEndDate} ] <br/>{data?.perPrice} x {data?.thisMonthDeliveryCount}회</span>
              <div className='flex justify-center gap-2'>
                <div className='text-brandOrange'>
                  {data?.monthPrice}
                </div>
              </div>
            </div>
          </div>
        )}

        {(data?.type === 'COUNT_SUBSCRIPTION' || data?.type === 'ONETIME') && (
          <div className='relative w-full min-w-96 h-full flex-1 flex  flex-col items-center'>
            <div className='absolute top-10 w-full px-4 flex justify-between items-center text-lg font-bold mb-6'>
              <div>결제금액</div>
              <div>
                <div className='text-gray-500 text-xs'>
                  [ {data?.totalDeliveryCount}회 * {data?.perPrice} ] =
                   {data?.monthExTotalPrice}
                </div>
                <div className='text-brandOrange'>{data?.totalPrice}</div>
              </div>
            </div>
          </div>
        )}

        <div className='divider divider-horizontal'></div>
      </div>
    </div>
  );
};

export default PaymentInfo;

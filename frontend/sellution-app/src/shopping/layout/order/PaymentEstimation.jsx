const PaymentEstimation = ({
  totalPrice = 0,
  productDiscountTotal = 0,
  couponDiscountTotal = 0,
  finalPrice = 0,
  monthlyPriceData = {
    thisMonthDeliveryCount: 0,
    thisMonthPrice: 0,
    totalDeliveryCount: 0,
    totalPrice: 0,
    deliveryNextDate: '',
    deliveryEndDate: '',
  },
  subscriptionType,
  selectedCount = 0,
}) => {
  return (
    <div className='mb-6 bg-white py-4 w-[90%]'>
      <span className='block py-2 mb-2 font-bold'>결제 예상 금액</span>
      <div className='space-y-2'>
        <div className='flex justify-between'>
          <span>총 상품 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        <div className='flex justify-between text-gray-500'>
          <span>상품 할인</span>
          <span>- {productDiscountTotal.toLocaleString()}원</span>
        </div>
        {couponDiscountTotal > 0 && (
          <div className='flex justify-between text-blue-500'>
            <span>쿠폰 할인</span>
            <span>- {couponDiscountTotal.toLocaleString()}원</span>
          </div>
        )}
        <div className='flex justify-between font-bold mt-2 pt-2 border-t'>
          <span>총 결제 금액 (1회분)</span>
          <span className='text-brandOrange'>
            {subscriptionType === 'COUNT'
              ? finalPrice.toLocaleString()
              : monthlyPriceData
                ? monthlyPriceData.totalPrice.toLocaleString()
                : finalPrice.toLocaleString()}
            원
          </span>
        </div>
        {subscriptionType === 'MONTH' ? (
          <div className='mt-4 space-y-2'>
            <div className='flex justify-between'>
              <span>이번 달 배송 횟수</span>
              <span>{monthlyPriceData.thisMonthDeliveryCount}회</span>
            </div>
            <div className='flex justify-between'>
              <span>이번 달 결제 금액</span>
              <span>{monthlyPriceData.thisMonthPrice.toLocaleString()}원</span>
            </div>
            <div className='flex justify-between'>
              <span>총 배송 횟수</span>
              <span>{monthlyPriceData.totalDeliveryCount}회</span>
            </div>
            <div className='flex justify-between'>
              <span>총 결제 금액</span>
              <span>{monthlyPriceData.totalPrice.toLocaleString()}원</span>
            </div>
            <div className='flex justify-between'>
              <span>다음 배송일</span>
              <span>{monthlyPriceData.deliveryNextDate}</span>
            </div>
            <div className='flex justify-between'>
              <span>배송 종료일</span>
              <span>{monthlyPriceData.deliveryEndDate}</span>
            </div>
          </div>
        ) : (
          <div className='mt-4 space-y-2'>
            <div className='flex justify-between'>
              <span>횟수</span>
              <span className='text-brandOrange'>{selectedCount.toLocaleString()}회</span>
            </div>
            <div className='flex justify-between font-bold mt-2 pt-2 border-t'>
              <span>총 결제 금액</span>
              <span className='text-brandOrange'>
                {(finalPrice * selectedCount).toLocaleString()}원
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentEstimation;

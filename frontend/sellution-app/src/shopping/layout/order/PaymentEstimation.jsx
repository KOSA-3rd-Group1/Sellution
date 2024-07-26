const PaymentEstimation = ({ totalPrice = 0, productDiscountTotal = 0, couponDiscountTotal = 0, finalPrice = 0 }) => {
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
          <span>총 결제 금액</span>
          <span className='text-brandOrange'>{finalPrice.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentEstimation;

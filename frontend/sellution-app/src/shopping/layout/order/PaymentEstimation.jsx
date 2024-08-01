import React from 'react';
import { formatPrice } from '../../../client/utility/functions/formatterFunction';
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
  perPrice = 0,
  selectedStartDate = '',
  // urlOrderType,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const getNextMonthDate = (dateString) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1);
    return date;
  };

  // const formatPrice = (price) => {
  //   return price && price !== 0 ? `${price.toLocaleString()}원` : '-';
  // };

  const formatCount = (count) => {
    return count && count !== 0 ? `${count.toLocaleString()}회` : '-';
  };

  const renderCommonInfo = () => (
    <>
      <div className='flex justify-between'>
        <span>총 상품 금액</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
      <div className='flex justify-between text-secondary'>
        <span>상품 할인</span>
        <span>{productDiscountTotal > 0 ? `- ${formatPrice(productDiscountTotal)}` : '-'}</span>
      </div>
      {couponDiscountTotal > 0 && (
        <div className='flex justify-between text-secondary'>
          <span>쿠폰 할인</span>
          <span>- {formatPrice(couponDiscountTotal)}</span>
        </div>
      )}
    </>
  );

  const renderOnetimeInfo = () => (
    <>
      {renderCommonInfo()}
      <div className='flex justify-between font-bold mt-2 pt-2 border-t'>
        <span>총 결제 금액</span>
        <span className='text-red-500'>{formatPrice(finalPrice)}</span>
      </div>
    </>
  );

  const renderCountSubscriptionInfo = () => (
    <>
      {renderCommonInfo()}
      <div className='flex justify-between font-bold mt-2 pt-2 border-t'>
        <span>배송 1회당 상품 금액</span>
        <span className='text-red-500'>{formatPrice(perPrice)}</span>
      </div>
      <div className='mt-4 space-y-2'>
        <div className='flex justify-between'>
          <span>총 배송 횟수</span>
          <span className=''>X {formatCount(selectedCount)}</span>
        </div>
        <div className='flex justify-between font-bold mt-2 pt-2 border-t'>
          <span>총 결제 금액 </span>
          <span className='text-red-500'> {formatPrice(perPrice * selectedCount)}</span>
        </div>
      </div>
    </>
  );

  const renderMonthSubscriptionInfo = () => (
    <>
      {renderCommonInfo()}
      <div className='flex justify-between font-bold mt-2 pt-2 border-t'>
        <span>배송 1회당 상품 금액</span>
        <span className='text-red-500'>{formatPrice(perPrice)}</span>
      </div>
      <br />
      <div className='mt-4 space-y-2'>
        <div className='flex justify-between'>
          <span>첫달 배송 횟수</span>
          {selectedStartDate && (
            <span className='text-gray-400'>
              {formatDate(selectedStartDate)} ~ {formatDate(getNextMonthDate(selectedStartDate))}
            </span>
          )}
          <span>{formatCount(monthlyPriceData.thisMonthDeliveryCount)}</span>
        </div>
        <div className='flex justify-between mt-2 pt-2 border-t'>
          <div className='flex gap-2'>
            <span className='font-bold'>첫달 결제 금액</span>
            {perPrice > 0 && monthlyPriceData.thisMonthDeliveryCount > 0 && (
              <span className='text-red-400 text-md'>
                [{formatPrice(perPrice)} x {formatCount(monthlyPriceData.thisMonthDeliveryCount)}] →
              </span>
            )}
          </div>
          <span className='text-red-500 font-bold'>
            {formatPrice(monthlyPriceData.thisMonthPrice)}
          </span>
        </div>
        <br />
        <div className='flex justify-between'>
          <span>구독기간 총 배송 횟수</span>
          <span>{formatCount(monthlyPriceData.totalDeliveryCount)}</span>
        </div>
        <div className='flex justify-between font-bold mt-2 pt-2 border-t'>
          <span>구독기간 결제될 총 금액</span>
          <span className='text-red-500'>{formatPrice(monthlyPriceData.totalPrice)}</span>
        </div>
        <br />
        <div className='flex justify-between '>
          <span className='font-bold'>예상 다음 배송일</span>
          <span className='font-semibold'>{formatDate(monthlyPriceData.deliveryNextDate)}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-bold'>예상 마지막 배송일</span>
          <span className='font-semibold'>{formatDate(monthlyPriceData.deliveryEndDate)}</span>
        </div>
      </div>
    </>
  );

  return (
    <div className='mb-6 bg-white py-4 w-[90%]'>
      <span className='block py-2 mb-2 font-bold'>결제 정보</span>
      <div className='space-y-2'>
        {(!subscriptionType || subscriptionType === '') && renderOnetimeInfo()}
        {subscriptionType === 'COUNT' && renderCountSubscriptionInfo()}
        {subscriptionType === 'MONTH' && renderMonthSubscriptionInfo()}
      </div>
    </div>
  );
};

export default PaymentEstimation;

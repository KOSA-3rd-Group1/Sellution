import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MenuHeaderNav from "@/shopping/layout/MenuHeaderNav.jsx";

const OrderCompletedComponent = () => {
  const [orderData, setOrderData] = useState(null);
  const { orderId } = useParams();

  const formatDayList = (dayList) => {
    const dayMap = {
      'MON': '월',
      'TUE': '화',
      'WED': '수',
      'THU': '목',
      'FRI': '금',
      'SAT': '토',
      'SUN': '일'
    };
    return dayList.map(day => dayMap[day]).join(', ');
  };

  const renderSubscriptionInfo = () => {
    if (orderData.type === 'MONTH_SUBSCRIPTION' || orderData.type === 'COUNT_SUBSCRIPTION') {
      return (
        <>
          <div className="">
            <p className='text-sm font-semibold'>배송 주기</p>
            <p className='text-base'>{orderData.selectedWeekOption}주마다</p>
          </div>
          <div className="">
            <p className='text-sm font-semibold'>배송 요일</p>
            <p className='text-base'>{formatDayList(orderData.selectedDayList)}</p>
          </div>
          {orderData.type === 'MONTH_SUBSCRIPTION' && (
            <div className="">
              <p className='text-sm font-semibold'>구독 기간</p>
              <p className='text-base'>{orderData.selectedMonthOption}개월 동안</p>
            </div>
          )}
        </>
      );
    }
    return null;
  };

  const renderDeliveryInfo = () => {
    if (orderData.type === 'ONETIME') {
      return (
        <div>
          <p className='text-sm font-semibold'>배송 예정일</p>
          <p className='text-base'>{formatDate(orderData.deliveryEndDate)}</p>
        </div>
      );
    } else {
      return (
        <>
          {renderSubscriptionInfo()}
          <div className= 'col-span-2'>
            <p className='text-sm font-semibold '>선택된 배송 시작일</p>
            <p className='text-base'>{formatDate(orderData.deliveryStartDate)}</p>
          </div>
          <div>
            <p className='text-sm font-semibold'>다음 배송 예정일</p>
            <p className='text-base'>{formatDate(orderData.nextDeliveryDate)}</p>
          </div>
          <div>
            <p className='text-sm font-semibold'>마지막 배송 예정일</p>
            <p className='text-base'>{formatDate(orderData.deliveryEndDate)}</p>
          </div>
          <div>
            <p className='text-sm font-semibold'>잔여 배송 횟수</p>
            <p className='text-base'>{orderData.remainingDeliveryCount}</p>
          </div>
          <div>
            <p className='text-sm font-semibold'>총 배송 횟수</p>
            <p className='text-base'>{orderData.totalDeliveryCount}</p>
          </div>
        </>
      );
    }
  };


  const getOrderTypeText = (type) => {
    const types = {
      'ONETIME': '단건 주문',
      'MONTH_SUBSCRIPTION': '정기 주문(월단위)',
      'COUNT_SUBSCRIPTION': '정기 주문(횟수 단위)'
    };
    return types[type] || type;
  };

  const getOrderStatusText = (type) => {
    const statuses = {
      'HOLD': '주문 승인 대기중',
      'APPROVED': '주문 승인 완료',
      'CANCEL': '주문 취소'
    };
    return statuses[type] || type;
  };

  const getDeliveryStatusText = (type) => {
    const statuses = {
      'BEFORE_DELIVERY': '배송전',
      'IN_PROGRESS': '남은 배송 진행중',
      'COMPLETE': '모든 배송 완료'
    };
    return statuses[type] || type;
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}`);
        const data = await response.json();
        setOrderData(data);
      } catch (error) {
        console.error('주문 데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (!orderData) return <div className="text-center py-10">로딩 중...</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateTotalProductPrice = () => {
    return orderData.orderedProductList.reduce((total, product) => {
      return total + Math.round(product.price * product.count * (1 - product.discountRate / 100));
    }, 0);
  };

  const calculateTotalDiscountAmount = () => {
    return orderData.orderedProductList.reduce((total, product) => {
      return total + Math.round(product.price * product.count * (product.discountRate / 100));
    }, 0);
  };

  const calculateCouponDiscountAmount = (totalProductPrice) => {
    return Math.round(totalProductPrice * (orderData.couponDiscountRate / 100));
  };

  const totalProductPrice = calculateTotalProductPrice();
  const totalDiscountAmount = calculateTotalDiscountAmount();
  const couponDiscountAmount = calculateCouponDiscountAmount(totalProductPrice);
  const finalTotalPrice = totalProductPrice - couponDiscountAmount - totalDiscountAmount;

  return (
    <div className='max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
      <MenuHeaderNav title={'주문 완료'} />
      <h1 className='text-xl font-bold text-center mb-8 text-brandOrange'>
        고객님의 주문이 완료되었습니다
      </h1>

      <div className=' p-4 rounded-lg mb-1 border-b border-t'>
        <h2 className='text-lg font-semibold mb-4'>주문 정보</h2>
        <div className='bg-gray-100 p-4 rounded-lg grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm font-semibold'>주문번호</p>
            <p className='text-base'>{orderData.orderCode}</p>
          </div>
          <div>
            <p className='text-sm font-semibold'>주문일시</p>
            <p className='text-base'>{formatDate(orderData.orderCreatedAt)}</p>
          </div>
          <div>
            <p className='text-sm font-semibold'>주문타입</p>
            <p className='text-base '>{getOrderTypeText(orderData.type)}</p>
          </div>
          <div>
            <p className='text-sm font-semibold'>주문 고객</p>
            <p className='text-base'>{orderData.customer.name}</p>
          </div>
          <div>
            <p className='text-sm font-semibold'>연락처</p>
            <p className='text-base'>{orderData.customer.phoneNumber}</p>
          </div>
          <div>
            <p className='text-sm font-semibold'>주문 상태</p>
            <p className='text-base'>{getOrderStatusText(orderData.status)}</p>
          </div>
        </div>
      </div>

      <div className=' p-4 rounded-lg mb-6 border-b '>
        <h2 className='text-lg font-semibold mb-4'>배송 정보</h2>
        <div className='bg-gray-100 p-4 rounded-lg grid grid-cols-2 gap-4'>
          <div className='col-span-2'>
            <p className='text-sm font-semibold'>배송지</p>
            <p className='text-base break-words'>
              {orderData.address.address} {orderData.address.addressDetail} (
              {orderData.address.zipcode})
            </p>
          </div>
          <div>
            <p className='text-sm font-semibold'>수령인</p>
            <p className='text-base'>{orderData.address.name}</p>
          </div>
          <div>
            <p className='text-sm font-semibold'>수령인 전화번호</p>
            <p className='text-base'>{orderData.address.phoneNumber}</p>
          </div>
          <div className='col-span-2'>
            <p className='text-sm font-semibold'>배송 상태</p>
            <p className='text-base'>{getDeliveryStatusText(orderData.deliveryStatus)}</p>
          </div>
          {renderDeliveryInfo()}
        </div>
      </div>

      <div className='mb-6'>
        <h2 className='text-xl font-semibold mb-4'>주문 상품</h2>
        {orderData.orderedProductList.map((product, index) => (
          <div key={index} className='flex items-center border-b pb-4 mb-4'>
            <img
              src={
                product.productImageList.find((img) => img.purposeOfUse === 'THUMBNAIL')?.imageUrl
              }
              alt={product.productName}
              className='w-24 h-24 object-cover mr-4 rounded-md'
            />
            <div className='flex-1'>
              <h3 className='font-semibold text-lg'>{product.productName}</h3>
              <p className='text-sm text-gray-500'>
                개당: {product.price.toLocaleString()}원 수량: {product.count}개
              </p>
              <div className='flex items-center space-x-2 mt-2'>
                <span className='line-through text-gray-400'>
                  {Math.round(product.price * product.count).toLocaleString()}원
                </span>
                <span className='text-sm text-red-500'>{product.discountRate}%</span>
                <span className='text-brandOrange font-semibold text-lg'>
                  {Math.round(
                    product.price * product.count * (1 - product.discountRate / 100),
                  ).toLocaleString()}
                  원
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='bg-gray-100 p-4 rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>결제 정보</h2>
        <div className='space-y-2'>
          <p className='flex justify-between'>
            <span>총 상품 금액</span>
            <span>{totalProductPrice.toLocaleString()}원</span>
          </p>
          <p className='flex justify-between text-red-500'>
            <span>상품 할인 금액</span>
            <span>-{totalDiscountAmount.toLocaleString()}원</span>
          </p>
          {orderData.couponName && (
            <p className='flex justify-between text-red-500'>
              <span>쿠폰 할인 ({orderData.couponName})</span>
              <span>-{couponDiscountAmount.toLocaleString()}원</span>
            </p>
          )}
          <p className='flex justify-between font-semibold text-lg border-t pt-2'>
            <span>총 결제금액</span>
            <span className='text-brandOrange'>{finalTotalPrice.toLocaleString()}원</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletedComponent;
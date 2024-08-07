import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NoBackMenuHeaderNav from '@/shopping/layout/NoBackMenuHeaderNav.jsx';

const OrderCompletedComponent = () => {
  const [orderData, setOrderData] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const handleViewPaymentHistory = () => {
    navigate(`/shopping/PocketSalad/subscription/payment-history/${orderId}`);
  };
  const formatDayList = (dayList) => {
    const dayMap = {
      MON: '월',
      TUE: '화',
      WED: '수',
      THU: '목',
      FRI: '금',
      SAT: '토',
      SUN: '일',
    };
    return dayList.map((day) => dayMap[day]).join(', ');
  };

  const getOrderTypeText = (type) => {
    const types = {
      ONETIME: '단건 주문',
      MONTH_SUBSCRIPTION: '정기 주문(월단위)',
      COUNT_SUBSCRIPTION: '정기 주문(횟수 단위)',
    };
    return types[type] || type;
  };

  const getOrderStatusText = (type) => {
    const statuses = {
      HOLD: '주문 승인 대기중',
      APPROVED: '주문 승인 완료',
      CANCEL: '주문 취소',
    };
    return statuses[type] || type;
  };

  const getDeliveryStatusText = (type) => {
    const statuses = {
      BEFORE_DELIVERY: '배송전',
      IN_PROGRESS: '남은 배송 진행중',
      COMPLETE: '모든 배송 완료',
    };
    return statuses[type] || type;
  };

  const renderSubscriptionInfo = () => {
    if (orderData.type === 'MONTH_SUBSCRIPTION' || orderData.type === 'COUNT_SUBSCRIPTION') {
      return (
        <>
          <div className=''>
            <p className='text-md font-semibold text-primary'>배송 주기</p>
            <p className='text-sm'>{orderData.selectedWeekOption}주마다</p>
          </div>
          <div className=''>
            <p className='text-md font-semibold text-primary'>배송 요일</p>
            <p className='text-sm'>{formatDayList(orderData.selectedDayList)}</p>
          </div>
          {orderData.type === 'MONTH_SUBSCRIPTION' && (
            <div className='mt-2 col-span-2'>
              <p className='text-md font-semibold text-primary'>구독 기간</p>
              <div className='text-sm flex items-center space-x-1'>
                <span>{simpleFormatDate(orderData.deliveryStartDate)}</span>
                <span>~</span>
                <span>
                  {simpleFormatDate(
                    addMonthsToDate(orderData.deliveryStartDate, orderData.selectedMonthOption),
                  )}
                </span>
                <span className='text-sm text-gray-500'>({orderData.selectedMonthOption}개월)</span>
              </div>
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
          <p className='text-md font-semibold text-black'>배송 예정일</p>
          <p className='text-sm'>{formatDate(orderData.deliveryEndDate)}</p>
        </div>
      );
    } else {
      return (
        <>
          {renderSubscriptionInfo()}
          <div className='col-span-2'>
            <p className='text-md font-semibold text-primary'>선택된 배송 시작일</p>
            <p className='text-sm'>{formatDate(orderData.deliveryStartDate)}</p>
          </div>
          <div>
            <p className='text-md font-semibold text-primary'>다음 배송 예정일</p>
            <p className='text-sm'>{formatDate(orderData.nextDeliveryDate)}</p>
          </div>
          <div>
            <p className='text-md font-semibold text-primary'>마지막 배송 예정일</p>
            <p className='text-sm'>{formatDate(orderData.deliveryEndDate)}</p>
          </div>
          <div>
            <p className='text-md font-semibold text-primary'>잔여 배송 횟수</p>
            <p className='text-sm'>{orderData.remainingDeliveryCount}</p>
          </div>
          <div>
            <p className='text-md font-semibold text-primary'>총 배송 횟수</p>
            <p className='text-sm'>{orderData.totalDeliveryCount}</p>
          </div>
        </>
      );
    }
  };

  const renderPaymentInfo = () => {
    switch (orderData.type) {
      case 'ONETIME':
        return (
          <>
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
              <span className='text-black'>{finalTotalPrice.toLocaleString()}원</span>
            </p>
            <p className='font-semibold underline text-right'>
              {orderData.paymentCount === 0 ? '주문이 승인될 때 결제됩니다.' : ''}
            </p>
          </>
        );
      case 'COUNT_SUBSCRIPTION':
        return (
          <>
            <p className='flex justify-between'>
              <span>총 상품 금액</span>
              <span>{totalProductPrice.toLocaleString()}원</span>
            </p>
            <p className='flex justify-between'>
              <span>상품 할인 금액</span>
              <span className='text-red-500'>-{totalDiscountAmount.toLocaleString()}원</span>
            </p>
            {orderData.couponName && (
              <p className='flex justify-between'>
                <span>쿠폰 할인 ({orderData.couponName})</span>
                <span className='text-red-500'>-{couponDiscountAmount.toLocaleString()}원</span>
              </p>
            )}
            <p className='flex justify-between font-semibold border-t text-lg'>
              <span>배송 1회당 상품 금액</span>
              <span className='font-semibold text-black'>
                {orderData.perPrice.toLocaleString()}원
              </span>
            </p>

            <p className='flex justify-between font-semibold text-lg border-t pt-2'>
              <span>총 결제금액</span>
              <span className='text-black'>
                {(orderData.perPrice * orderData.totalDeliveryCount).toLocaleString()}원
              </span>
            </p>
            <p className='text-xs text-gray-500 ml-2'>
              <span>
                공식 : (배송 1회당 금액 * 총 배송횟수) [{orderData.perPrice} *{' '}
                {orderData.totalDeliveryCount}]
              </span>
            </p>
            <p className='font-semibold underline text-right'>
              {orderData.paymentCount === 0 ? '주문이 승인될 때 결제됩니다.' : ''}
            </p>
          </>
        );
      case 'MONTH_SUBSCRIPTION':
        return (
          <>
            <p className='flex justify-between'>
              <span>총 상품 금액</span>
              <span>{totalProductPrice.toLocaleString()}원</span>
            </p>
            <p className='flex justify-between'>
              <span>상품 할인 금액</span>
              <span className='text-red-500'>-{totalDiscountAmount.toLocaleString()}원</span>
            </p>
            {orderData.couponName && (
              <p className='flex justify-between'>
                <span>쿠폰 할인 ({orderData.couponName})</span>
                <span className='text-red-500'>-{couponDiscountAmount.toLocaleString()}원</span>
              </p>
            )}
            <p className='flex justify-between font-semibold border-t text-lg'>
              <span>배송 1회당 상품 금액</span>
              <span className='font-semibold text-red-500'>
                {orderData.perPrice.toLocaleString()}원
              </span>
            </p>
            <p>
              <span>
                <br />
              </span>
            </p>
            {/*
             */}
            <div className='flex justify-between items-center'>
              <p className='font-semibold text-ㅡㅇ mb-4'>
                <span>다음 결제정보 </span>
              </p>
            </div>
            <p className='flex justify-between'>
              <span>다음 결제일</span>
              <span
                className={`font-semibold ${orderData.status === 'CANCEL' ? 'line-through text-gray-500' : 'text-primary'}`}
              >
                {orderData.nextPaymentDate === null
                  ? '주문이 승인될 때 결제됩니다.'
                  : formatDate(orderData.nextPaymentDate)}
              </span>
            </p>
            <p className='flex justify-between'>
              <span>결제금액</span>
              <span
                className={`font-semibold ${orderData.status === 'CANCEL' ? 'line-through text-gray-500' : 'text-black'}`}
              >
                {(orderData.thisMonthDeliveryCount * orderData.perPrice).toLocaleString()}원
              </span>
            </p>

            {orderData.status !== 'CANCEL' && (
              <p className='text-sm text-gray-500'>
                [
                {simpleFormatDate(
                  addMonthsToDate(orderData.deliveryStartDate, orderData.paymentCount),
                )}{' '}
                ~
                {simpleFormatDate(
                  addMonthsToDate(orderData.deliveryStartDate, orderData.paymentCount + 1),
                )}
                ] [{orderData.perPrice}원 * {orderData.thisMonthDeliveryCount}회]
              </p>
            )}
            <p>
              <span>
                <br />
              </span>
            </p>
            <p className='flex justify-between font-semibold text-lg border-t pt-2 text-red-500'>
              <span>구독기간 결제될 총 금액</span>
              <span className=''>
                {(orderData.totalDeliveryCount * orderData.perPrice).toLocaleString()}원
              </span>
            </p>
          </>
        );
      default:
        return null;
    }
  };

  const simpleFormatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const addMonthsToDate = (date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
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

  if (!orderData) return <div className='text-center py-10'>로딩 중...</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return ''; // 전화번호가 없는 경우 빈 문자열 반환

    // 숫자만 추출
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');

    // 정규표현식을 사용하여 형식 변경
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }

    // 매치되지 않으면 원래 값 반환
    return phoneNumber;
  };

  const calculateTotalProductPrice = () => {
    return orderData.orderedProductList.reduce((total, product) => {
      return total + Math.round(product.price * product.count);
    }, 0);
  };

  const calculateTotalDiscountAmount = () => {
    return orderData.orderedProductList.reduce((total, product) => {
      return total + Math.round(product.price * product.count * (product.discountRate / 100));
    }, 0);
  };

  const calculateCouponDiscountAmount = (totalProductPrice,totalDiscountAmount) => {
    return Math.round((totalProductPrice-totalDiscountAmount) * (orderData.couponDiscountRate / 100));
  };

  const totalProductPrice = calculateTotalProductPrice();
  const totalDiscountAmount = calculateTotalDiscountAmount();
  const couponDiscountAmount = calculateCouponDiscountAmount(totalProductPrice,totalDiscountAmount);
  const finalTotalPrice = orderData.totalPrice;

  return (
    <div className='max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
      <NoBackMenuHeaderNav title={'주문 완료'} />
      <h1 className='text-xl font-bold text-center mb-8 text-primary'>
        고객님의 주문이 완료되었습니다
      </h1>

      <div className=' p-4 rounded-lg mb-1 border-b border-t'>
        <h2 className='text-lg font-semibold mb-4'>주문 정보</h2>
        <div className='bg-gray-100 p-4 rounded-lg grid grid-cols-2 gap-4'>
          <div>
            <p className='text-md font-semibold text-black'>주문번호</p>
            <p className='text-sm'>{orderData.orderCode}</p>
          </div>
          <div>
            <p className='text-md font-semibold text-black'>주문일시</p>
            <p className='text-sm'>{formatDate(orderData.orderCreatedAt)}</p>
          </div>
          <div>
            <p className='text-md font-semibold text-black'>주문 고객</p>
            <p className='text-sm'>{orderData.customer.name}</p>
          </div>
          <div>
            <p className='text-md font-semibold text-black'>연락처</p>
            <p className='text-sm'>{formatPhoneNumber(orderData.customer.phoneNumber)}</p>
          </div>
          <div>
            <p className='text-md font-semibold text-primary'>주문타입</p>
            <p className='text-sm font-semibold'>{getOrderTypeText(orderData.type)}</p>
          </div>
          <div>
            <p className='text-md font-semibold text-primary'>주문 상태</p>
            <p className='text-sm font-semibold'>{getOrderStatusText(orderData.status)}</p>
          </div>
        </div>
      </div>

      <div className=' p-4 rounded-lg mb-6 border-b '>
        <h2 className='text-lg font-semibold mb-4'>배송 정보</h2>
        <div className=' bg-gray-100 p-4 rounded-lg grid grid-cols-2 gap-4'>
          <div className='col-span-2'>
            <p className='text-md font-semibold text-black'>배송지</p>
            <p className='text-sm break-words '>
              {orderData.address.address} {orderData.address.addressDetail} (
              {orderData.address.zipcode})
            </p>
          </div>
          <div>
            <p className='text-md font-semibold text-black'>수령인</p>
            <p className='text-sm '>{orderData.address.name}</p>
          </div>
          <div>
            <p className='text-md font-semibold text-black'>수령인 전화번호</p>
            <p className='text-sm '>{formatPhoneNumber(orderData.address.phoneNumber)}</p>
          </div>
          <div className='col-span-2'>
            <p className='text-md font-semibold text-primary'>배송 상태</p>
            <p className='text-sm font-semibold'>
              {getDeliveryStatusText(orderData.deliveryStatus)}
            </p>
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
                <span className='text-black font-semibold text-lg'>
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
        <div className='flex justify-between items-center'>
          <p className='text-lg font-semibold mb-4'>
            결제 정보
            {orderData.status === 'CANCEL' && (
              <p className='text-sm text-red-500 mt-1'>취소된 주문입니다.</p>
            )}
          </p>
          <button
            onClick={handleViewPaymentHistory}
            className='text-sm text-blue-600 hover:text-black'
          >
            결제내역보기 &gt;
          </button>
        </div>
        <div className='space-y-2'>{renderPaymentInfo()}</div>
      </div>
    </div>
  );
};

export default OrderCompletedComponent;

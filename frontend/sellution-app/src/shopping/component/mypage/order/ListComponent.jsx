import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import MenuHeaderNav from "@/shopping/layout/MenuHeaderNav.jsx";

const ListComponent = () => {
  const [orders, setOrders] = useState([]);
  const { customerId } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/orders/customers/${customerId}`,
        );
        setOrders(response.data.content);
      } catch (error) {
        console.error('주문 정보를 가져오는데 실패했습니다:', error);
      }
    };

    fetchOrders();
  }, [customerId]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy.MM.dd (HH시 mm분)');
  };

  const getOrderTypeText = (type) => {
    switch (type) {
      case 'ONETIME':
        return '단건 주문';
      case 'MONTH_SUBSCRIPTION':
        return '정기 주문(월단위)';
      case 'COUNT_SUBSCRIPTION':
        return '정기 주문(횟수 단위)';
      default:
        return type;
    }
  };

  const getOrderStatusText = (type) => {
    switch (type) {
      case 'HOLD':
        return '주문 승인 대기중';
      case 'APPROVED':
        return '주문 승인 완료';
      case 'CANCEL':
        return '주문 취소';
      default:
        return type;
    }
  };

  const getDeliveryStatusText = (type) => {
    switch (type) {
      case 'BEFORE_DELIVERY':
        return '배송전';
      case 'IN_PROGRESS':
        return '남은 배송 진행중';
      case 'COMPLETE':
        return '모든 배송 완료';
      default:
        return type;
    }
  };

  const formatDayList = (dayList) => {
    const dayMap = { MON: '월', TUE: '화', WED: '수', THU: '목', FRI: '금', SAT: '토', SUN: '일' };
    return dayList.map((day) => dayMap[day]).join(', ');
  };

  return (
    <div className='p-4'>
      <MenuHeaderNav title={'주문 목록'} />
      {/*<h1 className='text-2xl font-bold mb-4'>주문 목록</h1>*/}
      {orders.map((order) => (
        <div key={order.orderCode} className='mb-6 p-4 border rounded shadow'>
          <div className='flex justify-between items-center gap-8 mb-2'>
            <span className='font-bold '>{formatDate(order.orderCreatedAt)}</span>
            <button className='text-gray-500 text-sm'>주문상세 &gt;</button>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>주문번호</div>
            <div>{order.orderCode}</div>
            <div>주문타입</div>
            <div>{getOrderTypeText(order.type)}</div>
            <div>결제방법</div>
            <div>CMS</div>
            <div>
              {order.type === 'MONTH_SUBSCRIPTION' ? (
                <>
                  구독 기간 동안<br />결제될 총 금액
                </>
              ) : '결제금액'}
            </div>
            <div className='flex items-center'>{order.totalPrice}원</div>
            <div>주문상태</div>
            <div>{getOrderStatusText(order.status)}</div>
            <div>배송상태</div>
            <div>{getDeliveryStatusText(order.deliveryStatus)}</div>
            {(order.type === 'COUNT_SUBSCRIPTION' || order.type === 'MONTH_SUBSCRIPTION') && (
              <>
                <div>남은 배송횟수</div>
                <div>
                  {order.remainingDeliveryCount}회 ({order.remainingDeliveryCount}/
                  {order.totalDeliveryCount})
                </div>
                <div>배송주기</div>
                <div>
                  {order.selectedWeekOption}주 간격 / {formatDayList(order.selectedDayList)}
                </div>
              </>
            )}
            {(order.type === 'COUNT_SUBSCRIPTION' || order.type === 'MONTH_SUBSCRIPTION') && (
              <>
                <div>다음 배송일정</div>
                <div>{order.nextDeliveryDate}</div>
              </>
            )}
            {(order.type === 'COUNT_SUBSCRIPTION' || order.type === 'MONTH_SUBSCRIPTION') && (
              <>
                <div>마지막 배송일정</div>
                <div>{order.deliveryEndDate}</div>
              </>
            )}
            {order.type === 'ONETIME' && (
              <>
                <div>배송일정</div>
                <div>{order.deliveryEndDate}</div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListComponent;
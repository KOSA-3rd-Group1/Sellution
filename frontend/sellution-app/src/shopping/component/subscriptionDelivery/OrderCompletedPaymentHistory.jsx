import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MenuHeaderNav from '@/shopping/layout/MenuHeaderNav.jsx';
import LoadingSpinner from './../../layout/LoadingSpinner';
const PaymentHistoryList = () => {
  const [paymentHistoryData, setPaymentHistoryData] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchPaymentHistoryData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/payment-histories/orders/${orderId}`,
        );

        setPaymentHistoryData(response.data);
      } catch (error) {
        console.error('Failed to fetch payment history data:', error);
      }
    };

    fetchPaymentHistoryData();
  }, [orderId]);

  const getOrderTypeText = (type) => {
    const types = {
      ONETIME: '단건 주문',
      MONTH_SUBSCRIPTION: '정기 주문(월단위)',
      COUNT_SUBSCRIPTION: '정기 주문(횟수 단위)',
    };
    return types[type] || type;
  };

  const getStatusText = (status) => {
    const statuses = {
      COMPLETE: '결제완료',
      PENDING: '결제실패',
      CANCEL: '결제취소',
    };
    return statuses[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '날짜 정보 없음';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return '계좌 정보 없음';
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  if (!paymentHistoryData) return <LoadingSpinner />;

  return (
    <div className='p-4'>
      <MenuHeaderNav title={'결제내역'} />
      {paymentHistoryData.content.map((payment, index) => (
        <div key={payment.paymentHisoryId} className='mb-6 p-4 border rounded shadow'>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>결제일시</div>
            <div>{formatDate(payment.paymentDate)}</div>

            <div>주문타입</div>
            <div>{getOrderTypeText(payment.orderType)}</div>

            <div>결제상태</div>
            <div>{getStatusText(payment.status)}</div>

            {payment.status === 'COMPLETE' &&
              payment.remainingPayCount != null &&
              payment.totalCountForPayment != null && (
                <>
                  <div>남은 결제횟수</div>
                  <div>
                    {payment.remainingPayCount} / {payment.totalCountForPayment}
                  </div>
                </>
              )}

            <div>계좌번호</div>
            <div>{maskAccountNumber(payment.accountNumber)}</div>

            {payment.orderType === 'MONTH_SUBSCRIPTION' &&
              (payment.status === 'COMPLETE' || payment.status === 'CANCEL') &&
              payment.thisSubMonthStartDate &&
              payment.thisSubMonthEndDate && (
                <>
                  <div>
                    {payment.status === 'COMPLETE' ? '결제된 구독기간' : '결제취소된 구독기간'}
                  </div>
                  <div>
                    {payment.thisSubMonthStartDate} ~ {payment.thisSubMonthEndDate}
                  </div>
                </>
              )}

            <div>{payment.status === 'CANCEL' ? '환불금액' : '결제금액'}</div>
            <div>
              {payment.price != null ? `${payment.price.toLocaleString()}원` : '금액 정보 없음'}
              {payment.orderType === 'MONTH_SUBSCRIPTION' &&
                payment.deliveryPerPrice != null &&
                payment.thisMonthDeliveryCount != null && (
                  <div className='text-xs text-gray-500 mt-1'>
                    (1회 배송 가격: {payment.deliveryPerPrice.toLocaleString()}원 x{' '}
                    {payment.thisMonthDeliveryCount}회)
                  </div>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentHistoryList;

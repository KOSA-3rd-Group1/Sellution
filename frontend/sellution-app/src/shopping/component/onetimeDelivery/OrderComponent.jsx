import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MenuHeaderNav from '../../layout/MenuHeaderNav';
import OneButtonFooterLayout from '../../layout/OneButtonFooterLayout';
import CouponSelection from '../../layout/order/CouponSelection';
import DeliverySelection from '../../layout/order/DeliverySelection';
import PaymentEstimation from '../../layout/order/PaymentEstimation';
import PaymentMethodSelection from '../../layout/order/PaymentMethodSelection';
import OrderListLayout from '../../layout/OrderListLayout';
import useOrderListStore from './../../store/stores/useOrderListStore';
import { useEffect, useState } from 'react';
import axios from 'axios';

const OrderComponent = () => {
  const navigate = useNavigate();
  const { orderList } = useOrderListStore();
  const { clientName, customerId } = useParams();
  const location = useLocation();

  // 목록 선택
  const listToShow = orderList;
  // 배송지
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  // 결제정보
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, bank: 'KB국민은행', accountNumber: '123*****987', isChecked: true },
  ]);

  const handleAddressChange = () => {
    navigate(`/shopping/${clientName}/ordersheet/setting/address/${customerId}`, {
      state: { returnToOrder: true },
    });
  };

  const handleAddPaymentMethod = () => {
    navigate(`/shopping/${clientName}/ordersheet/setting/payment`);
  };

  const handleCheckChange = (id) => {
    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === id ? { ...method, isChecked: !method.isChecked } : method,
      ),
    );
  };

  const handleDeleteAccount = (id) => {
    if (window.confirm('해당 계좌를 삭제하시겠습니까?')) {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    }
  };

  const checkForSavedAddress = () => {
    console.log('Checking for saved address');
    const savedAddress = localStorage.getItem('selectedAddress');
    if (savedAddress) {
      console.log('Found saved address:', savedAddress);
      setSelectedAddress(JSON.parse(savedAddress));
      localStorage.removeItem('selectedAddress');
    }
  };

  //api
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/addresses/customer/${customerId}`,
      );
      setAddresses(response.data);
      if (!selectedAddress) {
        const defaultAddress = response.data.find((addr) => addr.isDefaultAddress === 'Y');
        setSelectedAddress(defaultAddress || null);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  //useEffect
  useEffect(() => {
    console.log('OrderComponent mounted');
    const fetchData = async () => {
      await fetchAddresses();
      checkForSavedAddress();
    };
    fetchData();
    return () => {
      console.log('OrderComponent unmounted');
    };
  }, [customerId]);

  useEffect(() => {
    if (location.state && location.state.selectedAddress) {
      console.log('Setting address from location state:', location.state.selectedAddress);
      setSelectedAddress(location.state.selectedAddress);
    }
  }, [location]);

  return (
    <>
      <MenuHeaderNav title={'주문 / 결제'} />
      <div className='flex flex-col items-center w-full'>
        <OrderListLayout listToShow={listToShow} />
        <div className='seperator w-full h-4 bg-gray-100'></div>
        {/* 배송지 */}
        <DeliverySelection
          addresses={addresses}
          selectedAddress={selectedAddress}
          handleAddressChange={handleAddressChange}
        />
        <div className='seperator w-full h-4 bg-gray-100'></div>
        {/* 할인쿠폰 */}
        <CouponSelection />
        <div className='seperator w-full h-4 bg-gray-100'></div>
        {/* 결제 예상 금액 */}
        <PaymentEstimation />
        <div className='seperator w-full h-4 bg-gray-100'></div>
        {/* 결제 정보 */}
        <PaymentMethodSelection
          paymentMethods={paymentMethods}
          handleCheckChange={handleCheckChange}
          handleDeleteAccount={handleDeleteAccount}
          handleAddPaymentMethod={handleAddPaymentMethod}
        />
      </div>
      <OneButtonFooterLayout footerText={'결제하기'} />
    </>
  );
};

export default OrderComponent;

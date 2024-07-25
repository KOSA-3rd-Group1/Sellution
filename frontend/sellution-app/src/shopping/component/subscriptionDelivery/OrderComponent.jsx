import MenuHeaderNav from '../../layout/MenuHeaderNav';
import useOrderListStore from './../../store/stores/useOrderListStore';
import OneButtonFooterLayout from './../../layout/OneButtonFooterLayout';
import OrderListLayout from '../../layout/OrderListLayout';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import DeliverySelection from '../../layout/order/DeliverySelection';
import SubscriptionDeliverySetting from '../../layout/order/SubscriptionDeliverySetting';
import CouponSelection from '../../layout/order/CouponSelection';
import PaymentEstimation from '../../layout/order/PaymentEstimation';
import PaymentMethodSelection from '../../layout/order/PaymentMethodSelection';
import useUserInfoStore from '@/shopping/store/stores/useUserInfoStore';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';

const OrderComponent = () => {
  const navigate = useNavigate();
  const { orderList } = useOrderListStore();
  const clientName = useCompanyInfoStore((state) => state.name);
  const customerId = useUserInfoStore((state) => state.id);
  const location = useLocation();
  //목록 선택
  const listToShow = orderList;

  // 배송지
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  //정기주문
  const [subscriptionType, setSubscriptionType] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayValues, setDayValues] = useState([]);
  const [weekValues, setWeekValues] = useState([]);
  const [monthValues, setMonthValues] = useState([]);
  const [minDeliveryCount, setMinDeliveryCount] = useState(0);
  const [maxDeliveryCount, setMaxDeliveryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  //결제정보
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, bank: 'KB국민은행', accountNumber: '123*****987', isChecked: true },
  ]);
  //쿠폰정보
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const handleAddressChange = () => {
    navigate(`/shopping/${clientName}/ordersheet/setting/address/${customerId}`, {
      state: { returnToOrder: true },
    });
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

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
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

  const handleCouponChange = (e) => {
    const selected = coupons.find((coupon) => coupon.id === e.target.value);
    setSelectedCoupon(selected);
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
      console.log('fetch한 주소: ', addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };
  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/coupons`);
      setCoupons(response.data.content);
      console.log('fetch한 쿠폰: ', coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };
  const fetchSaleSettings = async () => {
    try {
      const response = await axios.get('http://localhost:8080/sale-setting/1');
      console.log('여기', response.data);
      setSubscriptionType(response.data.subscriptionType);
      setDayValues(response.data.dayValues || []);
      setWeekValues(response.data.weekValues || []);
      setMonthValues(response.data.monthValues || []);
      setMinDeliveryCount(response.data.minDeliveryCount || 0);
      setMaxDeliveryCount(response.data.maxDeliveryCount || 0);
      setIsLoading(false);
      console.log(
        'fetch한 setting',
        subscriptionType,
        dayValues,
        weekValues,
        monthValues,
        minDeliveryCount,
        maxDeliveryCount,
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // 첫 번째 useEffect: 컴포넌트 마운트 시 주소 가져오기
  useEffect(() => {
    console.log('OrderComponent mounted');
    const fetchData = async () => {
      await fetchAddresses();
      await fetchCoupons();
      await fetchSaleSettings();
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

        {/* 정기 배송 설정 섹션 */}
        <SubscriptionDeliverySetting
          selectedDays={selectedDays}
          toggleDay={toggleDay}
          dayValues={dayValues}
          weekValues={weekValues}
          minDeliveryCount={minDeliveryCount}
          maxDeliveryCount={maxDeliveryCount}
          monthValues={monthValues}
          subscriptionType={subscriptionType}
          isLoading={isLoading}
        />
        <div className='seperator w-full h-4 bg-gray-100'></div>
        {/* coupon */}
        <CouponSelection
          handleCouponChange={handleCouponChange}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
        />
        <div className='seperator w-full h-4 bg-gray-100'></div>
        {/* 결제 예상 금액 */}
        {/* selectedCoupon 가격 만큼 빼기 */}
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
      {/*  */}
      <OneButtonFooterLayout footerText={'결제하기'} />
    </>
  );
};

export default OrderComponent;

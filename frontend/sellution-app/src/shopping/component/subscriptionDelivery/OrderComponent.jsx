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
import { getMyCouponList } from '@/shopping/utility/apis/mypage/coupon/couponApi';
import useAuthStore from '@/shopping/store/stores/useAuthStore';
const OrderComponent = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const { orderList } = useOrderListStore();
  const clientName = useCompanyInfoStore((state) => state.name);
  const customerId = useUserInfoStore((state) => state.id);
  const location = useLocation();
  const companyId = useCompanyInfoStore((state) => state.companyId);

  //목록 선택
  const listToShow = orderList;
  // 배송지
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  //정기주문
  const [selectedStartDate, setSelectedStartDate] = useState(''); // 추가
  const [subscriptionType, setSubscriptionType] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayValues, setDayValues] = useState([]);
  const [weekValues, setWeekValues] = useState([]);
  const [monthValues, setMonthValues] = useState([]);
  const [minDeliveryCount, setMinDeliveryCount] = useState(0);
  const [maxDeliveryCount, setMaxDeliveryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyPriceData, setMonthlyPriceData] = useState({
    thisMonthDeliveryCount: 0,
    thisMonthPrice: 0,
    totalDeliveryCount: 0,
    totalPrice: 0,
    deliveryNextDate: '',
    deliveryEndDate: '',
  });

  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedCount, setSelectedCount] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  //결제정보
  const [paymentMethods, setPaymentMethods] = useState([]);

  //쿠폰정보
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  //결제금액
  const [totalPrice, setTotalPrice] = useState(0);
  const [productDiscountTotal, setProductDiscountTotal] = useState(0); //상품 할인 금액
  const [couponDiscountTotal, setCouponDiscountTotal] = useState(0); // 쿠폰 할인 금액
  const [finalPrice, setFinalPrice] = useState(0);

  const BANK_CODES = {
    '004': '국민은행',
    '090': '카카오뱅크',
    '088': '신한은행',
    '020': '우리은행',
    '003': '기업은행',
    '092': '토스뱅크',
    '071': '우체국은행',
    '011': '농협은행',
    '081': '하나은행',
  };

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

  const handleCouponChange = (e) => {
    const selected = coupons.find((coupon) => coupon.id === e.target.value);
    console.log('쿠폰: ', selected);
    setSelectedCoupon(selected);
    calculateTotalPrice();
  };

  const handleAddPaymentMethod = () => {
    saveState(); // 현재 상태 저장
    console.log('이동전 경로 : ', location.pathname);
    navigate(`/shopping/${clientName}/my/${customerId}/payment/add`, {
      state: { returnUrl: location.pathname },
    });
  };

  const handleCheckChange = (id) => {
    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === id ? { ...method, isChecked: true } : { ...method, isChecked: false },
      ),
    );
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm('해당 계좌를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/accounts/${id}`);
        setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
        alert('계좌가 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('계좌 삭제에 실패했습니다:', error);
        alert('계좌 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 계좌번호 마스킹 함수
  const maskAccountNumber = (accountNumber) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  //월별 결제 >> 결제금액 계산 함수
  const calculateMonthlyPrice = async () => {
    try {
      const response = await axios.post('http://localhost:8080/orders/month/calculate-price', {
        selectedDays: selectedDays,
        weekOptionValue: selectedWeek.value,
        monthOptionValue: selectedMonth.value,
        perPrice: finalPrice,
        startDate: selectedStartDate,
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating monthly price:', error);
      return null;
    }
  };

  // 결제금액 계산
  const calculateTotalPrice = async () => {
    const total = listToShow.reduce((sum, item) => sum + item.cost * item.quantity, 0);
    const productDiscountTotal = listToShow.reduce(
      (sum, item) => sum + (item.cost - item.discountedPrice) * item.quantity,
      0,
    );
    const couponDiscountTotal = selectedCoupon
      ? Math.floor(
          listToShow.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0) *
            (selectedCoupon.couponDiscountRate / 100),
        )
      : 0;

    setTotalPrice(total);
    setProductDiscountTotal(productDiscountTotal);
    setCouponDiscountTotal(couponDiscountTotal);
    setFinalPrice(total - productDiscountTotal - couponDiscountTotal);

    if (
      subscriptionType === 'MONTH' &&
      selectedStartDate &&
      selectedWeek &&
      selectedMonth &&
      selectedDays.length > 0
    ) {
      const monthlyPriceData = await calculateMonthlyPrice();
      if (monthlyPriceData) {
        setMonthlyPriceData(monthlyPriceData);
      }
    } else {
      setMonthlyPriceData({
        thisMonthDeliveryCount: 0,
        thisMonthPrice: 0,
        totalDeliveryCount: 0,
        totalPrice: 0,
        deliveryNextDate: '',
        deliveryEndDate: '',
      });
    }
  };

  //유효성 검사 함수
  const validateForm = () => {
    const isSubscriptionValid =
      (subscriptionType === 'COUNT' && selectedCount !== null && selectedCount !== '') ||
      (subscriptionType === 'MONTH' && selectedMonth !== null && selectedMonth !== '');

    return (
      selectedStartDate !== null &&
      selectedStartDate !== '' &&
      selectedAddress !== null &&
      selectedAddress !== '' &&
      selectedWeek !== null &&
      selectedWeek !== '' &&
      selectedDays.length > 0 && // 빈 배열 체크
      isSubscriptionValid &&
      paymentMethods.some((method) => method.isChecked)
    );
  };

  const isOrderButtonDisabled = !validateForm();

  //주문 데이터 생성 (결제하기 버튼)
  const handleOrderClick = async () => {
    if (isOrderButtonDisabled) return;

    const orderedProducts = listToShow.map((item) => ({
      productId: item.id,
      count: item.quantity,
      price: item.discountedPrice || item.cost,
      discountRate: item.discountRate || 0,
    }));

    const saveOrderReq = {
      companyId: companyId, // 회사 ID
      addressId: selectedAddress.addressId, // 주소 ID
      accountId: paymentMethods.find((method) => method.isChecked).id, // 결제 수단 ID
      eventId: selectedCoupon ? selectedCoupon.id : null, // 쿠폰 ID (선택 사항)
      monthOptionId: selectedMonth ? selectedMonth.id : null, // 월 옵션 ID (선택 사항)
      weekOptionId: selectedWeek ? selectedWeek.id : null, // 주 옵션 ID (선택 사항)
      orderType: subscriptionType === 'COUNT' ? 'COUNT_SUBSCRIPTION' : 'MONTH_SUBSCRIPTION', // 주문 타입
      totalDeliveryCount: selectedCount, // 총 배송 횟수 (선택 사항)
      deliveryStartDate: selectedStartDate, // 배송 시작일
      orderedProducts: orderedProducts, // 주문한 상품들
      dayOptionIds: selectedDays.map((day) => dayValues.find((d) => d.value === day).id), // 선택된 요일들 ID
    };

    console.log('주문 보내는 양식: ', saveOrderReq);
    if (subscriptionType === 'MONTH' && monthlyPriceData) {
      saveOrderReq.thisMonthDeliveryCount = monthlyPriceData.thisMonthDeliveryCount;
      saveOrderReq.thisMonthPrice = monthlyPriceData.thisMonthPrice;
      saveOrderReq.totalDeliveryCount = monthlyPriceData.totalDeliveryCount;
      saveOrderReq.totalPrice = monthlyPriceData.totalPrice;
      saveOrderReq.deliveryNextDate = monthlyPriceData.deliveryNextDate;
      saveOrderReq.deliveryEndDate = monthlyPriceData.deliveryEndDate;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/orders/customers/${customerId}`,
        saveOrderReq,
      );
      if (response.data.startsWith('success')) {
        const savedOrderId = response.data.split('success, 생성된 주문 아이디 : ')[1];
        localStorage.removeItem('orderState'); // 주문 완료 후 저장된 상태 제거
        navigate(`/shopping/${clientName}/subscription/order-completed/${savedOrderId}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('주문 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
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
        setSelectedAddress(defaultAddress || response.data[0] || null);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await getMyCouponList(accessToken, setAccessToken);
      setCoupons(response.data.content || []); // 페이지 응답에서 내용 추출
      console.log('fetch한 쿠폰: ', response.data);
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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchAccounts = async () => {
    if (!customerId) {
      console.error('customerId가 없습니다.');
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/accounts/customers/${customerId}`,
      );
      const accounts = response.data.content.map((account) => ({
        id: account.accountId,
        bank: BANK_CODES[account.bankCode] || '알 수 없는 은행',
        accountNumber: maskAccountNumber(account.accountNumber),
        bankCode: account.bankCode,
        isChecked: false,
      }));
      console.log('fetch한 account: ', customerId, accounts);
      setPaymentMethods(accounts);
    } catch (error) {
      console.error('계좌 정보를 가져오는 데 실패했습니다:', error);
    }
  };

  // 첫 번째 useEffect: 컴포넌트 마운트 시 주소 가져오기
  useEffect(() => {
    console.log('OrderComponent mounted');
    const fetchData = async () => {
      await fetchAddresses();
      await fetchCoupons();
      await fetchSaleSettings();
      await fetchAccounts();
      checkForSavedAddress();
      restoreState();
      calculateTotalPrice(); // 기본값 설정을 위해 초기 호출
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

  useEffect(() => {
    calculateTotalPrice();
    console.log('계산 변경: ', selectedCoupon);
  }, [selectedCoupon, orderList, selectedStartDate, selectedWeek, selectedMonth, selectedDays]);

  // 상태 저장 함수
  const saveState = () => {
    const stateToSave = {
      // selectedAddress,
      selectedCoupon,
      selectedStartDate,
      subscriptionType,
      selectedDays,
      selectedWeek,
      selectedCount,
      selectedMonth,
    };
    localStorage.setItem('orderState', JSON.stringify(stateToSave));
  };

  // 상태 복원 함수
  const restoreState = () => {
    const savedState = localStorage.getItem('orderState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // setSelectedAddress(parsedState.selectedAddress);
      setSelectedCoupon(parsedState.selectedCoupon);
      setSelectedStartDate(parsedState.selectedStartDate);
      setSubscriptionType(parsedState.subscriptionType);
      setSelectedDays(parsedState.selectedDays);
      setSelectedWeek(parsedState.selectedWeek);
      setSelectedCount(parsedState.selectedCount);
      setSelectedMonth(parsedState.selectedMonth);
    }
  };

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
          setSelectedWeek={setSelectedWeek}
          selectedWeek={selectedWeek}
          setSelectedCount={setSelectedCount}
          selectedCount={selectedCount}
          setSelectedMonth={setSelectedMonth}
          selectedMonth={selectedMonth}
          selectedStartDate={selectedStartDate}
          setSelectedStartDate={setSelectedStartDate}
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
        <PaymentEstimation
          totalPrice={totalPrice}
          productDiscountTotal={productDiscountTotal}
          couponDiscountTotal={couponDiscountTotal}
          finalPrice={finalPrice}
          monthlyPriceData={monthlyPriceData}
          subscriptionType={subscriptionType}
          selectedCount={selectedCount}
          perPrice={finalPrice}
        />
        <div className='seperator w-full h-4 bg-gray-100'></div>
        {/* 결제 정보 */}
        <PaymentMethodSelection
          paymentMethods={paymentMethods}
          handleCheckChange={handleCheckChange}
          handleDeleteAccount={handleDeleteAccount}
          handleAddPaymentMethod={handleAddPaymentMethod}
          subscriptionType={subscriptionType}
        />
      </div>
      {/*  */}
      <OneButtonFooterLayout
        footerText={'결제하기'}
        onClick={handleOrderClick}
        isDisabled={isOrderButtonDisabled}
      />
    </>
  );
};

export default OrderComponent;

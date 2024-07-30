import { useLocation, useNavigate } from 'react-router-dom';
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
import useUserInfoStore from '@/shopping/store/stores/useUserInfoStore';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import useAuthStore from "@/shopping/store/stores/useAuthStore.js";
import { getMyCouponList } from "@/shopping/utility/apis/mypage/coupon/couponApi.js";

const OrderComponent = () => {
  const navigate = useNavigate();
  const { orderList } = useOrderListStore();
  const clientName = useCompanyInfoStore((state) => state.name);
  const customerId = useUserInfoStore((state) => state.id);
  const location = useLocation();
  const companyId = useCompanyInfoStore((state) => state.companyId);
  // 목록 선택
  const listToShow = orderList;
  // 배송지
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  // 결제정보
  const [paymentMethods, setPaymentMethods] = useState([]);
  //쿠폰정보
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  //결제금액
  const [totalPrice, setTotalPrice] = useState(0);
  const [productDiscountTotal, setProductDiscountTotal] = useState(0); //상품 할인 금액
  const [couponDiscountTotal, setCouponDiscountTotal] = useState(0); // 쿠폰 할인 금액
  const [finalPrice, setFinalPrice] = useState(0);

  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [orderData, setOrderData] = useState(null);

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
  const handleCouponChange = (e) => {
    const selected = coupons.find((coupon) => coupon.id === e.target.value);
    console.log('쿠폰: ', selected);
    setSelectedCoupon(selected);
    calculateTotalPrice();
  };

  const handleAddPaymentMethod = () => {
    navigate(`/shopping/${clientName}/my/customerId/payment/add`);
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

  // 결제금액 계산
  const calculateTotalPrice = () => {
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

    console.log('total price', total);
    console.log('product discount total', productDiscountTotal);
    console.log('coupon discount total', couponDiscountTotal);

    setTotalPrice(total);
    setProductDiscountTotal(productDiscountTotal);
    setCouponDiscountTotal(couponDiscountTotal);
    setFinalPrice(total - productDiscountTotal - couponDiscountTotal);
  };

  //유효성 검사 함수
  const validateForm = () => {
    return (
      selectedAddress !== null &&
      selectedAddress !== '' &&
      paymentMethods.some((method) => method.isChecked)
    );
  };

  const isOrderButtonDisabled = !validateForm();

  const handleOrderClick = async () => {
    if (isOrderButtonDisabled) return;

    const orderedProducts = listToShow.map((item) => ({
      productId: item.id,
      count: item.quantity,
      price: item.discountedPrice || item.cost,
      discountRate: item.discountRate || 0,
    }));

    const orderData = {
      companyId: companyId,
      addressId: selectedAddress.addressId,
      accountId: paymentMethods.find((method) => method.isChecked).id,
      eventId: selectedCoupon ? selectedCoupon.id : null,
      monthOptionId: null,
      weekOptionId: null,
      orderType: 'ONETIME',
      totalDeliveryCount: null,
      deliveryStartDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orderedProducts: orderedProducts,
      dayOptionIds: null,
    };

    // 비밀번호 인증 페이지로 이동하면서 주문 데이터 전달
    navigate(`/shopping/${clientName}/ordersheet/auth/${customerId}`, {
      state: { orderData: orderData }
    });
  };


  useEffect(() => {
    if (isPasswordVerified && orderData) {
      completeOrder();
    }
  }, [isPasswordVerified, orderData]);

  useEffect(() => {
    if (location.state && location.state.passwordVerified) {
      setIsPasswordVerified(true);
    }
  }, [location]);

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
      const response = await getMyCouponList(setAccessToken,accessToken);
      setCoupons(response.data.content);
      console.log('fetch한 쿠폰1: ', coupons);
      console.log('fetch한 쿠폰2: ', response);
    } catch (error) {
      console.error('Error fetching coupons:', error);
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

  //useEffect
  useEffect(() => {
    console.log('OrderComponent mounted');
    const fetchData = async () => {
      await fetchAddresses();
      await fetchCoupons();
      await fetchAccounts();
      await fetchAccounts();
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

  useEffect(() => {
    calculateTotalPrice();
    console.log('계산 변경: ', selectedCoupon);
  }, [selectedCoupon, orderList]);

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
        {/* coupon */}
        <CouponSelection
          handleCouponChange={handleCouponChange}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
        />
        <div className='seperator w-full h-4 bg-gray-100'></div>
        {/* 결제 예상 금액 */}
        <PaymentEstimation
          totalPrice={totalPrice}
          productDiscountTotal={productDiscountTotal}
          couponDiscountTotal={couponDiscountTotal}
          finalPrice={finalPrice}
        />
        <div className='seperator w-full h-4 bg-gray-100'></div>
        {/* 결제 정보 */}
        <PaymentMethodSelection
          paymentMethods={paymentMethods}
          handleCheckChange={handleCheckChange}
          handleDeleteAccount={handleDeleteAccount}
          handleAddPaymentMethod={handleAddPaymentMethod}
        />
      </div>
      <OneButtonFooterLayout
        footerText={'결제하기'}
        onClick={handleOrderClick}
        isDisabled={isOrderButtonDisabled}
      />
      {/*<OneButtonFooterLayout*/}
      {/*  footerText={'결제하기'}*/}
      {/*  onClick={handleOrderClick}*/}
      {/*  isDisabled={isOrderButtonDisabled}*/}
      {/*/>*/}
    </>
  );
};

export default OrderComponent;
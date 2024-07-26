import { useState, useEffect } from 'react';
import useUserInfoStore from '@/shopping/store/stores/useUserInfoStore';
import axios from 'axios';
import {
  KookminBankIcon,
  KakaoBankIcon,
  ShinhanBankIcon,
  WooriBankIcon,
  IBKIcon,
  TossBankIcon,
  PostBankIcon,
  NonghyupBankIcon,
  HanaBankIcon,
} from '@/client/utility/assets/BankIcons.jsx';
import { AccountAuthCheckIcon } from '@/shopping/utility/assets/Icons.jsx';
import OneButtonFooterLayout from '@/shopping/layout/OneButtonFooterLayout.jsx';
import MenuHeaderNav from '@/shopping/layout/MenuHeaderNav.jsx';

const BANK_INFO = [
  { code: '004', name: '국민은행', icon: KookminBankIcon },
  { code: '090', name: '카카오뱅크', icon: KakaoBankIcon },
  { code: '088', name: '신한은행', icon: ShinhanBankIcon },
  { code: '020', name: '우리은행', icon: WooriBankIcon },
  { code: '003', name: '기업은행', icon: IBKIcon },
  { code: '092', name: '토스뱅크', icon: TossBankIcon },
  { code: '071', name: '우체국', icon: PostBankIcon },
  { code: '011', name: '농협은행', icon: NonghyupBankIcon },
  { code: '081', name: '하나은행', icon: HanaBankIcon },
];

const AddComponent = () => {
  const customerId = useUserInfoStore((state) => state.id);
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    const fetchCustomerName = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/customers/${customerId}`,
        );
        setCustomerName(response.data.name);
      } catch (error) {
        console.error('Failed to fetch customer name:', error);
      }
    };

    fetchCustomerName();
  }, [customerId]);

  const handleBankSelect = (bankCode) => {
    setSelectedBank(bankCode);
  };

  const handleAccountAuth = async (e) => {
    e.preventDefault();
    if (!selectedBank || !accountNumber) {
      setAuthMessage('은행과 계좌번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/accounts/auth/check-account`,
        {
          bankCode: selectedBank,
          accountNumber: accountNumber,
        },
      );

      if (response.data.bankHolderName === customerName) {
        setIsAuthenticated(true);
        setAuthMessage('계좌 인증에 성공했습니다.');
      } else {
        setAuthMessage('계좌 명의가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('Account authentication failed:', error);
      setAuthMessage('계좌 인증에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className='p-4 max-w-md mx-auto'>
      <MenuHeaderNav title={'결제수단 등록'} />
      {/*<h1 className="text-2xl font-bold mb-4">결제 수단 등록</h1>*/}

      <div className='mb-6'>
        <h2 className='text-lg font-semibold mb-2'>
          <span className='text-brandOrange mr-1'>*</span>
          은행 선택
        </h2>
        <div className='grid grid-cols-3 gap-4'>
          {BANK_INFO.map((bank) => (
            <button
              key={bank.code}
              className={`p-2 border rounded-lg flex flex-col items-center justify-center ${
                selectedBank === bank.code ? 'border-brandOrange' : 'border-gray-300'
              }`}
              onClick={() => handleBankSelect(bank.code)}
            >
              <bank.icon className='w-10 h-10 mb-1' />
              <span className='text-xs'>{bank.name}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleAccountAuth}>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold mb-2'>
            <span className='text-brandOrange mr-1'>*</span>
            계좌 번호 입력
          </h2>
          <div className='mb-2'>
            <label className='block text-sm font-medium text-gray-700'>이름</label>
            <input
              type='text'
              className='w-full p-2 bg-gray-100 border border-gray-300 rounded'
              value={customerName}
              disabled
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>계좌번호</label>
            <input
              type='text'
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='계좌번호를 입력해주세요.'
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </div>
        </div>

        <div className='flex items-center justify-center'>
          <button
            type='submit'
            className='bg-brandOrange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300'
          >
            계좌 인증하기
          </button>
          {isAuthenticated && <AccountAuthCheckIcon className='text-green-500 w-6 h-6' />}
        </div>
      </form>

      {authMessage && (
        <p className={`mt-2 text-sm ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
          {authMessage}
        </p>
      )}

      <OneButtonFooterLayout footerText='저장' />
    </div>
  );
};

export default AddComponent;

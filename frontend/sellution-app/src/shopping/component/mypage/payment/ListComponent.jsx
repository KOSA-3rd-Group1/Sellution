import { TrashIcon } from '@/client/utility/assets/Icons.jsx';
import { KookminBankIcon,KakaoBankIcon,WooriBankIcon,ShinhanBankIcon,IBKIcon,TossBankIcon,PostBankIcon,NonghyupBankIcon,HanaBankIcon } from '@/client/utility/assets/BankIcons.jsx';
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import TitleHeaderNavLayout from "@/shopping/layout/TitleHeaderNavLayout.jsx";

// 은행 코드와 은행 이름을 매핑하는 객체
const BANK_CODES = {
  '004': '국민은행',
  '090': '카카오뱅크',
  '088': '신한은행',
  '020': '우리은행',
  '003': '기업은행',
  '092': '토스뱅크',
  '071': '우체국은행',
  '011': '농협은행',
  '081': '하나은행'
};
// 은행 코드와 은행 로고 매핑하는 객체
const BANK_LOGO = {
  '004': KookminBankIcon,
  '090': KakaoBankIcon,
  '088': ShinhanBankIcon,
  '020': WooriBankIcon,
  '003': IBKIcon,
  '092': TossBankIcon,
  '071': PostBankIcon,
  '011': NonghyupBankIcon,
  '081': HanaBankIcon,
};

// 은행 코드에 따른 배경색 매핑
const BANK_COLORS = {
  '004': 'bg-yellow-400',
  '090': 'bg-yellow-300',
  '088': 'bg-sky-200',
  '020': 'bg-sky-300',
  '003': 'bg-sky-400',
  '092': 'bg-blue-400',
  '071': 'bg-orange-400',
  '011': 'bg-green-200',
  '081': 'bg-green-500'
};


const ListComponent = () => {
  const { clientName, customerId } = useParams();
  const navigate = useNavigate();

  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!customerId) {
        console.error('customerId가 없습니다.');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/accounts/customers/${customerId}`);
        const accounts = response.data.content.map(account => ({
          id: account.accountId,
          bank: BANK_CODES[account.bankCode] || '알 수 없는 은행',
          accountNumber: maskAccountNumber(account.accountNumber),
          bankCode: account.bankCode,
          isChecked: false
        }));
        setPaymentMethods(accounts);
      } catch (error) {
        console.error('계좌 정보를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchAccounts();
  }, [customerId]);

  // 계좌번호 마스킹 함수
  const maskAccountNumber = (accountNumber) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };


  const handleCheckChange = (id) => {
    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === id
          ? { ...method, isChecked: true }
          : { ...method, isChecked: false }
      ),
    );
  };

  const handleDeleteAccount = (id) => {
    if (window.confirm('해당 계좌를 삭제하시겠습니까?')) {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    }
  };

  const handleAddPaymentMethod = () => {
    navigate(`/shopping/${clientName}/my/${customerId}/add`);
  };

  return (
    <div className='w-full h-full bg-red-500'>
      <TitleHeaderNavLayout title={'오리'} />
      <div className='bg-white rounded-lg shadow-md p-4'>
        <h2 className='text-lg font-semibold mb-4'>결제 정보</h2>
        <div className='flex items-center mb-4'>
          <div className='text-brandOrange mr-2'> *</div>
          <span className='font-semibold'>등록된 계좌</span>
        </div>

        <div className='overflow-x-auto'>
          <div className='flex space-x-4 pb-4'>
            {paymentMethods.map((method) => {
              const BankIcon = BANK_LOGO[method.bankCode] || (() => null);
              return (
                <div
                  key={method.id}
                  className={`${BANK_COLORS[method.bankCode] || 'bg-gray-400'} rounded-lg p-4 flex flex-col justify-between shadow-md relative w-64 h-36 flex-shrink-0`}
                >
                  <div className="flex items-center">
                    <BankIcon className='w-8 h-8 mr-2' />
                    <div className='text-xs'>{method.bank}</div>
                  </div>
                  <div className='absolute bottom-4'>
                    <div className='font-semibold'>계좌번호</div>
                    <div>{method.accountNumber}</div>
                  </div>
                  <button
                    onClick={() => handleCheckChange(method.id)}
                    className='absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center'
                  >
                    {method.isChecked && <span className='text-brandOrange'>✓</span>}
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(method.id)}
                    className='absolute bottom-4 right-4'
                  >
                    <TrashIcon className='w-6 h-6 text-gray-500' />
                  </button>
                </div>
              );
            })}

            <button
              onClick={handleAddPaymentMethod}
              className='border border-gray-300 rounded-lg p-4 w-64 h-36 flex flex-col justify-center items-center shadow-md flex-shrink-0'
            >
              <span className='text-2xl mr-2'>+</span>
              결제 수단 추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListComponent;

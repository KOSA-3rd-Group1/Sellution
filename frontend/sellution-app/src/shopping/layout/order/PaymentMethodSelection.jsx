import { TrashIcon } from '@/client/utility/assets/Icons.jsx';
import {
  HanaBankIcon,
  IBKIcon,
  KakaoBankIcon,
  KookminBankIcon,
  NonghyupBankIcon,
  PostBankIcon,
  ShinhanBankIcon,
  TossBankIcon,
  WooriBankIcon,
} from '@/client/utility/assets/BankIcons.jsx';
const PaymentMethodSelection = ({
  paymentMethods,
  handleCheckChange,
  handleDeleteAccount,
  handleAddPaymentMethod,
}) => {
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
    '081': 'bg-green-500',
  };
  return (
    <div className='bg-white py-4 w-[90%]'>
      <div className='flex items-center mb-4'>
        <div className='text-primary mr-2'> * </div>
        <span className='font-semibold'>결제수단</span>
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
                <div className='flex items-center'>
                  <BankIcon className='w-8 h-8 mr-2' />
                  <div className='text-xs'>{method.bank}</div>
                </div>
                <div className='absolute bottom-4'>
                  <div className='font-semibold'>계좌번호</div>
                  <div>{method.accountNumber}</div>
                </div>
                <button
                  onClick={() => handleCheckChange(method.id)}
                  className='absolute top-3 right-3 w-6 h-6 bg-white border border-primary rounded-full flex items-center justify-center'
                >
                  {method.isChecked && <span className='text-primary'>✓</span>}
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
  );
};
export default PaymentMethodSelection;

import { TrashIcon } from '@/client/utility/assets/Icons.jsx';

const PaymentMethodSelection = ({
  paymentMethods,
  handleCheckChange,
  handleDeleteAccount,
  handleAddPaymentMethod,
}) => {
  return (
    <div className='bg-white py-4 w-[90%]'>
      <span className='block py-2 mb-2 font-bold'>결제 정보</span>
      <div className='flex items-center mb-4'>
        <div className='text-brandOrange mr-2'> * </div>
        <span className='font-semibold'>CMS</span>
      </div>

      <div className='overflow-x-auto'>
        <div className='flex space-x-4 pb-4'>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className='bg-yellow-400 rounded-lg p-4 flex flex-col justify-between shadow-md relative w-64 h-36 flex-shrink-0'
            >
              <div>
                <img src='/path-to-kb-logo.png' alt={method.bank} className='w-8 h-8 mb-2' />
                <div className='absolute bottom-4'>
                  <div className='font-semibold'>계좌번호</div>
                  <div>{method.accountNumber}</div>
                </div>
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
          ))}

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

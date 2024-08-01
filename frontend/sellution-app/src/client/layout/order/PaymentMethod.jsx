import { InfoInput } from '@/client/layout/common/Input';

const PaymentMethod = ({ data }) => {
  return (
    <div className='w-full'>
      <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
        <div>결제 방법</div>
      </div>
      <ul className=' w-full min-w-fit flex flex-col text-sm border-t-2'>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>카드 결제</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.perPrice || ''} disabled textDefault={true} />
          </div>
        </li>
        {/* <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>정기 결제일</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.paymentMethod || ''} disabled textDefault={true} />
          </div>
        </li> */}
      </ul>
    </div>
  );
};

export default PaymentMethod;

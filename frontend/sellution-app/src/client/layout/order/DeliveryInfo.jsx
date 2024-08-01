import { InfoInput } from '@/client/layout/common/Input';

const DeliveryInfo = ({ data }) => {
  return (
    <div className='w-full'>
      <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
        <div>정기 배송 정보</div>
      </div>
      <ul className=' w-full min-w-fit flex flex-col text-sm border-t-2'>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>결제 단위</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.type || ''} disabled textDefault={true} />
          </div>
        </li>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>
            {data.type === '정기(월 단위)' ? '총 이용 기간' : '총 이용 횟수'}
          </div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.subscriptionPeriod || ''} disabled textDefault={true} />
          </div>
        </li>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>남은 배송 횟수</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.remainingDeliveryCount || ''} disabled textDefault={false} />
          </div>
        </li>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>정기 배송 주기</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.regularDeliveryDate || ''} disabled textDefault={true} />
          </div>
        </li>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>배송 시작일</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.deliveryStartDate || ''} disabled textDefault={true} />
          </div>
        </li>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>배송 종료일</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.deliveryEndDate || ''} disabled textDefault={true} />
          </div>
        </li>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>다음 배송일</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.nextDeliveryDate || ''} disabled textDefault={false} />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default DeliveryInfo;

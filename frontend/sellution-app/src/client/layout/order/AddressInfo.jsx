import { InfoInput } from '@/client/layout/common/Input';

const AddressInfo = ({ data }) => {
  return (
    <div className='w-full'>
      <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
        <div>배송지 정보</div>
      </div>
      <ul className=' w-full min-w-fit flex flex-col text-sm border-t-2'>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>수령인</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.name || ''} disabled textDefault={true} />
          </div>
        </li>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>우편번호</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.zipcode || ''} disabled textDefault={true} />
          </div>
        </li>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>배송지 주소</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.address || ''} disabled textDefault={true} />
          </div>
        </li>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>수령인 휴대폰 전화</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.phoneNumber || ''} disabled textDefault={true} />
          </div>
        </li>
        <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
          <div className='flex-1 min-w-32'>배송지 명</div>
          <div className='flex-1 min-w-64'>
            <InfoInput value={data.addressName || ''} disabled textDefault={true} />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AddressInfo;

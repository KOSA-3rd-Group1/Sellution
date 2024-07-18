import FooterComponent from '@/client/layout/partials/FooterComponent';
import { InfoInput } from '../../../layout/common/Input';
import { useCustomerDefault } from '../../../business/customer/detail/useCustomerDefault';

const DefaultComponent = () => {
  const { data, handleChangeInputValue, moveList, handleSaveData, handleDeleteData } =
    useCustomerDefault();

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='w-1/2'>
          <div className='w-full min-h-20 h-20 max-h-20 text-lg font-semibold flex items-center'>
            <div>기본정보</div>
          </div>
          <ul className='w-full min-w-fit min-h-fit h-full flex flex-col text-sm border-t-2'>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>회원명</div>
              <div className='flex-1 min-w-64'>
                <InfoInput
                  value={data.name || ''}
                  onChange={(e) => handleChangeInputValue('name', e.target.value)}
                />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>휴대폰 번호</div>
              <div className='flex-1 min-w-64'>
                <InfoInput
                  value={data.phoneNumber || ''}
                  onChange={(e) => handleChangeInputValue('phoneNumber', e.target.value)}
                />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>회원 아이디</div>
              <div className='flex-1 min-w-64'>
                <InfoInput value={data.username || ''} readOnly />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>가입일</div>
              <div className='flex-1 min-w-64'>
                <InfoInput value={data.createdAt || ''} readOnly />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>회원 유형</div>
              <div className='flex-1 min-w-64'>
                <InfoInput value={data.type || ''} disabled />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>이용 여부</div>
              <div className='flex-1 min-w-64'>
                <InfoInput value={data.isInUse || ''} disabled />
              </div>
            </li>
          </ul>
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '회원 삭제', event: handleDeleteData }}
        btn2={{ label: '변경사항 적용', event: handleSaveData }}
        back={{ label: '목록으로', event: moveList }}
      />
    </div>
  );
};

export default DefaultComponent;

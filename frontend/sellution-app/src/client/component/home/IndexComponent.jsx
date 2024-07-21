import Calendar from '../../layout/common/Calendar';

const IndexComponent = () => {
  const calendarEvents = {
    '2024-06-29': [{ title: '지난달 이벤트', time: '15:00', description: '6월 마지막 주 이벤트' }],
    '2024-07-01': [
      { title: '아침 회의', time: '09:00', description: '팀 주간 회의' },
      { title: '프로젝트 점검', time: '14:00', description: 'A 프로젝트 진행 상황 점검' },
      { title: '팀 미팅', time: '16:00', description: '팀 빌딩 활동' },
    ],
    '2024-07-03': [
      { title: '프로젝트 시작', time: '09:00', description: 'B 프로젝트 킥오프 미팅' },
    ],
    '2024-07-15': [
      { title: '프로젝트 마감', time: '09:00', description: 'C 프로젝트 최종 제출' },
      { title: '팀 점심', time: '12:30', description: '팀원들과 회식' },
      { title: '고객 미팅', time: '15:00', description: 'D사 고객과의 미팅' },
      { title: '주간 보고', time: '17:00', description: '이번 주 업무 보고' },
    ],
    '2024-07-20': [
      { title: '병원 예약', time: '10:00', description: '정기 검진' },
      { title: '점심 약속', time: '12:00', description: '옛 동료와의 점심' },
      { title: '운동', time: '18:00', description: '헬스장 PT' },
    ],
    '2024-07-25': [{ title: '월간 보고', time: '14:00', description: '7월 월간 업무 보고' }],
    '2024-08-02': [{ title: '다음달 이벤트', time: '11:00', description: '8월 첫 주 이벤트' }],
  };

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-full flex flex-col overflow-hidden'>
        <div className='relative w-full h-full flex overflow-auto'>
          <div className='relative flex-[1.2] flex flex-col justify-start min-w-[700px] h-full py-10'>
            <div className='w-full'>
              <Calendar calendarEvents={calendarEvents} />
            </div>
          </div>
          <div className='flex-[1] min-w-[600px] h-fit p-10 flex flex-col justify-start items-center gap-9'>
            <div className='flex-1 w-full flex flex-col text-base'>
              <div className='font-base mb-4'>오늘 할일</div>
              <div className=' flex justify-between gap-4'>
                <div className='flex-1'>
                  <div className='w-full h-full text-center'>
                    <div className='w-full h-[40px] py-2 bg-brandOrange text-white border-1 border-brandOrange rounded-t-lg text-sm'>
                      주문승인
                    </div>
                    <div className='w-full h-[124px] flex flex-col justify-evenly items-center border border-[#D3D6E0] rounded-b-lg'>
                      <div className='w-[30px] h-[30px] bg-brandOrange-light'>아</div>
                      <div className='text-xs'>승인 대기</div>
                      <div className='text-sm'>10,000건</div>
                    </div>
                  </div>
                </div>
                <div className='flex-[3]'>
                  <div className='w-full text-center'>
                    <div className='w-full h-[40px] py-2 bg-brandOrange text-white border-1 border-brandOrange rounded-t-lg text-sm'>
                      자동 간편 승인
                    </div>
                    <div className='w-full h-[124px] flex justify-around items-center border border-[#D3D6E0] rounded-b-lg'>
                      <div className='h-full flex flex-col justify-evenly items-center'>
                        <div className='w-[30px] h-[30px] bg-brandOrange-light'>아</div>
                        <div className='text-xs'>결제 성공</div>
                        <div className='text-sm'>10,000건</div>
                      </div>
                      <div className='h-full flex flex-col justify-evenly items-center'>
                        <div className='w-[30px] h-[30px] bg-brandOrange-light'>아</div>
                        <div className='text-xs'>결제 취소</div>
                        <div className='text-sm'>10,000건</div>
                      </div>
                      <div className='h-full flex flex-col justify-evenly items-center'>
                        <div className='w-[30px] h-[30px] bg-brandOrange-light'>아</div>
                        <div className='text-xs'>결제 실패</div>
                        <div className='text-sm'>10,000건</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex-1 w-full flex justify-between items-center gap-4'>
              <div className='w-full text-base'>
                <div className='font-base mb-4'>회원 현황</div>
                <div className='w-[100%] h-[160px] border border-[#D3D6E0] rounded-lg flex flex-col justify-evenly p-4 text-sm'>
                  <div className='flex justify-between items-center'>
                    <span>주문 이용 회원</span>
                    <span className='text-base'>10,000 건</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span>신규 등록 회원</span>
                    <span className='text-base'>10,000 건</span>
                  </div>
                </div>
              </div>
              <div className='w-full text-base'>
                <div className='font-base mb-4'>정산 현황</div>
                <div className='w-[100%] h-[160px] border border-[#D3D6E0] rounded-lg flex flex-col justify-evenly p-4 text-sm'>
                  <div className='flex justify-between items-center'>
                    <span>정기 결제</span>
                    <span className='text-base'>10,000 건</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span>단건 결제</span>
                    <span className='text-base'>10,000 건</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='relative w-full flex-1 flex justify-between items-center gap-4'>
              <div className='w-full h-full'>
                <div className='font-base text-base mb-4'>메모</div>
                <div className='w-full h-[224px] p-4 border border-[#D3D6E0] bg-[#FCE8DB] rounded-lg flex flex-col justify-evenly shadow-lg'>
                  <textarea className='w-full h-full bg-transparent' />
                </div>
              </div>
              <div className='w-full h-full'>
                <div className='font-base text-base mb-4 '>시스템 알림</div>
                <div className='w-[100%] h-[224px] p-4 border border-[#D3D6E0] rounded-lg flex flex-col justify-start gap-4 text-sm  shadow-lg'>
                  <div className='flex justify-between items-center border-b'>
                    <span>주문 이용 회원</span>
                    <span className='text-lg'>10,000 건</span>
                  </div>
                  <div className='flex justify-between items-center border-b '>
                    <span>신규 등록 회원</span>
                    <span className='text-lg'>10,000 건</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndexComponent;

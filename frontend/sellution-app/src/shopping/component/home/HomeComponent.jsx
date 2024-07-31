import useHome from '@/shopping/business/home/useHome.js';
import LogoHeaderNav from '../../layout/LogoHeaderNav';
import HomeFooter from '../../layout/HomeFooter';
import EventModal from '../../layout/EventModal';
const HomeComponent = () => {
  const defaultImages = [
    'https://wimage.wconcept.co.kr/msa-event/event/section/mo/20240715173744104_4519.png?RS=750',
    'https://wimage.wconcept.co.kr/msa-event/event/section/mo/20240715173812427_5164.png?RS=750',
  ];
  const {
    activeSlide,
    handleSlideChange,
    data,
    isPopupOpen,
    handleClosePopup,
    handleClosePopupForToday,
    moveToEventPage,
  } = useHome();
  // themeColor이 제공되지 않았을 경우의 기본 색상 설정
  // const bgColor = data && data.themeColor ? `bg-[#${data.themeColor}]` : 'bg-brandOrange-light';
  if (!data) {
    return null; // 또는 로딩 상태를 처리하는 다른 UI를 반환할 수 있음
  }
  // 데이터가 비어 있는 경우 기본 이미지로 캐러셀 생성
  const carouselItems =
    data.promotionImageUrls.length > 0 ? data.promotionImageUrls : defaultImages;

  return (
    <>
      <LogoHeaderNav />
      <main className='w-full h-full bg-white p-4 flex flex-col justify-center'>
        <div className='flex-[1.3]'>
          <div className='carousel w-full flex flex-col'>
            {carouselItems.map((imageUrl, index) => (
              <div
                key={index}
                id={`slide${index + 1}`}
                className={`carousel-item relative w-full flex justify-center ${activeSlide === index + 1 ? 'block' : 'hidden'}`}
              >
                <img
                  src={imageUrl}
                  className='main-image w-full max-w-md h-auto aspect-square'
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
            <div className='flex justify-center my-2 gap-2'>
              {carouselItems.map((imageUrl, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${activeSlide === index + 1 ? 'bg-primary' : 'bg-gray-300'}`}
                  onClick={() => handleSlideChange(index + 1)}
                ></button>
              ))}
            </div>
          </div>
        </div>
        <div className='flex-1 flex flex-col'>
          <div
            // className='flex-1 bg-[#FFF8F4] rounded-[25px] mx-2 mb-2 p-4 flex flex-col justify-center items-start'
            className='flex-1 bg-accent rounded-[25px] mx-2 mb-2 p-4 flex flex-col justify-center items-start'
          >
            <h3 className='text-lg font-bold'>{data && data.mainPromotion1Title}</h3>
            <p className='text-sm text-gray-600'>{data && data.mainPromotion1Content}</p>
          </div>
          <div
            // className={`flex-1 bg-brandOrange-light rounded-[25px] mx-2 mb-2 p-4 flex flex-col justify-center items-start`}
            className='flex-1 bg-neutral rounded-[25px] mx-2 mb-2 p-4 flex flex-col justify-center items-start'
          >
            <h3 className='text-lg font-bold'>{data && data.mainPromotion2Title}</h3>
            <p className='text-sm text-gray-600'>{data && data.mainPromotion2Content}</p>
          </div>
          {/* <div
            className={`flex-1 bg-${data ? data.themaColor : 'brandOrange-light'} rounded-[25px] mx-2 mb-2 p-4 flex flex-col justify-center items-start`}
          >
            <p className='text-sm text-gray-600'>가정배송 서비스</p>
            <p className='text-sm text-gray-600'>
              지금{' '}
              <a href='#' className='text-blue-500 underline'>
                로그인
              </a>{' '}
              해주세요!
            </p>
          </div> */}
        </div>
      </main>
      <HomeFooter></HomeFooter>
      <EventModal
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onClick={moveToEventPage}
        onCloseForToday={handleClosePopupForToday}
      />
    </>
  );
};

export default HomeComponent;

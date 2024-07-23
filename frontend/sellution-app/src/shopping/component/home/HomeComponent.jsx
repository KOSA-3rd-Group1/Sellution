import useHome from '@/shopping/business/home/useHome.js';
import LogoHeaderNav from '../../layout/LogoHeaderNav';
import HomeFooter from '../../layout/HomeFooter';

const HomeComponent = () => {
  const { activeSlide, handleSlideChange } = useHome();
  return (
    <>
      <LogoHeaderNav></LogoHeaderNav>
      <main className='w-full h-full bg-white p-4 flex flex-col justify-center'>
        <div className='flex-[1.3]'>
          <div className='carousel w-full'>
            <div
              id='slide1'
              className={`carousel-item relative w-full flex justify-center ${activeSlide === 1 ? 'block' : 'hidden'}`}
            >
              <img
                src='/image/home_img1.jpg'
                className='main-image w-full max-w-md h-auto aspect-square'
                alt='Slide 1'
              />
            </div>
            <div
              id='slide2'
              className={`carousel-item relative w-full flex justify-center ${activeSlide === 2 ? 'block' : 'hidden'}`}
            >
              <img
                src='/image/home_img2.jpg'
                className='main-image w-full max-w-md h-auto aspect-square'
                alt='Slide 2'
              />
            </div>
            <div
              id='slide3'
              className={`carousel-item relative w-full flex justify-center ${activeSlide === 3 ? 'block' : 'hidden'}`}
            >
              <img
                src='/image/product_img.png'
                className='main-image w-full max-w-md h-auto aspect-square'
                alt='Slide 3'
              />
            </div>
            <div
              id='slide4'
              className={`carousel-item relative w-full flex justify-center ${activeSlide === 4 ? 'block' : 'hidden'}`}
            >
              <img
                src='/image/home_img2.jpg'
                className='main-image w-full max-w-md h-auto aspect-square'
                alt='Slide 4'
              />
            </div>
          </div>
          <div className='flex justify-center my-2 gap-2'>
            {[1, 2, 3, 4].map((slide) => (
              <button
                key={slide}
                className={`w-2 h-2 rounded-full ${activeSlide === slide ? 'bg-brandOrange' : 'bg-gray-300'}`}
                onClick={() => handleSlideChange(slide)}
              ></button>
            ))}
          </div>
        </div>
        <div className='flex-1 flex flex-col'>
          <div className='flex-1 bg-[#FFF8F4] rounded-[25px] mx-2 mb-2 p-4 flex flex-col justify-center items-start'>
            <h3 className='text-lg font-bold'>함께, 건강하고 단건하게</h3>
            <p className='text-sm text-gray-600'>
              최고의 퀄리티를 위해 아끼지 않고 가득 담았습니다
            </p>
          </div>
          <div className='flex-1 bg-brandOrange-light rounded-[25px] m-2 p-4 flex flex-col justify-center'>
            <p className='text-sm text-gray-600'>가정배송 서비스</p>
            <p className='text-sm text-gray-600'>
              지금{' '}
              <a href='#' className='text-blue-500 underline'>
                로그인
              </a>{' '}
              해주세요!
            </p>
          </div>
        </div>
      </main>
      <HomeFooter></HomeFooter>
    </>
  );
};

export default HomeComponent;

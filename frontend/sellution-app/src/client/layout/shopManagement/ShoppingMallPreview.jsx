import { useEffect, useState } from 'react';
import {
  ShoppingHomeIcon,
  ShoppingSubscriptionDeliveryIcon,
  ShoppingOneTimeDeliveryIcon,
  ShoppingMypageIcon,
  ShoppingCartIcon,
  ImageUploadIcon,
} from '@/client/utility/assets/Icons';

const ShoppingMallPreview = ({ data, logoImg, promotionImg, serviceType }) => {
  const [activeSlide, setActiveSlide] = useState(1);
  const totalSlides = promotionImg.length;

  const handleSlideChange = (slide) => {
    setActiveSlide(slide);
  };

  const handleSlideChangeToImageClick = () => {
    setActiveSlide((prevSlide) => (prevSlide >= totalSlides ? 1 : prevSlide + 1));
  };

  useEffect(() => {
    setActiveSlide((prevSlide) => (prevSlide >= totalSlides ? 1 : prevSlide + 1));
  }, [promotionImg]);

  return (
    <div className='relative w-full h-full bg-white'>
      {/* Header */}
      <header className='absolute top-0 w-full h-16 flex justify-center items-center shadow-md'>
        <div>
          {logoImg !== undefined && logoImg.length !== 0 ? (
            <img
              src={logoImg[0].preview}
              alt='Shoppingmall Logo'
              className='w-48 h-12 object-contain rounded-lg'
            />
          ) : data !== undefined && data.displayName !== '' ? (
            <div className='max-w-48 w-48 min-w-48 h-12 flex justify-center items-center text-center overflow-hidden whitespace-nowrap '>
              <div className='w-48 h-fit text-2xl font-bold'>{data.displayName}</div>
            </div>
          ) : (
            <div className='w-48 h-12 flex justify-center items-center rounded-lg bg-[#F1F1F4]'>
              <div className='text-[#A5A5A5] font-semibold'>로고 이미지 or 회사명</div>
            </div>
          )}
        </div>
      </header>

      {/* main */}
      <main className='w-full h-full px-4 py-16 flex flex-col justify-center'>
        {/* 프로모션 이미지 캐러셀 */}
        <div className='relative flex-[1.3]'>
          <div className='relative carousel w-full h-full px-2 py-10'>
            {promotionImg != undefined && promotionImg.length != 0 ? (
              promotionImg.map((image, index) => (
                <div
                  key={image.id}
                  id={`slide${index + 1}`}
                  className={`relative w-full h-[312px] flex justify-center items-center shadow-md rounded-xl carousel-item ${activeSlide === index + 1 ? 'block' : 'hidden'}`}
                  onClick={handleSlideChangeToImageClick}
                >
                  <img
                    src={image.preview}
                    className='w-full max-w-md h-full object-fill rounded-xl aspect-squre'
                    alt={image.file.name}
                  />
                </div>
              ))
            ) : (
              <div className='relative w-full h-[312px] flex flex-col justify-center items-center shadow-md rounded-xl bg-[#F1F1F4] text-[#A5A5A5] font-semibold'>
                <ImageUploadIcon className='w-20 h-20 mb-4' />
                <div className='mb-2'>프로모션 이미지</div>
                <div>(최소 1개 이상 등록 필요)</div>
              </div>
            )}
          </div>
          <div className='absolute bottom-0 w-full h-10 flex justify-center items-center gap-2'>
            {promotionImg.map((image, index) => (
              <button
                key={`slide${index + 1}`}
                className={`w-2 h-2 rounded-full ${activeSlide === index + 1 ? 'bg-secondary' : 'bg-gray-300'}`}
                onClick={() => handleSlideChange(index + 1)}
              ></button>
            ))}
          </div>
        </div>

        {/* 프로모션 문구 */}
        <div className='flex-1 px-2 mb-2 flex flex-col gap-4'>
          {/* 프로모션 문구 1 */}
          <div
            className={`flex-1 p-4 flex flex-col justify-center items-start gap-2 rounded-lg bg-accent`}
          >
            <h3 className='text-lg font-bold text-black '>{data.mainPromotion1Title}</h3>
            <p className='text-sm text-gray-600'>{data.mainPromotion1Content}</p>
          </div>
          {/* 프로모션 문구 2 */}
          <div
            className={`flex-1 p-4 flex flex-col justify-center items-start gap-2 rounded-lg bg-neutral`}
          >
            <p className='text-base font-semibold text-black'>{data.mainPromotion2Title}</p>
            <p className='text-sm font-semibold text-gray-600'>{data.mainPromotion2Content}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <nav
        className={`absolute bottom-0 w-full h-16 py-1.5 flex items-center shadow-footer text-xs text-secondary`}
      >
        <div className='flex-1 flex flex-col justify-center items-center gap-1'>
          <ShoppingHomeIcon className='w-7 h-7' />
          <p>홈</p>
        </div>
        {serviceType && serviceType != 'ONETIME' && (
          <div className='flex-1 flex flex-col justify-center items-center gap-1'>
            <ShoppingSubscriptionDeliveryIcon className='w-7 h-7' />
            <p>정기배송</p>
          </div>
        )}
        {serviceType && serviceType != 'SUBSCRIPTION' && (
          <div className='flex-1 flex flex-col justify-center items-center gap-1'>
            <ShoppingOneTimeDeliveryIcon className='w-7 h-7' />
            <p>단건주문</p>
          </div>
        )}
        <div className='flex-1 flex flex-col justify-center items-center gap-1'>
          <ShoppingMypageIcon className='w-7 h-7' />
          <p>마이페이지</p>
        </div>
        <div className='flex-1 flex flex-col justify-center items-center gap-1'>
          <ShoppingCartIcon className='w-7 h-7' />
          <p>장바구니</p>
        </div>
      </nav>
    </div>
  );
};

export default ShoppingMallPreview;

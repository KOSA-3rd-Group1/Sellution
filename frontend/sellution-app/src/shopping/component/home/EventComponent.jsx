import useEvent from '../../business/home/useEvent';
import HomeFooter from '../../layout/HomeFooter';
import Coupon from '../../layout/partials/Coupon';
import MenuHeaderNav from './../../layout/MenuHeaderNav';
import './event.css';
const EventComponent = () => {
  const { coupons } = useEvent();
  return (
    <>
      <MenuHeaderNav title={'EVENT'} />
      {/* <div className='w-full h-full bg-gray-100 flex flex-col items-center px-4 py-6'>
        <h1 className='text-2xl font-bold mb-6'>SPECIAL COUPON</h1>

        {coupons.map((coupon) => (
          <Coupon
            key={coupon.id}
            discount={coupon.couponDiscountRate}
            description={coupon.couponName}
            condition={`행사기간: ${coupon.eventStartDate} ~ ${coupon.eventEndDate}`}
            eventId={coupon.id}
          />
        ))}
      </div> */}
      <div className='w-full min-h-screen bg-white flex flex-col items-center px-4 py-12'>
        <div className='max-w-4xl w-full flex flex-col items-center'>
          <div className='text-center mb-12'>
            <p className='text-xl md:text-5xl font-extrabold text-black mb-4 animate-pulse'>
              🎉 SPECIAL COUPON EVENT 🎉
            </p>
            <p className='text-md text-black'>놓치지 마세요! 특별한 할인 기회</p>
          </div>

          {coupons.map((coupon) => (
            <div className='w-full section_coupon relative flex justify-center' key={coupon.id}>
            <Coupon
              key={coupon.id}
              discount={coupon.couponDiscountRate}
              description={coupon.couponName}
              condition={`행사기간: ${coupon.eventStartDate} ~ ${coupon.eventEndDate}`}
              eventId={coupon.id}
            />
             <div className='btn_coupon_alarm'></div>
            </div>
          ))}

          <div className='mt-12 text-center'>
            <h2 className='text-2xl font-bold text-black mb-4'>이벤트 참여 방법</h2>
            <ul className='text-center'>
              {[
                '원하는 쿠폰을 선택하세요',
                "'쿠폰받기' 버튼을 클릭하세요",
                '마이페이지에서 쿠폰을 확인하세요',
              ].map((step, index) => (
                <li key={index} className='flex items-center justify-center mb-2'>
                  <svg
                    className='w-5 h-5 mr-2 text-yellow-500'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'
                      fill='currentColor'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default EventComponent;

import useEvent from '../../business/home/useEvent';
import Coupon from '../../layout/partials/Coupon';

const EventComponent = () => {
  const { coupons } = useEvent();
  return (
    <div className='w-full bg-gray-100 flex flex-col items-center px-4 py-6'>
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
    </div>
  );
};

export default EventComponent;

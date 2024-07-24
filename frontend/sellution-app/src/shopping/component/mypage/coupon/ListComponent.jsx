import MenuHeaderNav from './../../../layout/MenuHeaderNav';
import HomeFooter from '../../../layout/HomeFooter';
import useList from '../../../business/mypage/coupon/useList';
import MyCoupon from '../../../layout/partials/MyCoupon';
const ListComponent = () => {
  const { coupons, loading, error } = useList();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <MenuHeaderNav title={'쿠폰함'} />
      <div className='bg-white h-screen'>
        <div className='p-4'>
          {coupons.map((coupon, index) => (
            <MyCoupon key={index} {...coupon} />
          ))}
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default ListComponent;

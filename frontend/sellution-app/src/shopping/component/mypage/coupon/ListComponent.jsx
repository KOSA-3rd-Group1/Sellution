import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuHeaderNav from './../../../layout/MenuHeaderNav';
import HomeFooter from '../../../layout/HomeFooter';
import useList from '../../../business/mypage/coupon/useList';
import MyCoupon from '../../../layout/partials/MyCoupon';
import LoadingSpinner from '../../../layout/LoadingSpinner';
import ErrorComponent from './../../../layout/ErrorComponent';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import OneButtonFooterLayout from '@/shopping/layout/OneButtonFooterLayout.jsx';

const ListComponent = () => {
  const { coupons, loading, error } = useList();
  const navigate = useNavigate();
  const clientName = useCompanyInfoStore((state) => state.name);

  useEffect(() => {
    if (error && error.response) {
      const errorStatus = error.response.status;
      if (errorStatus === 500) {
        navigate(`/shopping/${clientName}/home`);
      } else {
        // 다른 에러일 경우
        console.error('알 수 없는 에러:', error);
      }
    }
  }, [error, navigate, clientName]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    const errorStatus = error.response.status || 500;
    const errorMessage = error.response.message || 'Internal Server Error';
    if (errorStatus === 500) {
      navigate(`/shopping/${clientName}/home`);
      return null; // 리다이렉트가 발생하므로 컴포넌트 렌더링을 중지
    }
    return <ErrorComponent errorCode={errorStatus} errorMessage={errorMessage} />;
  }

  return (
    <>
      <MenuHeaderNav title={'쿠폰함'} />
      <div>
        <div className='p-4'>
          {coupons.length === 0 ? (
            <div className='w-full h-full flex justify-center items-center'>
              <p>쿠폰이 없습니다</p>
            </div>
          ) : (
            coupons.map((coupon, index) => <MyCoupon key={index} {...coupon} />)
          )}
        </div>
      </div>
      <OneButtonFooterLayout
        footerText={'이벤트 페이지로 이동'}
        onClick={() => {
          navigate(`/shopping/${clientName}/home/event`);
        }}
      />
    </>
  );
};

export default ListComponent;

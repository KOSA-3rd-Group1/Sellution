import { Outlet, useLocation } from 'react-router-dom';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';

const BasicLayout = () => {
  const clientName = useCompanyInfoStore((state) => state.name);
  const themeColor = useCompanyInfoStore((state) => state.themeColor);
  const location = useLocation();

  const pagesWithPt16 = [
    `/shopping/${clientName}/home`,
    `/shopping/${clientName}/idInquiry/sms-auth`, // idlnquiry > smsauthcomponent
    `/shopping/${clientName}/idInquiry/view`, // idlnquiry > viewcomponent
    `/shopping/${clientName}/login`, // login > logincomponent
    `/shopping/${clientName}/my/address/add`, // mypage > address > add
    `/shopping/${clientName}/ordersheet/setting/address/add`, // ordersheet > setting > address > add
    `/shopping/${clientName}/pwInquiry/reset`, // //pwlnquiry > resetcomponent
    `/shopping/${clientName}/pwInquiry/sms-auth`, ////pwlnquiry > smsauthcomponent
  ];
  const dynamicPathPrefixes = [
    `/shopping/${clientName}/onetime/order-completed/`,
    `/shopping/${clientName}/subscription/order-completed/`,
  ];

  const dynamicPathPatterns = [
    new RegExp(`^/shopping/${clientName}/onetime/order-completed/[^/]+$`),
    new RegExp(`^/shopping/${clientName}/subscription/order-completed/[^/]+$`),
    new RegExp(`^/shopping/${clientName}/my/[^/]+/order$`),  // /shopping/${clientName}/my/:orderId/order 패턴 추가
  ];

  const isPageWithPt16 =
    pagesWithPt16.includes(location.pathname) ||
    dynamicPathPrefixes.some((prefix) => location.pathname.startsWith(prefix));

  const isPageWithPb0 = dynamicPathPatterns.some(regex => regex.test(location.pathname));

  return (
    <div className='flex justify-center h-screen' data-theme={`Custom${themeColor}Theme`}>
      <div
        className={`container-box relative w-full max-w-lg h-full flex flex-col ${isPageWithPt16 ? 'pt-16' : 'pt-14'} ${isPageWithPb0 ? 'pb-0' : 'pb-16'}`}
      >
        {/* <Header toggleCategoryMenu={toggleCategoryMenu} isCategoryVisible={isCategoryVisible} /> */}
        <div className={`w-full h-full scroll-box overflow-auto flex-grow`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BasicLayout;

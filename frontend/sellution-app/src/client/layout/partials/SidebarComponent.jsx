import {
  CompanyIcon,
  HomeIcon,
  CustomerIcon,
  OrderIcon,
  ProductIcon,
  //   ReleaseIcon,
  PaymentHistoryIcon,
  EventIcon,
  ShopManagementIcon,
} from '@/client/utility/assets/Icons';
import { SidebarBtn } from '@/client/layout/common/Button';

const SidebarCompoent = (props) => {
  return (
    <div className='w-full h-full px-5 flex-1 flex flex-col flex-shrink-0 border-gray-200 border-r bg-white'>
      <div className='flex-1 flex flex-col divide-y'>
        <div className='space-y-2'>
          <div className='w-full h-14 p-2 flex items-center text-base text-gray-900 font-normal rounded-lg'>
            <CompanyIcon className='w-6 h-6' />
            <span className='ml-3 font-medium '>{props.companyName}</span>
          </div>
        </div>
        <div className='space-y-2 pt-2'>
          {/* <SidebarBtn to='/home' Icon={HomeIcon} content={'홈'} /> */}
          <SidebarBtn to='/customer' Icon={CustomerIcon} content={'회원'} />
          <SidebarBtn to='/order' Icon={OrderIcon} content={'주문'} />
          <SidebarBtn to='/product' Icon={ProductIcon} content={'상품'} />
          {/* <SidebarBtn to='/' Icon={ReleaseIcon} content={'출고'} /> */}
          <SidebarBtn to='/payment-history' Icon={PaymentHistoryIcon} content={'결제 내역'} />
          <SidebarBtn to='/event' Icon={EventIcon} content={'이벤트'} />
          <SidebarBtn to='/shop-management' Icon={ShopManagementIcon} content={'쇼핑몰 관리'} />
        </div>
      </div>
    </div>
  );
};

export default SidebarCompoent;

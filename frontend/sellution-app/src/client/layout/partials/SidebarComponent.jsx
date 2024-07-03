import {
  CompanyIcon,
  HomeIcon,
  CustomerIcon,
  OrderIcon,
  ProductIcon,
  ReleaseIcon,
  PaymentHistoryIcon,
  EventIcon,
  ShopManagementIcon,
} from '@/client/utility/assets/Icons';
import { SidebarBtn } from '@/client/layout/common/Button';

const SidebarCompoent = (props) => {
  return (
    <div className='w-full h-full flex flex-col flex-shrink-0 border-gray-200 border-r bg-white px-5'>
      <div className='flex-1 flex flex-col divide-y'>
        <div className='space-y-2'>
          <button className='w-full h-14 p-2 flex items-center text-base text-gray-900 font-normal rounded-lg'>
            <CompanyIcon className='w-6 h-6' />
            <span className='ml-3'>{props.companyName || '테스트 회사'}</span>
          </button>
        </div>
        <div className='space-y-2 pt-2'>
          <SidebarBtn Icon={HomeIcon} content={'홈'} selected={props.menu == 1 || true} />
          <SidebarBtn Icon={CustomerIcon} content={'회원'} selected={props.menu == 2} />
          <SidebarBtn Icon={OrderIcon} content={'주문'} selected={props.menu == 3} />
          <SidebarBtn Icon={ProductIcon} content={'상품'} selected={props.menu == 4} />
          <SidebarBtn Icon={ReleaseIcon} content={'출고'} selected={props.menu == 5} />
          <SidebarBtn Icon={PaymentHistoryIcon} content={'결제 내역'} selected={props.menu == 6} />
          <SidebarBtn Icon={EventIcon} content={'이벤트'} selected={props.menu == 7} />
          <SidebarBtn
            Icon={ShopManagementIcon}
            content={'쇼핑몰 관리'}
            selected={props.menu == 8}
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarCompoent;

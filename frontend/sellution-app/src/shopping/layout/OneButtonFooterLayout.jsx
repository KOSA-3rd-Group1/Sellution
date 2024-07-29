import { useLocation } from 'react-router-dom';
import useCompanyInfoStore from './../store/stores/useCompanyInfoStore';
import useSubscriptionCartStore from './../store/stores/useSubscriptionCartStore';
import useOnetimeCartStore from './../store/stores/useOnetimeCartStore';
const OneButtonFooterLayout = ({ footerText, onClick, isDisabled = false }) => {
  const clientName = useCompanyInfoStore((state) => state.name);
  const subscriptionCartCount = useSubscriptionCartStore((state) => state.subscriptionCart.length);
  const onetimeCartCount = useOnetimeCartStore((state) => state.onetimeCart.length);
  let cartCount = 0;
  let isCountVisible = false;
  if (location.pathname === `/shopping/${clientName}/subscription`) {
    cartCount = subscriptionCartCount;
    isCountVisible = cartCount > 0;
  } else if (location.pathname === `/shopping/${clientName}/onetime`) {
    cartCount = onetimeCartCount;
    isCountVisible = cartCount > 0;
  }

  return (
    <nav className='fixed bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg h-16 bg-white flex shadow-footer px-3 py-1.5'>
      <div
        className={`footer-box flex-1 flex justify-center items-center rounded-full hover:cursor-pointer ${isDisabled ? 'bg-gray-300' : 'bg-brandOrange hover:bg-orange-600'}`}
        onClick={!isDisabled ? onClick : null}
      >
        <div className='relative'>
          <span className='footer-text text-white font-bold text-lg'>{footerText}</span>
          {isCountVisible && (
            <span className='absolute top-[4px] right-[-31px] bg-white text-brandOrange font-bold rounded-full px-[6px] py-[2px] text-xs'>
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};
export default OneButtonFooterLayout;

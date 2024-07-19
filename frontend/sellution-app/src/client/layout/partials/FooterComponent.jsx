import { FooterBtn1, FooterBtn2 } from '@/client/layout/common/Button';
import { ListIcon } from '@/client/utility/assets/Icons';

const FooterComponent = (props) => {
  return (
    <div
      className={`absolute bottom-0 w-full h-12 mt-2.5 flex ${props.back?.label ? 'justify-between' : 'justify-end'} align-bottom`}
    >
      {props.back?.label && (
        <FooterBtn1 Icon={ListIcon} content={props.back.label} event={props.back.event} />
      )}
      <div className='row-center-position gap-5'>
        {props.btn1?.label && <FooterBtn1 content={props.btn1.label} event={props.btn1.event} />}
        {props.btn2?.label && <FooterBtn2 content={props.btn2.label} event={props.btn2.event} />}
      </div>
    </div>
  );
};

export default FooterComponent;

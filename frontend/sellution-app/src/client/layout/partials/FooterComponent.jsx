import { FooterBtn1, FooterBtn2 } from '../common/Button';
import { ListIcon } from '../../utility/assets/Icons';

const FooterComponent = (props) => {
  return (
    <div
      className={`w-full h-12 mt-2.5 flex ${props.back?.label ? 'justify-between' : 'justify-end'} align-bottom`}
    >
      {props.back?.label && (
        <FooterBtn1 Icon={ListIcon} content={props.back.label} event={props.back.event} />
      )}
      {props.btn1?.label && props.btn2?.label && (
        <div className='row-center-position gap-5'>
          <FooterBtn1 content={props.btn1.label} event={props.btn1.event} />
          <FooterBtn2 content={props.btn2.label} event={props.btn2.event} />
        </div>
      )}
    </div>
  );
};

export default FooterComponent;

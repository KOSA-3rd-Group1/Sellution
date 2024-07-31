import {
  Icon1,
  Icon2,
  Icon3,
  Icon4,
  Icon5,
  Icon6,
  Icon7,
  Icon8,
  Icon9,
  Icon10,
  Icon11,
  Icon12,
} from '@/client/utility/assets/LoginIcons';
import LoginComponent from '@/client/component/login/LoginComponent';
import '@/client/component/login/Login.css';

const IndexComponent = () => {
  const items = [
    { icon: <Icon1 className='w-6 h-6' />, text: '식료품' },
    { icon: <Icon2 className='w-6 h-6' />, text: '패션' },
    { icon: <Icon3 className='w-6 h-6' />, text: '뷰티' },
    { icon: <Icon4 className='w-6 h-6' />, text: '건강' },
    { icon: <Icon5 className='w-6 h-6' />, text: '가정' },
    { icon: <Icon6 className='w-6 h-6' />, text: '애완동물' },
    { icon: <Icon7 className='w-6 h-6' />, text: '도서' },
    { icon: <Icon8 className='w-6 h-6' />, text: '식사' },
    { icon: <Icon9 className='w-6 h-6' />, text: '전자기기' },
    { icon: <Icon10 className='w-6 h-6' />, text: '유아' },
    { icon: <Icon11 className='w-6 h-6' />, text: '취미' },
    { icon: <Icon12 className='w-6 h-6' />, text: '사무' },
  ];

  return (
    <div className='w-dvw h-dvh py-[15%] px-[5%] flex items-center overflow-hidden text-[#1a1a1a]'>
      <div className='flex-auto'>
        <div className='w-full h-[500px] outline outline-4 outline-transparent duration-500 loginContainer'>
          <div className='w-full h-full scene' style={{ '--buff': '3rem' }}>
            <ul className='relative flex-1 w-full h-[600px] m-0 px-4 list-none grid grid-cols-2 gap-4 custom-grid'>
              {items.map((item, index) => (
                <li key={index} className='w-full min-h-[60px] custom-list'>
                  <div className='item'>
                    <div className='item__icon'>{item.icon}</div>
                    <div className='item__text'>{item.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className='w-[500px]'>
        <LoginComponent />
      </div>
    </div>
  );
};

export default IndexComponent;

import { NavLink } from 'react-router-dom';

export const SidebarBtn = ({ to, Icon, content }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `w-full text-base font-normal rounded-lg transition duration-75 flex items-center p-2 ${isActive ? 'text-brandOrange bg-brandOrange-light' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`
    }
  >
    <Icon className='w-5 h-5 flex-shrink-0 group-focus:text-brandOrange transition duration-75' />
    <span className='ml-4'>{content}</span>
  </NavLink>
);

export const FooterBtn1 = (props) => (
  <button
    className={`h-12 w-[180px] row-center-position gap-3 text-lg text-brandOrange border border-brandOrange rounded-md `}
    onClick={() => props.event()}
  >
    {props.Icon && <props.Icon className='object-contain h-6' />}
    <div>{props.content}</div>
  </button>
);

export const FooterBtn2 = (props) => (
  <button
    className={`h-12 w-[180px] row-center-position gap-3 text-lg text-white bg-brandOrange rounded-md `}
    onClick={() => props.event()}
  >
    <div>{props.content}</div>
  </button>
);

export const ListBtn = (props) => (
  <button
    className={`h-8 w-fit px-2 row-center-position gap-3 text-xs text-brandOrange border border-brandOrange rounded-md bg-white `}
    onClick={() => props.event()}
  >
    {props.Icon && <props.Icon className='object-contain h-5' />}
    <div>{props.content}</div>
  </button>
);

export const EventBtn = ({ Icon, label, ...attr }) => (
  <button
    className={`h-8 w-fit min-w-fit px-2 row-center-position gap-3 text-xs text-brandOrange border border-brandOrange rounded-md bg-white `}
    {...attr}
  >
    {Icon && <Icon className='object-contain h-5' />}
    <div>{label}</div>
  </button>
);

export const DownloadBtn = ({ Icon, label, ...attr }) => (
  <button
    className={`h-8 w-fit min-w-fit px-2 row-center-position gap-3 text-xs text-gray-500 border border-gray-500 rounded-md bg-white hover:bg-gray-100 hover:text-gray-700`}
    {...attr}
  >
    {Icon && <Icon className='object-contain h-5' />}
    <div>{label}</div>
  </button>
);

export const ResetBtn = ({ Icon, label, ...attr }) => (
  <button
    className={`h-8 w-fit min-w-fit px-2 row-center-position gap-3 text-xs font-light text-gray-500 border border-gray-400 bg-white rounded-md hover:bg-brandOrange-light hover:text-brandOrange hover:border-brandOrange-light `}
    {...attr}
  >
    {Icon && <Icon className='object-contain h-5' />}
    <div>{label}</div>
  </button>
);

export const NotBorderBtn = ({ Icon, label, ...attr }) => (
  <button
    className={`h-8 w-fit min-w-fit px-2 row-center-position gap-2 text-xs text-black border-transparent cursor-default`}
    {...attr}
  >
    {Icon && <Icon className='object-contain h-5' />}
    <div>{label}</div>
  </button>
);

export const CountOrderBtn = ({ Icon, label, count, ...attr }) => (
  <button
    className={`h-8 w-fit min-w-fit px-2 row-center-position gap-2 text-xs bg-brandOrange-light border border-brandOrange rounded-md text-black cursor-default`}
    {...attr}
  >
    {Icon && <Icon className='object-contain h-5' />}
    <div className='flex items-center'>
      <div>{label}</div>
      <div className='pl-2 pr-1 align font-bold text-[#FF4800]'>{count}</div>
      <div>건</div>
    </div>
  </button>
);

export const ModalBtn = ({ children, className = '', variant = 'default', ...props }) => {
  const baseStyle =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
  };

  const classes = `${baseStyle} ${variants[variant]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

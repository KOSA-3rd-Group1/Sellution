export const SidebarBtn = ({ Icon, content, selected }) => (
  <button
    className={`w-full ${selected ? 'text-brandOrange bg-brandOrange-light' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'} text-base font-normal rounded-lg transition duration-75 flex items-center p-2`}
  >
    <Icon className='w-5 h-5 flex-shrink-0 group-focus:text-brandOrange transition duration-75' />
    <span className='ml-4'>{content}</span>
  </button>
);

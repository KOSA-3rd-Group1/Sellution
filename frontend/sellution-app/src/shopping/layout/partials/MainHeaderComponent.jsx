import { Link } from 'react-router-dom';

const MainHeaderComponent = ({ breadcrumbs, title, children }) => {
  return (
    <div className='w-full h-full flex flex-col'>
      <header className='h-16 flex flex-col gap-2.5'>
        <ul className='flex space-x-1 text-xs font-semibold text-gray-400'>
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className='flex items-center'>
              {index > 0 && <span className='mx-2'>/</span>}
              {breadcrumb.link ? (
                <Link to={breadcrumb.link} className='hover:text-gray-600'>
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className='text-gray-500'>{breadcrumb.label}</span>
              )}
            </li>
          ))}
        </ul>
        <div className='text-2xl'>{title}</div>
      </header>
      <div className='w-full flex-auto'>{children}</div>
    </div>
  );
};

export default MainHeaderComponent;

import { Link } from 'react-router-dom';

const MainHeaderComponent = ({ breadcrumbs, children }) => {
  return (
    <section className='box-content w-full h-full flex flex-col bg-blue-50'>
      <div className='h-16'>
        <div className='text-sm'>
          <ul className='flex space-x-2'>
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className='flex items-center'>
                {index > 0 && <span className='mx-2'>/</span>}
                {breadcrumb.link ? (
                  <Link to={breadcrumb.link} className='text-gray-500 hover:text-gray-700'>
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span className='text-gray-900'>{breadcrumb.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>경로 제목</div>
      </div>
      <div className='w-full flex-auto'>{children}</div>
    </section>
  );
};

export default MainHeaderComponent;

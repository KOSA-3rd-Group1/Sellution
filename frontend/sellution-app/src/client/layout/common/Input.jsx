export const SearchInput = () => {
  return (
    <div className='mt-1 relative lg:w-64'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <svg
          className='w-5 h-5 text-gray-500'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
            clipRule='evenodd'
          ></path>
        </svg>
      </div>
      <input
        type='text'
        name='email'
        id='topbar-search'
        className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full pl-10 p-2.5'
        placeholder='Search'
      />
    </div>
  );
};

export const DefaultInput = (props) => (
  <input
    type='text'
    className='w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block'
    placeholder={props.placeholder || '입력'}
  />
);

export const TableSearchInput = (props) => {
  return (
    <div className='relative w-full px-1'>
      <div className='absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none'>
        <svg
          className='w-4 h-4 text-gray-500'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
            clipRule='evenodd'
          ></path>
        </svg>
      </div>
      <input
        type='text'
        value={props.value || ''}
        onChange={props.onChange}
        className=' bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 w-full pl-10 pr-2 p-1 font-normal'
        placeholder='Search'
      />
    </div>
  );
};

export const InfoInput = ({ textDefault, ...props }) => (
  <input
    className={`w-full h-10 border-2 border-[#DADADA] rounded-lg px-6 placeholder:text-slate-400
				outline-none focus:ring-2 ring-brandOrange focus:ring-offset-2 
				read-only:bg-gray-100 read-only:text-slate-600 read-only:ring-transparent
				disabled:bg-white disabled:border-transparent ${textDefault ? 'disabled:text-gray-600' : 'disabled:text-brandOrange'}`}
    {...props}
  />
);

export const InfoInputRight = ({ textDefault, ...props }) => (
  <input
    className={`w-full h-10 border-2 border-[#DADADA] rounded-lg px-6 placeholder:text-slate-400 text-right
				outline-none focus:ring-2 ring-brandOrange focus:ring-offset-2 
				read-only:bg-gray-100 read-only:text-slate-600 read-only:ring-transparent
				disabled:bg-white disabled:border-transparent ${textDefault ? 'disabled:text-gray-600' : 'disabled:text-brandOrange'}`}
    {...props}
  />
);

import { Link } from 'react-router-dom';
import Table from '@/client/layout/common/Table';
import { useCustomerList } from '@/client/business/customer/useCustomerList';

const ListComponent = () => {
  const { HEADERS, ROW_HEIGHT, data, totalDataCount, tableState, setTableState } =
    useCustomerList();

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-full flex flex-col'>
        <div className='text-lg flex-none  h-12 '></div>
        <div className='flex-grow overflow-hidden'>
          <Table
            HEADERS={HEADERS}
            ROW_HEIGHT={ROW_HEIGHT}
            data={data}
            totalDataCount={totalDataCount}
            tableState={tableState}
            setTableState={setTableState}
          />
        </div>
        <div className='h-12 flex-none '>페이지 네이션</div>
      </section>
      {/* <Link to='/customer/customerId12345' className='w-fit h-5 bg-blue-400'>
		회원 상세 이동 테스트
	  </Link>
	  <Link to='/customer/add' className='w-fit h-5 bg-red-400'>
		회원 등록 테스트
	  </Link> */}
    </div>
  );
};

export default ListComponent;

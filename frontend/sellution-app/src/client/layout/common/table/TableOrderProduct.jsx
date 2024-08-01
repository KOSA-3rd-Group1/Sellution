import OrderDetailProductImage from '@/client/layout/common/skeleton/OrderDetailProductImage';

const TableOrderProduct = ({ HEADERS, ROW_HEIGHT, data }) => {
  return (
    <div className='w-full h-full flex flex-col'>
      <div className='w-full relative overflow-x-auto overflow-y-auto '>
        <table className='relative w-full h-full text-sm text-left text-gray-500 table-fixed '>
          <thead className='sticky top-0 z-30 w-full h-14 text-xs text-gray-700 uppercase bg-gray-50 '>
            <tr className='relative'>
              <th className='sticky min-w-20 w-20 max-w-20 h-full p-3 z-20 left-[0px] bg-gray-50'>
                <div className='flex flex-col w-full h-full justify-center items-center gap-3'>
                  <div></div>
                </div>
              </th>

              {HEADERS.map((header, index) => (
                <th key={'header_' + index} className={`${header.width} h-full p-3 z-10`}>
                  <div className='flex flex-col w-full h-full justify-center items-center gap-3 text-gray-700'>
                    <div>{header.label}</div>
                  </div>
                </th>
              ))}
              <th className='w-full'></th>
            </tr>
          </thead>
          <tbody className='relative w-full text-sm bg-white border-y border-y-[#CCCDD3] font-light'>
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={row.productName}
                  className={`relative w-full ${ROW_HEIGHT} border-b border-b-[#F1F1F4] group`}
                >
                  <td className='sticky min-w-20 w-20 max-w-20 p-3 z-10 left-[0px] bg-white group-hover:bg-brandOrange-light'>
                    <div className='flex flex-col w-full justify-between items-center gap-3'>
                      <OrderDetailProductImage src={row.productImage} />
                    </div>
                  </td>
                  {HEADERS.map((header) => (
                    <td
                      key={row.id + '_' + header.key}
                      className={`${header.width} p-3 z-10 group-hover:bg-brandOrange-light`}
                    >
                      <div className='flex flex-col w-full justify-between items-center gap-3 px-2'>
                        <div className='text-center w-full truncate'>{row[header.key]}</div>
                      </div>
                    </td>
                  ))}
                  <td className='w-full group-hover:bg-brandOrange-light'></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={HEADERS.length + 3} className='px-6 py-4 text-center text-gray-500'>
                  상품 내역이 존재하지 않습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableOrderProduct;

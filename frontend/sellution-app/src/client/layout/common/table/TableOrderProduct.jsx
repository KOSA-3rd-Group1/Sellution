import OrderDetailProductImage from '@/client/layout/common/skeleton/OrderDetailProductImage';

const TableOrderProduct = ({ HEADERS, ROW_HEIGHT, data }) => {
  return (
    <div className='w-full h-full flex flex-col'>
      <div className='w-full relative overflow-y-auto'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='sticky top-0 z-30 w-full h-14 text-xs text-gray-700 uppercase bg-gray-50'>
          <tr className='relative'>
            <th className='w-20 p-3 z-20 bg-gray-50'>
              <div className='flex flex-col w-full h-full justify-center items-center gap-3'>
                <div></div>
              </div>
            </th>

            {HEADERS.map((header, index) => (
              <th key={'header_' + index} className={`p-3 z-10`} style={{ width: header.width }}>
                <div className='flex flex-col w-full h-full justify-center items-center gap-3 text-gray-700'>
                  <div>{header.label}</div>
                </div>
              </th>
            ))}
          </tr>
          </thead>
          <tbody className='w-full text-sm bg-white border-y border-y-[#CCCDD3] font-light'>
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row.productName}
                className={`w-full ${ROW_HEIGHT} border-b border-b-[#F1F1F4] group focus:outline-none focus-within:outline-none`}
                tabIndex={0}
              >
                <td className='w-20 p-3 z-10 bg-white group-hover:bg-[#FFF8F4] group-focus-within:bg-brandOrange-light group-focus:bg-brandOrange-light'>
                  <div className='flex flex-col w-full justify-between items-center gap-3'>
                    <OrderDetailProductImage src={row.productImage} />
                  </div>
                </td>
                {HEADERS.map((header) => (
                  <td
                    key={row.id + '_' + header.key}
                    className={`p-3 z-10 group-hover:bg-[#FFF8F4] group-focus-within:bg-brandOrange-light group-focus:bg-brandOrange-light`}
                    style={{ width: header.width }}
                  >
                    <div className='flex flex-col w-full justify-between items-center gap-3 px-2'>
                      <div className='text-center w-full truncate'>{row[header.key]}</div>
                    </div>
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={HEADERS.length + 1} className='px-6 py-4 text-center text-gray-500'>
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
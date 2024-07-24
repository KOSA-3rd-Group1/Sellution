import { TrashIcon } from '@/client/utility/assets/Icons';

const TableEachProduct = ({ HEADERS, ROW_HEIGHT, data, handleDelete }) => {
  return (
    <div className='w-full h-full flex flex-col'>
      {/* table 위에 */}
      <div className='h-[45px] px-5 py-2 flex justify-between items-center bg-white text-sm font-medium text-gray-700 border-b-2 border-b-[#CCCDD3]'>
        <div>총 {data ? data.length : '0'} 건</div>
        {/* {Btns} */}
      </div>
      {/* table */}
      <div className='w-full max-h-64 relative overflow-x-auto overflow-y-auto'>
        <table className='relative w-full h-full text-sm text-left text-gray-500 table-fixed '>
          <thead className='sticky top-0 z-30 w-full h-16 text-xs text-gray-700 uppercase bg-gray-50 '>
            <tr className='relative'>
              {HEADERS.map((header, index) => (
                <th key={index} className={`${header.width} h-full p-3 z-10`}>
                  <div className='flex flex-col w-full h-full justify-center items-center gap-3 text-gray-700'>
                    <div>{header.label}</div>
                  </div>
                </th>
              ))}
              <th className='w-full'></th>
            </tr>
          </thead>
          <tbody className='relative w-full text-sm bg-white border-y border-y-[#CCCDD3] font-light'>
            {data && data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={row.product.code}
                  className={`relative w-full ${ROW_HEIGHT} border-b border-b-[#F1F1F4] group`}
                >
                  {HEADERS.map((header) => (
                    <td
                      key={row.product.code + '_' + header.key}
                      className={`${header.width} p-3 z-10 group-hover:bg-brandOrange-light`}
                    >
                      <div className='flex flex-col w-full justify-between items-center gap-3 px-2'>
                        <div className='text-center w-full truncate'>{row.product[header.key]}</div>
                      </div>
                    </td>
                  ))}
                  <td
                    className='min-w-10 w-10 max-w-10 group-hover:bg-brandOrange-light hover:text-red-400'
                    onClick={() => handleDelete(row.product.code)}
                  >
                    <TrashIcon className='w-5 h-5' />
                  </td>
                  <td className='w-full group-hover:bg-brandOrange-light'></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={HEADERS.length + 3} className='px-6 py-4 text-left text-gray-500'>
                  선택된 상품이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableEachProduct;

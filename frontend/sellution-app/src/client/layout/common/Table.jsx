import { TableSearchInput } from '@/client/layout/common/Input';
import { useTable } from '@/client/business/common/useTable';

const Table = ({
  HEADERS,
  ROW_HEIGHT,
  data,
  totalDataCount,
  tableState,
  setTableState,
  Btns,
  handleRowEvent,
}) => {
  const {
    selectAll,
    selectedRows,
    selectedCount,
    handleSelectAll,
    handleSelectRow,
    handleTableStateChange,
    handleSort,
  } = useTable({ data, setTableState });

  return (
    <div className='w-full h-full overflow-x-auto shadow-md sm:rounded-lg'>
      {/* table 위에 */}
      <div className='h-[45px] px-5 flex justify-between items-center bg-white text-sm font-medium text-gray-700 border-b-2 border-b-[#CCCDD3]'>
        <div>
          총 {totalDataCount} 건 / 선택 {selectedCount} 건
        </div>
        {Btns}
      </div>
      {/* table */}
      <div className='w-full h-[calc(100%-45px)] grow relative overflow-x-auto overflow-y-auto'>
        <table className='relative w-full h-full text-sm text-left text-gray-500 table-fixed '>
          <thead className='sticky top-0 z-30 w-full h-[82px] text-xs text-gray-700 uppercase bg-gray-50 '>
            <tr className='relative'>
              <th className='sticky min-w-14 w-14 max-w-14 h-full p-3 z-20 left-[0px] bg-gray-50'>
                <div className='flex flex-col w-full h-full justify-between items-center gap-1'>
                  <input
                    type='checkbox'
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                  />
                </div>
              </th>
              <th className='sticky min-w-20 w-20 max-w-20 h-full p-3 z-20 left-[56px] bg-gray-50'>
                <div className='flex flex-col w-full h-full justify-between items-center gap-3'>
                  <div>No.</div>
                </div>
              </th>

              {HEADERS.map((header, index) => (
                <th key={index} className={`${header.width} h-full p-3 z-10`}>
                  <div className='flex flex-col w-full h-full justify-between items-center gap-3 text-gray-700'>
                    <div>{header.label}</div>
                    {header.type === 'search' && (
                      <TableSearchInput
                        value={tableState[header.key] || ''}
                        onChange={(e) => handleTableStateChange(header.key, e.target.value)}
                      />
                    )}
                    {header.type === 'filter' && (
                      <div className='w-full px-1'>
                        <select
                          value={tableState[header.key]}
                          onChange={(e) => handleTableStateChange(header.key, e.target.value)}
                          className='w-full p-1 text-sm border rounded-lg pl-2 text-gray-600'
                        >
                          <option value='All'>선택</option>
                          {header.options.map((option) => (
                            <option key={header.key + '_' + option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {header.type === 'sort' && (
                      <button
                        value={tableState[header.key] || ''}
                        onClick={() => handleSort(header.key)}
                        className='w-full p-1 text-sm border rounded-lg bg-white hover:bg-gray-200'
                      >
                        정렬 {tableState[header.key] === 'asc' ? '↑' : '↓'}
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className='w-full'></th>
            </tr>
          </thead>
          <tbody className='absolute w-full text-sm bg-white border-y border-y-[#CCCDD3] font-light'>
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={row.id}
                  className={`relative w-full ${ROW_HEIGHT} border-b border-b-[#F1F1F4] group`}
                  onClick={handleRowEvent ? () => handleRowEvent(row.id) : undefined}
                >
                  <td className='sticky min-w-14 w-14 max-w-14 p-3 z-10 left-[0px] bg-white group-hover:bg-brandOrange-light'>
                    <div className='flex flex-col w-full justify-between items-center gap-3'>
                      <input
                        type='checkbox'
                        checked={selectedRows[row.id] || false}
                        onChange={() => handleSelectRow(row.id)}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                      />
                    </div>
                  </td>
                  <td className='sticky min-w-20 w-20 max-w-20 p-3 z-10 left-[56px] bg-white group-hover:bg-brandOrange-light'>
                    <div className='flex flex-col w-full justify-between items-center gap-3'>
                      {row.id}
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
                  데이터가 존재하지 않습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

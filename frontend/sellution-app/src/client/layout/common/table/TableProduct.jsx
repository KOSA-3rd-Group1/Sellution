import React from 'react';
import { TableSearchInput } from '@/client/layout/common/Input';
import ImageLoadTimeTest from '@/client/utility/ImageLoadTimeTest';

const TableProduct = ({
  HEADERS,
  ROW_HEIGHT,
  data,
  totalDataCount,
  tableState,
  setTableState,
  Btns,
  ResetBtn,
  handleRowEvent,
  handleSelectAll,
  handleSelectRow,
  selectedRows,
  selectedCount,
  startIndex,
}) => {
  return (
    <div className='w-full h-full flex flex-col'>
      <div className='h-[45px] px-5 py-2 flex justify-between items-center bg-white text-sm font-medium text-gray-700 border-b-2 border-b-[#CCCDD3]'>
        <div>
          총 {totalDataCount} 건 / 선택 {selectedCount} 건
        </div>
        {Btns}
      </div>
      <div className='w-full relative overflow-x-auto overflow-y-auto'>
        <table className='relative w-full h-full text-sm text-left text-gray-500 table-fixed'>
          <thead className='sticky top-0 z-30 w-full h-[82px] text-xs text-gray-700 uppercase bg-gray-50'>
            <tr className='relative'>
              <th className='sticky min-w-14 w-14 max-w-14 h-full p-3 z-20 left-[0px] bg-gray-50'>
                <div className='flex flex-col w-full h-full justify-between items-center gap-1'>
                  <input
                    type='checkbox'
                    checked={data.length > 0 && Object.keys(selectedRows).length === data.length}
                    onChange={handleSelectAll}
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                  />
                </div>
              </th>
              <th className='sticky min-w-20 w-20 max-w-20 h-full p-3 z-20 left-[56px] bg-gray-50'>
                <div className='flex flex-col w-full h-full justify-between items-center gap-3'>
                  <div>No.</div>
                  {ResetBtn}
                </div>
              </th>
              {HEADERS.map((header, index) => (
                <th key={index} className={`${header.width} h-full p-3 z-10`}>
                  <div className='flex flex-col w-full h-full justify-between items-center gap-3 text-gray-700'>
                    <div>{header.label}</div>
                    {header.type === 'search' && (
                      <TableSearchInput
                        value={tableState[header.key] || ''}
                        onChange={(e) =>
                          setTableState((prev) => ({ ...prev, [header.key]: e.target.value }))
                        }
                      />
                    )}
                    {header.type === 'filter' && (
                      <div className='w-full px-1'>
                        <select
                          value={tableState[header.key] || '전체'}
                          onChange={(e) =>
                            setTableState((prev) => ({ ...prev, [header.key]: e.target.value }))
                          }
                          className='w-full p-1 text-sm border rounded-lg pl-2 text-gray-600'
                        >
                          <option value='전체'>전체</option>
                          {header.options.map((option) => (
                            <option
                              key={header.key + '_' + (option.name || option)}
                              value={option.name || option}
                            >
                              {option.name || option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className='w-full'></th>
            </tr>
          </thead>
          <tbody className='relative w-full text-sm bg-white border-y border-y-[#CCCDD3] font-light'>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={row.productId}
                  className={`relative w-full ${ROW_HEIGHT} border-b border-b-[#F1F1F4] group`}
                  onClick={() => handleRowEvent(row.productId)}
                >
                  <td
                    className='sticky min-w-14 w-14 max-w-14 p-3 z-10 left-[0px] bg-white group-hover:bg-brandOrange-light'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className='flex flex-col w-full justify-between items-center gap-3'>
                      <input
                        type='checkbox'
                        checked={selectedRows[row.productId] || false}
                        onChange={() => handleSelectRow(row.productId)}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                      />
                    </div>
                  </td>
                  <td className='sticky min-w-20 w-20 max-w-20 p-3 z-10 left-[56px] bg-white group-hover:bg-brandOrange-light'>
                    <div className='flex flex-col w-full justify-between items-center gap-3'>
                      {startIndex + index + 1}
                    </div>
                  </td>
                  {HEADERS.map((header) => (
                    <td
                      key={row.productId + '_' + header.key}
                      className={`${header.width} p-3 z-10 group-hover:bg-brandOrange-light`}
                    >
                      <div className='flex flex-col w-full justify-between items-center gap-3 px-2'>
                        {header.key === 'thumbnailImage' ? (
                          row[header.key] ? (
                            <>
                              <img
                                src={row[header.key]}
                                alt={row.name}
                                className='w-12 h-12 object-cover inline-block'
                              />
                              <ImageLoadTimeTest imageUrl={row[header.key]} />
                            </>
                          ) : (
                            '이미지 없음'
                          )
                        ) : (
                          <div className='text-center w-full truncate'>
                            {header.format ? header.format(row[header.key]) : row[header.key]}
                          </div>
                        )}
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

export default TableProduct;

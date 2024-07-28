// const TableAddress = ({ HEADERS, ROW_HEIGHT, data, totalDataCount, handleRowEvent, Btns }) => {
//   return (
//     <div className='w-full h-full flex flex-col'>
//       {/* table 위에 */}
//       <div className='h-[45px] px-5 py-2 flex justify-between items-center bg-white text-sm font-medium text-gray-700 border-b-2 border-b-[#CCCDD3]'>
//         <div>총 {totalDataCount} 건</div>
//         {Btns}
//       </div>
//       {/* table */}
//       <div className='w-full relative overflow-x-auto overflow-y-auto'>
//         <table className='relative w-full h-full text-sm text-left text-gray-500 table-fixed '>
//           <thead className='sticky top-0 z-30 w-full h-16 text-xs text-gray-700 uppercase bg-gray-50 '>
//             <tr className='relative'>
//               <th className='sticky min-w-24 w-24 max-w-24 h-full p-3 z-20 left-[0px] bg-gray-50'>
//                 <div className='flex flex-col w-full h-full justify-center items-center gap-1'></div>
//               </th>

//               {HEADERS.map((header, index) => (
//                 <th key={index} className={`${header.width} h-full p-3 z-10`}>
//                   <div className='flex flex-col w-full h-full justify-center items-center gap-3 text-gray-700'>
//                     <div>{header.label}</div>
//                   </div>
//                 </th>
//               ))}
//               <th className='w-full'></th>
//             </tr>
//           </thead>
//           <tbody className='relative w-full text-sm bg-white border-y border-y-[#CCCDD3] font-light'>
//             {data.length > 0 ? (
//               data.map((row) => (
//                 <tr
//                   key={row.id}
//                   className={`relative w-full ${ROW_HEIGHT} border-b border-b-[#F1F1F4] group`}
//                   onClick={handleRowEvent ? () => handleRowEvent(row.id) : undefined}
//                 >
//                   <td className='sticky min-w-24 w-24 max-w-24 p-3 z-10 left-[0px] bg-white group-hover:bg-brandOrange-light'>
//                     <div className='flex flex-col w-full justify-between items-center gap-3'>
//                       {row.isDefaultAddress === 'Y' && (
//                         <button className='h-6 w-fit px-2 row-center-position gap-3 text-xs text-white border border-brandOrange bg-brandOrange'>
//                           <div>기본</div>
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                   {HEADERS.map((header) => (
//                     <td
//                       key={row.id + '_' + header.key}
//                       className={`${header.width} p-3 z-10 group-hover:bg-brandOrange-light`}
//                     >
//                       <div className='flex flex-col w-full justify-between items-center gap-3 px-2'>
//                         <div className='text-center w-full truncate'>{row[header.key]}</div>
//                       </div>
//                     </td>
//                   ))}
//                   <td className='w-full group-hover:bg-brandOrange-light'></td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={HEADERS.length + 3} className='px-6 py-4 text-left text-gray-500'>
//                   등록된 배송지 정보가 없습니다.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TableAddress;

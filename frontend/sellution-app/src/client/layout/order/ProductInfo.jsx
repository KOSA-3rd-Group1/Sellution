import TableOrderProduct from '@/client/layout/common/table/TableOrderProduct';

const ProductInfo = ({ HEADERS, ROW_HEIGHT, data }) => {
  return (
    <div className='w-full'>
      <TableOrderProduct HEADERS={HEADERS} ROW_HEIGHT={ROW_HEIGHT} data={data} />
    </div>
  );
};

export default ProductInfo;

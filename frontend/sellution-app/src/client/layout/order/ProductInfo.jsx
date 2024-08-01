import TableOrderProduct from '@/client/layout/common/table/TableOrderProduct';
import { HEADERS, ROW_HEIGHT } from '@/client/utility/tableinfo/OrderDetailTableInfo';

const ProductInfo = ({ data }) => {
  return (
    <div className='w-full'>
      <TableOrderProduct HEADERS={HEADERS} ROW_HEIGHT={ROW_HEIGHT} data={data} />
    </div>
  );
};

export default ProductInfo;

import { useMemo } from 'react';
import Select from 'react-select';
import TableEachProduct from '@/client/layout/common/table/TableEachProduct';
import useSaleSettingStore from '@/client/store/stores/useSaleSettingStore';
import { HEADERS } from '@/client/utility/tableinfo/ShopManagementSaleSettingEachProductTableInfo';

const formatGroupLabel = (data) => (
  <div className='flex justify-between items-center'>
    <span className='text-brandOrange'>{data.label}</span>
    <span className='bg-gray-200 rounded-full text-gray-700 text-xs font-normal px-2 py-1 min-w-[20px] text-center'>
      {data.options.length}
    </span>
  </div>
);

const SellTypeEach = () => {
  const serviceType = useSaleSettingStore((state) => state.saleTypes.serviceType);
  const { data, setData } = useSaleSettingStore((state) => ({
    data: state.sellTypeEach,
    setData: state.setSellTypeEach,
  }));

  const handleChange = (selectedOptions) => {
    setData({ selectedOptions: selectedOptions });
  };

  // 개별 상품 옵션 제거 handler
  const handleDelete = (removeProductCode) => {
    const updateSelectedOptions = data.selectedOptions.filter(
      (selectedOption) => selectedOption.product.code != removeProductCode,
    );
    setData({ selectedOptions: updateSelectedOptions });
  };

  const groupedOptions = useMemo(() => {
    let currentSelectOptions = null;
    switch (serviceType) {
      case 'ONETIME':
        currentSelectOptions = data.selectOnetimeOptions;
        break;
      case 'SUBSCRIPTION':
        currentSelectOptions = data.selectSubscriptionOptions;
        break;
      default:
        currentSelectOptions = data.selectBothOptions;
        break;
    }

    if (currentSelectOptions == undefined || Object.keys(currentSelectOptions).length == 0) return;
    const groups = currentSelectOptions.reduce((acc, product) => {
      if (!acc[product.categoryName]) {
        acc[product.categoryName] = [];
      }
      acc[product.categoryName].push(product);
      return acc;
    }, {});

    return Object.entries(groups).map(([categoryName, products]) => ({
      label: categoryName,
      options: products.map((product) => ({
        value: product.value,
        label: `${product.label} (${product.code})`,
        product: product, // 전체 제품 정보를 저장
      })),
    }));
  }, [
    data.selectBothOptions,
    data.selectOnetimeOptions,
    data.selectSubscriptionOptions,
    serviceType,
  ]);

  return (
    <div className='w-full'>
      <Select
        isMulti
        closeMenuOnSelect={false}
        className='selectItem z-40'
        classNamePrefix='select'
        onChange={handleChange}
        options={groupedOptions}
        placeholder='상품 선택'
        value={data.selectedOptions}
        formatGroupLabel={formatGroupLabel}
        theme={(theme) => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            neutral10: '#FCE8DB',
            neutral80: '#F37021',
            primary25: '#FFF8F4',
            primary: '#F37021',
          },
        })}
      />
      <TableEachProduct
        HEADERS={HEADERS}
        ROW_HEIGHT={'min-h-14 h-14 max-h-14'}
        data={data.selectedOptions}
        totalDataCount={0}
        handleDelete={handleDelete}
      />
      <div className='text-sm text-gray-500 leading-none mt-4'>
        * 적용할 상품을 여러 개 선택할 수 있습니다.
      </div>
    </div>
  );
};

export default SellTypeEach;

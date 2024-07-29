import FooterComponent from '@/client/layout/partials/FooterComponent';
import Accordion from '@/client/layout/common/Accodion';
import RadioButtonGroup from '@/client/layout/common/RadioButtonGroup';
import { useModal } from '@/client/business/common/useModal';
import { useShopManagementSaleSetting } from '@/client/business/shopManagement/useShopManagementSaleSetting';
import SellTypeCategory from '@/client/layout/shopManagement/SellTypeCategory';
import SellTypeEach from '@/client/layout/shopManagement/SellTypeEach';
import SubscriptionTypeCount from '@/client/layout/shopManagement/SubscriptionTypeCount';
import SubscriptionTypeMonth from '@/client/layout/shopManagement/SubscriptionTypeMonth';

const SaleSettingComponent = () => {
  const {
    alertModalState,
    autoCloseModalState,
    openAlertModal,
    closeAlertModal,
    openAutoCloseModal,
    closeAutoCloseModal,
  } = useModal();
  const {
    HEADERS,
    data,
    selectCategoryOptions,
    selectedCategoryOptions,
    selectEachProductOptions,
    selectedEachProductOptions,
    handleChangeInputValue,
    handleChangeSelectedCategoryOptions,
    handleChangeSelectedEachProductOptions,
    handleDeleteSelectedEachProductOption,
    handleSaveData,
  } = useShopManagementSaleSetting({
    openAlertModal,
    openAutoCloseModal,
    closeAutoCloseModal,
  });
  console.log(data);

  const accordionItems = [
    {
      title: '전체 상품',
      guidance: '* 표시 가능한 모든 상품을 적용합니다.',
      disabled: false,
    },
    {
      title: '카테고리',
      content: (
        <SellTypeCategory
          selectOptions={selectCategoryOptions}
          selectedOptions={selectedCategoryOptions}
          handleChange={handleChangeSelectedCategoryOptions}
        />
      ),
      guidance: ' *카테고리에 해당하는 상품들에 대해 적용합니다',
      disabled: false,
    },
    {
      title: '개별 상품',
      content: (
        <SellTypeEach
          selectOptions={selectEachProductOptions}
          selectedOptions={selectedEachProductOptions}
          handleChange={handleChangeSelectedEachProductOptions}
          handleDelete={handleDeleteSelectedEachProductOption}
          HEADERS={HEADERS}
        />
      ),
      guidance: '* 사용자가 원하는 상품들을 직접 선택하여 적용합니다.',
      disabled: false,
    },
  ];
  const accordionItems2 = [
    {
      title: '월 단위 결제',
      content: <SubscriptionTypeMonth />,
      guidance: '* 첫 결제 이후 매 월 결제가 진행됩니다.',
      disabled: data.serviceType == 'ONETIME',
    },
    {
      title: '횟수 단위 결제',
      content: <SubscriptionTypeCount />,
      guidance: ' * 전체 횟수에 대한 결제가 진행됩니다.',
      disabled: data.serviceType == 'ONETIME',
    },
  ];
  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='flex flex-col gap-10 px-4'>
          <div className='w-2/3'>
            <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
              <div>쇼핑몰 판매 설정</div>
            </div>
            <ul className=' w-full min-w-fit flex flex-col text-sm border-t-2'>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>배송 유형</div>
                <div className='flex-1 min-w-[600px]'>
                  <RadioButtonGroup
                    className='w-full flex justify-start items-center gap-6 px-4'
                    data={data}
                    options={[
                      { label: '단건', selectData: 'ONETIME' },
                      { label: '정기', selectData: 'SUBSCRIPTION' },
                      { label: '단건 + 정기', selectData: 'BOTH' },
                    ]}
                    name='serviceType'
                    onChange={handleChangeInputValue}
                  />
                </div>
              </li>
              <li className='relative pl-4 py-4 h-fit flex justify-between items-start gap-10 border-b'>
                <div className='flex-1 min-w-32'>적용 상품</div>
                <div className='flex-1 min-w-[600px]'>
                  <Accordion
                    items={accordionItems}
                    groupName={'sellType'}
                    openIndexNumber={data.sellType}
                  />
                </div>
              </li>
              <li className='relative pl-4 py-4 h-fit flex justify-between items-start gap-10 border-b'>
                <div className='flex-1 min-w-32'>정기 배송 유형</div>
                <div className='flex-1 min-w-[600px]'>
                  <Accordion
                    items={accordionItems2}
                    groupName={'subscriptionType'}
                    openIndexNumber={data.subscriptionType}
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '취소', event: handleSaveData }}
        btn2={{ label: '변경사항 적용', event: handleSaveData }}
      />

      {/* <AlertModal
        isOpen={alertModalState.isOpen}
        onClose={closeAlertModal}
        onConfirm={handleOnConfirm}
        type={alertModalState.type}
        title={alertModalState.title}
        message={alertModalState.message}
      /> */}
    </div>
  );
};

export default SaleSettingComponent;

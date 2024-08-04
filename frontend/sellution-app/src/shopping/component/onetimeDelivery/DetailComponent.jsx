import useDetail from './../../business/onetimeDelivery/useDetail';
import DetailLayout from '../../layout/DetailLayout';
import MenuHeaderNav from '../../layout/MenuHeaderNav';
import DetailOption from '../../layout/partials/DetailOption';
import TwoButtonFooterLayout from '../../layout/TwoButtonFooterLayout';
import OneButtonFooterLayout from '../../layout/OneButtonFooterLayout';
import DetailInformationLayout from '../../layout/DetailInformationLayout';
import TwoButtonModal from '../../layout/partials/TwoButtonModal';
import LoadingSpinner from './../../layout/LoadingSpinner';

const DetailComponent = () => {
  const {
    activeSlide,
    setActiveSlide,
    productToShow,
    isLoading,
    error,
    itemCountToAdd,
    setItemCountToAdd,
    increaseQuantity,
    decreaseQuantity,
    isDetailOptionVisible,
    toggleDetailOption,
    handleDirectOrder,
    handleSlideChange,
    addToOnetimeCart,
    isDetailPageModalVisible,
    moveToOnetimeList,
    moveToOnetimeCartPage,
  } = useDetail();
  const isButtonDisabled = itemCountToAdd === 0;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <MenuHeaderNav title={'단건배송 상세'} />
      <DetailLayout
        productToShow={productToShow}
        activeSlide={activeSlide}
        handleSlideChange={handleSlideChange}
      />
      <DetailInformationLayout listImages={productToShow.listImages} />
      {isDetailOptionVisible ? (
        <>
          <DetailOption
            productToShow={productToShow}
            itemCountToAdd={itemCountToAdd}
            setItemCountToAdd={setItemCountToAdd}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            isDetailOptionVisible={isDetailOptionVisible}
            toggleDetailOption={toggleDetailOption}
          />
          <TwoButtonFooterLayout
            addToCart={addToOnetimeCart}
            handleDirectOrder={handleDirectOrder}
            isDisabled={isButtonDisabled}
          />
          <TwoButtonModal
            isDetailPageModalVisible={isDetailPageModalVisible}
            onClickLeft={moveToOnetimeList}
            onClickRight={moveToOnetimeCartPage}
          />
        </>
      ) : (
        <OneButtonFooterLayout footerText={'구매하기'} onClick={toggleDetailOption} />
      )}
    </>
  );
};

export default DetailComponent;

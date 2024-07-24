import useDetail from '../../business/subscriptionDelivery/useDetail';
import DetailLayout from '../../layout/DetailLayout';
import MenuHeaderNav from './../../layout/MenuHeaderNav';
import DetailOption from '../../layout/partials/DetailOption';
import OneButtonFooterLayout from './../../layout/OneButtonFooterLayout';
import TwoButtonFooterLayout from '../../layout/TwoButtonFooterLayout';
import { useNavigate } from 'react-router-dom';
import useClientName from '../../business/layout/useClientName';
import useSubscriptionCartStore from './../../store/stores/useSubscriptionCartStore';

const DetailComponent = () => {
  const navigate = useNavigate();
  const { clientName } = useClientName();
  const { subscriptionCart, updateSubscriptionCart } = useSubscriptionCartStore();
  const addToSubscriptionCart = () => {
    if (itemCountToAdd > 0) {
      const newItem = {
        id: productToShow.productId,
        quantity: itemCountToAdd,
        name: productToShow.name,
        cost: productToShow.cost,
        discountRate: productToShow.discountRate,
        discountedPrice: productToShow.discountedPrice,
        stock: productToShow.stock,
      };
      updateSubscriptionCart(newItem);
      console.log('정기배송 장바구니 목록: ', subscriptionCart);
      setItemCountToAdd(0);
      //setIsDetailPageModalVisible(true);
      navigate(`/shopping/${clientName}/subscription/cart`);
    }
  };
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
  } = useDetail();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <MenuHeaderNav title={'정기배송 상세'} />
      <DetailLayout
        productToShow={productToShow}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
      />
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
            addToCart={addToSubscriptionCart}
            handleDirectOrder={handleDirectOrder}
          />
        </>
      ) : (
        <OneButtonFooterLayout footerText={'구매하기'} onClick={toggleDetailOption} />
      )}

      {/* footer에도 itemCountToAdd */}
    </>
  );
};

export default DetailComponent;

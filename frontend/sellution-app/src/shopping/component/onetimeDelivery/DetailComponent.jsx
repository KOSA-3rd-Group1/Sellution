import useDetail from './../../business/onetimeDelivery/useDetail';
import DetailLayout from '../../layout/DetailLayout';
import MenuHeaderNav from '../../layout/MenuHeaderNav';
import DetailOption from '../../layout/partials/DetailOption';
import TwoButtonFooterLayout from '../../layout/TwoButtonFooterLayout';
import OneButtonFooterLayout from '../../layout/OneButtonFooterLayout';
import useOnetimeCartStore from './../../store/stores/useOnetimeCartStore';
import useClientName from '../../business/layout/useClientName';
import { useNavigate } from 'react-router-dom';

const DetailComponent = () => {
  const navigate = useNavigate();
  const { clientName } = useClientName();
  const { onetimeCart, updateOnetimeCart } = useOnetimeCartStore();
  const addToOnetimeCart = () => {
    //stock대신 quantity를 가진 newItem 객체 만들어서, 장바구니에 넣기
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
      updateOnetimeCart(newItem);
      console.log('단건배송 장바구니 목록: ', onetimeCart);
      setItemCountToAdd(0); //장바구니에 넣어준 다음에 수량 0으로 다시 변경 >> 장바구니 버튼 누르면 0으로 초기화 되는 것
      //modal창 띄우기
      // setIsDetailPageModalVisible(true);
      navigate(`/shopping/${clientName}/onetime/cart`);
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
      <MenuHeaderNav title={'단건배송 상세'} />
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
            addToCart={addToOnetimeCart}
            handleDirectOrder={handleDirectOrder}
          />
        </>
      ) : (
        <OneButtonFooterLayout footerText={'구매하기'} onClick={toggleDetailOption} />
      )}
    </>
  );
};

export default DetailComponent;

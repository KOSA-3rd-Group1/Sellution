import { formatPrice } from '../../../client/utility/functions/formatterFunction';
import { MinusIcon, PlusIcon, UpChevronIcon } from '../../utility/assets/Icons';

const DetailOptionComponent = ({
  productToShow,
  itemCountToAdd,
  setItemCountToAdd,
  increaseQuantity,
  decreaseQuantity,
  isDetailOptionVisible,
  toggleDetailOption,
}) => {
  const isOutOfStock = productToShow.stock === 0;

  return (
    <div
      className={`option-footer-box fixed z-10 w-full max-w-lg transition-bottom duration-300 ${isDetailOptionVisible ? 'bottom-16' : '-bottom-48'} bg-white pb-4 px-4 left-1/2 transform -translate-x-1/2 shadow-footer`}
    >
      <button
        className='footer-box-1 fold-button w-full flex justify-center items-center bg-transparent border-none p-2'
        onClick={toggleDetailOption}
      >
        <span className='fold-icon'>
          <UpChevronIcon className={'w-5 h-5 fill-gray-500'} />
        </span>
      </button>
      <div className='footer-box-2 option-box flex justify-between bg-gray-200 p-4'>
        <div className='left-box flex flex-col justify-center'>
          <div className='product-name font-bold text-sm mb-2'>{productToShow.name}</div>
          <div className='quantity-control flex items-center border border-gray-300 w-20'>
            <button
              className={`quantity-button w-6 h-6 bg-gray-300 flex justify-center items-center ${isOutOfStock ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={!isOutOfStock ? decreaseQuantity : null}
            >
              <MinusIcon className={'minus w-4 h-4 stroke-current text-gray-600'} />
            </button>
            <div className='quantity flex-1 text-center bg-white'>{itemCountToAdd}</div>
            <button
              className={`quantity-button w-6 h-6 bg-gray-300 flex justify-center items-center ${isOutOfStock ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={!isOutOfStock ? increaseQuantity : null}
            >
              <PlusIcon className={'plus w-4 h-4 stroke-current text-gray-600'} />
            </button>
          </div>
        </div>
        <div className='right-box flex flex-col justify-center items-end'>
          <div className='discount-box flex items-center'>
            <span className='discount-rate text-xs bg-red-500 text-white rounded-sm py-1 px-2 mr-2'>
              {productToShow.discountRate}%
            </span>
            <span className='price text-sm text-gray-400 line-through'>
              {formatPrice(productToShow.cost)}
            </span>
          </div>
          <span className='discount-price text-md font-bold'>
            {formatPrice(productToShow.discountedPrice)}
          </span>
        </div>
      </div>
      <div className='footer-box-3 flex justify-end items-center font-shadow mt-2'>

//         <span className='discount-price text-lg text-primary font-bold'>
//           {itemCountToAdd > 0 ? `${productToShow.discountedPrice * itemCountToAdd} 원` : ''}

        <span className='discount-price text-lg text-red-500 font-bold'>
          {itemCountToAdd > 0 ? formatPrice(productToShow.discountedPrice * itemCountToAdd) : ''}

        </span>
      </div>
    </div>
  );
};

export default DetailOptionComponent;

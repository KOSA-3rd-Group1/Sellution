import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    orderId: index + 1, // 주문 ID
    customerId: index + 1, // 회원 ID
    addressId: index + 1, // 주소 ID
    accountId: index + 1, // 계좌 ID
    productImage: '이미지1',
    code: `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`, // 주문 번호
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0], // 주문 시간
    orderedProduct: `user${index + 1}`, // 상품 정보 (각 상품별)

    count: `${Math.floor(1 + Math.random() * 20)}`, // 주문 수량 (각 상품별)
    type: ['단건', '정기 (월 단위)', '정기 (횟수 단위)'][Math.floor(Math.random() * 3)], // 주문 유형
    price: `${Math.floor(100000 + Math.random() * 500000)}`, // 상품 금액
    discountRate: `${Math.floor(10 + Math.random() * 50)}`, // 할인율
    status: ['주문 취소', '승인 대기', '주문 승인'][Math.floor(Math.random() * 3)], // 주문 진행 상황
  }));
};

const HEADERS = [
  {
    key: 'orderedProduct',
    label: '상품 정보',
    width: 'min-w-56 w-56 max-w-56',
  },
  {
    key: 'count',
    label: '수량',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'type',
    label: '주문 유형',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'price',
    label: '상품 금액',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'discountRate',
    label: '할인율(%)',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'discountedPrice',
    label: '할인 적용 후 금액',
    width: 'min-w-40 w-40 max-w-40 text-brandOrange',
  },
  {
    key: 'status',
    label: '진행 상태',
    width: 'min-w-44 w-44 max-w-44',
  },
];
const ROW_HEIGHT = 'min-h-14 h-14 max-h-14';

export const useOrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [data, setData] = useState({});

  const [orderProductData, setOrderProductData] = useState({});
  console.log(orderProductData);
  // 서버에 데이터 요청
  useEffect(() => {
    const DUMMY_DATA = generateDummyData(1)[0];

    setOrderProductData((prev) => [
      {
        ...prev,
        id: DUMMY_DATA.orderId,
        productImage: DUMMY_DATA.productImage,
        orderedProduct: DUMMY_DATA.orderedProduct,
        count: DUMMY_DATA.count,
        type: DUMMY_DATA.type,
        price: DUMMY_DATA.price,
        discountRate: DUMMY_DATA.discountRate,
        discountedPrice: Math.round(DUMMY_DATA.price * (1 - DUMMY_DATA.discountRate * 0.01)),
        status: DUMMY_DATA.status,
      },
    ]);
  }, []);

  // 목록으로 이동
  const moveList = () => {
    navigate({
      pathname: '/order',
    });
  };

  return {
    HEADERS,
    ROW_HEIGHT,
    orderProductData,
    data,
    moveList,
  };
};

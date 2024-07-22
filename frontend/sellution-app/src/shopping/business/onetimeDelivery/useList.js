import axios from 'axios';
import { useEffect, useState } from 'react';

const useList = () => {
  const [onetimeProductList, setOnetimeProductList] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=> {
    const fetchProducts = async () => {
      try{
        const response = await axios.get('/');
        setOnetimeProductList(response.date);
      }
      catch(err){
        setError(err);
      }
      finally{
        setIsloading(false);
      }
    };
    fetchProducts();
  }, []);
  // const onetimeDeliveryProductList = [
  //   {
  //     id: 1,
  //     name: '단건 신선한 제철 과일 세트',
  //     category: '신선식품',
  //     price: '40000',
  //     stock: 50,
  //     discountRate: 10,
  //     discountedPrice: 36000,
  //     description:
  //       '신선한 제철 과일로 구성된 과일 세트입니다. 맛과 영양을 모두 갖춘 최고의 선택입니다.',
  //   },
  //   {
  //     id: 2,
  //     name: '단건 수제 비건 쿠키 세트',
  //     category: '베이커리',
  //     price: '25000',
  //     stock: 30,
  //     discountRate: 15,
  //     discountedPrice: 21250,
  //     description:
  //       '건강한 재료로 만든 수제 비건 쿠키 세트입니다. 맛있고 건강하게 즐길 수 있습니다.',
  //   },
  //   {
  //     id: 3,
  //     name: '단건 프리미엄 생연어',
  //     category: '신선식품',
  //     price: '70000',
  //     stock: 20,
  //     discountRate: 20,
  //     discountedPrice: 56000,
  //     description: '신선한 프리미엄 생연어입니다. 고소하고 부드러운 맛이 일품입니다.',
  //   },
  //   {
  //     id: 4,
  //     name: '단건 친환경 무농약 야채 박스',
  //     category: '신선식품',
  //     price: '30000',
  //     stock: 40,
  //     discountRate: 10,
  //     discountedPrice: 27000,
  //     description: '친환경 무농약 야채로 구성된 박스입니다. 건강한 식사를 위한 최고의 선택입니다.',
  //   },
  //   {
  //     id: 5,
  //     name: '단건 오가닉 면 유아용 이불 세트',
  //     category: '유아용품',
  //     price: '60000',
  //     stock: 25,
  //     discountRate: 15,
  //     discountedPrice: 51000,
  //     description:
  //       '부드럽고 편안한 오가닉 면으로 만든 유아용 이불 세트입니다. 민감한 피부에도 안심입니다.',
  //   },
  //   {
  //     id: 6,
  //     name: '단건 프리미엄 숙성 한우 등심',
  //     category: '신선식품',
  //     price: '120000',
  //     stock: 15,
  //     discountRate: 20,
  //     discountedPrice: 96000,
  //     description:
  //       '최고급 한우 등심을 숙성시켜 부드럽고 진한 맛을 자랑합니다. 특별한 날을 위한 완벽한 선택입니다.',
  //   },
  //   {
  //     id: 7,
  //     name: '단건 트렌디 디자인 선글라스',
  //     category: '패션잡화',
  //     price: '80000',
  //     stock: 35,
  //     discountRate: 25,
  //     discountedPrice: 60000,
  //     description:
  //       '스타일리시한 디자인의 선글라스입니다. 자외선 차단 기능이 뛰어나며, 다양한 룩에 어울립니다.',
  //   },
  //   {
  //     id: 8,
  //     name: '단건 고급 오리털 패딩',
  //     category: '의류',
  //     price: '150000',
  //     stock: 20,
  //     discountRate: 30,
  //     discountedPrice: 105000,
  //     description: '따뜻하고 가벼운 고급 오리털 패딩입니다. 겨울철 따뜻한 스타일을 완성해줍니다.',
  //   },
  //   {
  //     id: 9,
  //     name: '단건 프리미엄 그린티 세트',
  //     category: '음료',
  //     price: '50000',
  //     stock: 60,
  //     discountRate: 15,
  //     discountedPrice: 42500,
  //     description: '고급 그린티로 구성된 프리미엄 세트입니다. 향긋하고 깊은 맛을 자랑합니다.',
  //   },
  //   {
  //     id: 10,
  //     name: '단건 실버 펜던트 목걸이',
  //     category: '악세사리',
  //     price: '70000',
  //     stock: 40,
  //     discountRate: 20,
  //     discountedPrice: 56000,
  //     description:
  //       '세련된 디자인의 실버 펜던트 목걸이입니다. 다양한 스타일에 잘 어울리며, 고급스러운 느낌을 줍니다.',
  //   },
  // ];

  return {
    onetimeProductList,
    isLoading,
    error,
  };
};

export default useList;
